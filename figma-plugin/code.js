// Export every local variable in the shape figma/variables.json expects.
// Run from Figma desktop: Plugins > Development > Import plugin from manifest.
async function exportVariables() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync()
  const variables = await figma.variables.getLocalVariablesAsync()
  const byId = Object.fromEntries(variables.map((v) => [v.id, v]))
  const round = (n, places) => +n.toFixed(places)
  return {
    source: `Figma file ${figma.fileKey ?? ''} (${figma.root.name})`.trim(),
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

figma.showUI(__html__, { width: 420, height: 320 })
exportVariables().then((data) => figma.ui.postMessage(JSON.stringify(data, null, 2)))
