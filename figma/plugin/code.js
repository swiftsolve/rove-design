// Export every local variable and text style in the shapes figma/variables.json
// and figma/text-styles.json expect.
// Run from Figma desktop: Plugins > Development > Import plugin from manifest.
const round = (n, places) => +n.toFixed(places)
const source = () => `Figma file ${figma.fileKey ?? ''} (${figma.root.name})`.trim()

async function exportVariables() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync()
  const variables = await figma.variables.getLocalVariablesAsync()
  const byId = Object.fromEntries(variables.map((v) => [v.id, v]))
  return {
    source: source(),
    collections: collections.map((c) => ({ name: c.name, modes: c.modes.map((m) => m.name) })),
    variables: variables.map((v) => {
      const collection = collections.find((c) => c.id === v.variableCollectionId)
      const values = {}
      for (const mode of collection.modes) {
        const value = v.valuesByMode[mode.modeId]
        if (value && value.type === 'VARIABLE_ALIAS') values[mode.name] = { alias: byId[value.id].name }
        else if (typeof value === 'object') values[mode.name] = { r: round(value.r, 5), g: round(value.g, 5), b: round(value.b, 5), a: round(value.a, 4) }
        else values[mode.name] = value
      }
      return {
        name: v.name,
        collection: collection.name,
        type: v.resolvedType,
        code: v.codeSyntax.WEB || null,
        description: v.description || '',
        values,
      }
    }),
  }
}

// Text styles hold no numeric weight, so it comes from the style name.
const WEIGHTS = { thin: 100, 'extra light': 200, light: 300, regular: 400, medium: 500, 'semi bold': 600, bold: 700, 'extra bold': 800, black: 900 }
const weightOf = (style) => {
  const key = style.toLowerCase().replace('italic', '').replace(/([a-z])(bold|light)/, '$1 $2').replace(/[-_]/g, ' ').trim()
  return WEIGHTS[key || 'regular'] ?? null
}

async function exportTextStyles() {
  const styles = await figma.getLocalTextStylesAsync()
  return {
    source: source(),
    styles: await Promise.all(styles.map(async (s) => {
      const bound = {}
      for (const [field, alias] of Object.entries(s.boundVariables ?? {})) {
        bound[field] = (await figma.variables.getVariableByIdAsync(alias.id))?.name ?? alias.id
      }
      return {
        name: s.name,
        description: s.description || '',
        fontFamily: s.fontName.family,
        fontStyle: s.fontName.style,
        fontWeight: weightOf(s.fontName.style),
        fontSize: s.fontSize,
        lineHeight: s.lineHeight.unit === 'AUTO' ? { unit: 'AUTO' } : { unit: s.lineHeight.unit, value: round(s.lineHeight.value, 4) },
        letterSpacing: { unit: s.letterSpacing.unit, value: round(s.letterSpacing.value, 4) },
        boundVariables: bound,
      }
    })),
  }
}

figma.showUI(__html__, { width: 420, height: 320 })
Promise.all([exportVariables(), exportTextStyles()]).then(([variables, textStyles]) =>
  figma.ui.postMessage({
    'variables.json': JSON.stringify(variables, null, 2),
    'text-styles.json': JSON.stringify(textStyles, null, 2),
  }),
)
