/**
 * Build dist/tokens.css and dist/tokens.json from the Figma export plus the
 * code-only tokens.
 *
 *   figma/variables.json  raw export of the Figma variables (see figma-plugin/)
 *   tokens/code.json      tokens Figma can't hold, which may pull Figma values in
 *
 * Every Figma variable with a Web code syntax becomes the CSS variable it names.
 * Dark values go on :root; Light values that differ go on :root.theme-light.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = async (path) => JSON.parse(await readFile(resolve(ROOT, path), 'utf8'))

const figma = await read('figma/variables.json')
const code = await read('tokens/code.json')
const pkg = await read('package.json')

const DARK = 'Dark'
const LIGHT = 'Light'
const COLLECTION_ORDER = ['Color', 'Spacing', 'Typography', 'Opacity']

const byName = new Map(figma.variables.map((v) => [v.name, v]))
const cssName = (v) => /^var\((--[\w-]+)\)$/.exec(v.code ?? '')?.[1] ?? null

const exported = figma.variables
  .filter((v) => cssName(v) && !code.skip.includes(v.name) && COLLECTION_ORDER.includes(v.collection))
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

/** A variable as CSS: aliases become var() references to the variable they point at. */
function cssValue(v, mode) {
  const value = modeValue(v, mode)
  if (value && value.alias) {
    const target = byName.get(value.alias)
    const name = target && cssName(target)
    if (!name) throw new Error(`${v.name} aliases ${value.alias}, which has no code syntax`)
    return `var(${name})`
  }
  if (v.type === 'COLOR') return formatColor(value)
  if (v.collection === 'Opacity') {
    return code.formats[cssName(v)] === 'fraction' ? String(value / 100) : `${value}%`
  }
  if (v.type === 'FLOAT') return `${value}px`
  return String(value)
}

function interpolate(template, mode) {
  return template.replace(/\{([\w/-]+)\}/g, (_, name) => {
    const v = byName.get(name)
    if (!v) throw new Error(`code.json references unknown Figma variable ${name}`)
    return rawValue(v, mode)
  })
}

const dark = []
const light = []
const json = {}
let collection = null
for (const v of exported) {
  if (v.collection !== collection) {
    collection = v.collection
    dark.push(`\n  /* ${collection} */`)
  }
  const name = cssName(v)
  const d = cssValue(v, DARK)
  dark.push(`  ${name}: ${d};${v.description ? ` /* ${v.description} */` : ''}`)
  json[name] = { figma: v.name, value: d }
  if (v.collection === 'Color') {
    const l = cssValue(v, LIGHT)
    if (l !== d) {
      light.push(`  ${name}: ${l};`)
      json[name].light = l
    }
  }
}
dark.push('\n  /* Code-only */')
for (const [name, template] of Object.entries(code.tokens)) {
  const d = interpolate(template, DARK)
  const l = interpolate(template, LIGHT)
  dark.push(`  ${name}: ${d};`)
  json[name] = { value: d }
  if (l !== d) {
    light.push(`  ${name}: ${l};`)
    json[name].light = l
  }
}

const header = `/* ${pkg.name} ${pkg.version}. Generated from Figma by scripts/build.mjs; do not edit. */`
const css = `${header}\n:root {${dark.join('\n')}\n}\n\n:root.theme-light {\n${light.join('\n')}\n}\n`

await mkdir(resolve(ROOT, 'dist'), { recursive: true })
await writeFile(resolve(ROOT, 'dist/tokens.css'), css)
await writeFile(resolve(ROOT, 'dist/tokens.json'), `${JSON.stringify(json, null, 2)}\n`)
console.log(`dist/tokens.css: ${Object.keys(json).length} tokens, ${light.length} light overrides`)
