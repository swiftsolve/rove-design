/**
 * Build tokens.css and the DTCG files in tokens/ from the Figma export plus the
 * code-only tokens.
 *
 *   figma/variables.json    raw export of the Figma variables (see figma/plugin/)
 *   figma/text-styles.json  raw export of the Figma text styles
 *   code-tokens.json        what Figma variables can't hold, which may pull Figma values in
 *
 * Every Figma variable with a Web code syntax becomes that CSS variable, and the
 * code syntax must be the Figma name with `/` as `-` (`bg/app` is `--bg-app`).
 * Dark values go on :root; Light values that differ go on :root.theme-light.
 * Every text style becomes a --type-<name>-* group on :root.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { writeDtcg } from './dtcg.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = async (path) => JSON.parse(await readFile(resolve(ROOT, path), 'utf8'))

const figma = await read('figma/variables.json')
const textStyles = await read('figma/text-styles.json')
const code = await read('code-tokens.json')
const pkg = await read('package.json')

const DARK = 'Dark'
const LIGHT = 'Light'
const COLLECTION_ORDER = ['Color', 'Spacing', 'Typography', 'Opacity']

const byName = new Map(figma.variables.map((v) => [v.name, v]))
const cssName = (v) => /^var\((--[\w-]+)\)$/.exec(v.code ?? '')?.[1] ?? null

for (const v of figma.variables) {
  const expected = `var(--${v.name.replace(/\//g, '-')})`
  if (v.code && v.code !== expected) throw new Error(`${v.name} has code syntax ${v.code}; it must be ${expected}`)
}

const exported = figma.variables
  .filter((v) => cssName(v) && COLLECTION_ORDER.includes(v.collection))
  .sort((a, b) => COLLECTION_ORDER.indexOf(a.collection) - COLLECTION_ORDER.indexOf(b.collection))

function hex(n) {
  return Math.round(n * 255).toString(16).padStart(2, '0')
}

function formatColor({ r, g, b, a }) {
  if (a >= 1) return `#${hex(r)}${hex(g)}${hex(b)}`
  const ch = (n) => Math.round(n * 255)
  return `rgba(${ch(r)}, ${ch(g)}, ${ch(b)}, ${+a.toFixed(3)})`
}

/** The mode a variable's value should be read in: its own Light/Dark, or its only mode. */
function modeValue(v, mode) {
  return v.values[mode] ?? Object.values(v.values)[0]
}

/** Follow aliases down to a concrete value, for interpolation into code tokens. */
function rawValue(v, mode) {
  let value = modeValue(v, mode)
  for (let hops = 0; value && value.alias && hops < 8; hops++) value = modeValue(byName.get(value.alias), mode)
  return v.type === 'COLOR' ? formatColor(value) : value
}

/**
 * A variable as CSS: an alias of another exported variable becomes a var()
 * reference to it; an alias of a Palette shade (not exported) becomes its value.
 */
function cssValue(v, mode) {
  if (code.figma[v.name]) return interpolate(code.figma[v.name], mode)
  const value = modeValue(v, mode)
  if (value && value.alias) {
    const target = byName.get(value.alias)
    if (!target) throw new Error(`${v.name} aliases ${value.alias}, which isn't in the export`)
    if (target.collection === 'Palette') return rawValue(target, mode)
    const name = cssName(target)
    if (!name) throw new Error(`${v.name} aliases ${value.alias}, which has no code syntax`)
    return `var(${name})`
  }
  if (v.type === 'COLOR') return formatColor(value)
  if (v.collection === 'Opacity') return `${value}%`
  if (v.type === 'FLOAT') return `${value}px`
  return String(value)
}

function interpolate(template, mode) {
  return template.replace(/\{([\w/-]+)\}/g, (_, name) => {
    const v = byName.get(name)
    if (!v) throw new Error(`code-tokens.json references unknown Figma variable ${name}`)
    return rawValue(v, mode)
  })
}

const dark = []
const light = []
let count = 0
let collection = null
for (const v of exported) {
  if (v.collection !== collection) {
    collection = v.collection
    dark.push(`\n  /* ${collection} */`)
  }
  const name = cssName(v)
  const d = cssValue(v, DARK)
  dark.push(`  ${name}: ${d};${v.description ? ` /* ${v.description} */` : ''}`)
  count++
  if (v.collection === 'Color') {
    const l = cssValue(v, LIGHT)
    if (l !== d) light.push(`  ${name}: ${l};`)
  }
}
dark.push('\n  /* Code-only */')
for (const [name, template] of Object.entries(code.tokens)) {
  const d = interpolate(template, DARK)
  const l = interpolate(template, LIGHT)
  dark.push(`  ${name}: ${d};`)
  count++
  if (l !== d) light.push(`  ${name}: ${l};`)
}

/** A text style field as CSS: a var() when it's bound to an exported variable, else the value. */
function boundOr(style, field, value) {
  const bound = style.boundVariables[field]
  const v = bound && byName.get(bound)
  return v && exported.includes(v) ? `var(${cssName(v)})` : value
}

const ratio = (percent) => +(percent / 100).toFixed(4)

function lineHeight({ unit, value }) {
  if (unit === 'AUTO') return 'normal'
  return unit === 'PERCENT' ? String(ratio(value)) : `${value}px`
}

function letterSpacing({ unit, value }) {
  if (value === 0) return '0'
  return unit === 'PERCENT' ? `${ratio(value)}em` : `${value}px`
}

dark.push('\n  /* Type styles */')
for (const style of textStyles.styles) {
  if (style.fontWeight == null) throw new Error(`Text style ${style.name} has a weight build.mjs can't read: ${style.fontStyle}`)
  const slug = style.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const group = {
    size: boundOr(style, 'fontSize', `${style.fontSize}px`),
    weight: boundOr(style, 'fontWeight', String(style.fontWeight)),
    'line-height': boundOr(style, 'lineHeight', lineHeight(style.lineHeight)),
    'letter-spacing': boundOr(style, 'letterSpacing', letterSpacing(style.letterSpacing)),
  }
  for (const [prop, value] of Object.entries(group)) {
    dark.push(`  --type-${slug}-${prop}: ${value};`)
    count++
  }
}

const header = `/* ${pkg.name} ${pkg.version}. Generated from Figma by scripts/build.mjs; do not edit. */`
const css = `${header}\n:root {${dark.join('\n')}\n}\n\n:root.theme-light {\n${light.join('\n')}\n}\n`

// At the package root, where `@swiftsolve/rove-design/tokens.css` points, so
// every tool (bundlers and editors alike) finds the same file.
await writeFile(resolve(ROOT, 'tokens.css'), css)
console.log(`tokens.css: ${count} tokens, ${light.length} light overrides`)

const files = await writeDtcg({
  dir: resolve(ROOT, 'tokens'),
  variables: figma.variables,
  textStyles: textStyles.styles,
  code,
  figmaOverride: (v, mode) => code.figma[v.name] && interpolate(code.figma[v.name], mode),
})
console.log(`tokens/: ${files.join(', ')}`)
