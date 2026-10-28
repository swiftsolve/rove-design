/**
 * Move the plugin's two exports from Downloads into src/figma/, then build:
 *
 *   npm run import                     # from ~/Downloads, then npm run build
 *   npm run import -- --from ~/Desktop
 *
 * Takes the newest variables.json and text-styles.json in the folder, browser
 * duplicates included (`variables (2).json`), and moves them, so the next
 * import can't pick up a stale copy. Stops without touching src/figma/ if a
 * file is missing or isn't a plugin export, or if the two came from different
 * Figma files or from another file than the current exports.
 */
import { copyFile, readdir, readFile, rename, stat, unlink } from 'node:fs/promises'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

function flag(name, fallback) {
  const at = process.argv.indexOf(`--${name}`)
  return at === -1 ? fallback : process.argv[at + 1]
}

const from = resolve(flag('from', join(homedir(), 'Downloads')).replace(/^~(?=$|\/|\\)/, homedir()))
const tidy = (path) => path.replace(homedir(), '~')

const EXPORTS = [
  { name: 'variables.json', valid: (json) => Array.isArray(json.collections) && Array.isArray(json.variables), count: (json) => `${json.variables.length} variables` },
  { name: 'text-styles.json', valid: (json) => Array.isArray(json.styles), count: (json) => `${json.styles.length} text styles` },
]

function fail(message) {
  console.error(message)
  process.exit(1)
}

/** The newest file in `from` named `name`, or a browser's copy of it. */
async function newest(name) {
  const base = name.replace(/\.json$/, '')
  const pattern = new RegExp(`^${base}(?: \\(\\d+\\)|[-_]\\d+)?\\.json$`)
  const entries = await readdir(from).catch(() => fail(`Can't read ${tidy(from)}. Pass the folder with --from.`))
  const found = await Promise.all(entries.filter((f) => pattern.test(f)).map(async (f) => ({ path: join(from, f), time: (await stat(join(from, f))).mtimeMs })))
  return found.sort((a, b) => b.time - a.time)[0]?.path
}

const current = await readFile(join(ROOT, 'src/figma/variables.json'), 'utf8').then(JSON.parse, () => null)
const files = []
for (const spec of EXPORTS) {
  const path = await newest(spec.name)
  if (!path) fail(`No ${spec.name} in ${tidy(from)}. Export from the plugin first, or pass the folder with --from.`)
  const json = await readFile(path, 'utf8').then(JSON.parse, () => fail(`${tidy(path)} isn't valid JSON.`))
  if (!spec.valid(json)) fail(`${tidy(path)} isn't a ${spec.name} export from the Rove Tokens Export plugin.`)
  files.push({ ...spec, path, json })
}

const [variables, textStyles] = files.map((f) => f.json.file)
if (variables?.key && textStyles?.key && variables.key !== textStyles.key) {
  fail(`The two exports come from different Figma files (${variables.name} and ${textStyles.name}). Export both again from one file.`)
}
if (variables?.key && current?.file?.key && variables.key !== current.file.key) {
  fail(`These exports are from ${variables.name} (${variables.key}), not ${current.file.name} (${current.file.key}). Export from the Rove Design System file.`)
}

for (const file of files) {
  const to = join(ROOT, 'src/figma', file.name)
  // rename can't cross drives; copy and delete instead.
  await rename(file.path, to).catch(async (error) => {
    if (error.code !== 'EXDEV') throw error
    await copyFile(file.path, to)
    await unlink(file.path)
  })
  console.log(`src/figma/${file.name}: ${file.count(file.json)}, from ${tidy(file.path)}`)
}

await import('./build.mjs')
