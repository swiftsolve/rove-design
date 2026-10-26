# @swiftsolve/rove-design

Design tokens for Rove, from the **Rove Design System** in Figma. Figma is the source of truth; this package turns its variables into CSS.

## Use

```bash
npm install @swiftsolve/rove-design
```

```ts
import '@swiftsolve/rove-design/tokens.css'
```

Dark values sit on `:root`, Light values on `:root.theme-light`. `tokens.json` lists every token with its Figma name and both values.

Installing from GitHub Packages needs this in the consuming repo's `.npmrc`, and a token with `read:packages` in `NODE_AUTH_TOKEN`:

```
@swiftsolve:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

## Update the tokens

1. Change the variables in Figma.
2. Export them to `figma/variables.json`, either with the plugin in `figma-plugin/` (Figma desktop: Plugins → Development → Import plugin from manifest) or by asking Claude to export them through the Figma connection.
3. Run `npm run build` and check the diff in `dist/tokens.css`.
4. Bump the version, commit, and push a matching tag (`v1.1.0`). The Publish workflow publishes it.

## What's where

| Path | What |
| --- | --- |
| `figma/variables.json` | Raw Figma export. Every variable with a Web code syntax becomes that CSS variable. |
| `tokens/code.json` | Tokens Figma can't hold: shadows, font stacks, layout constants, motion. `{figma/name}` pulls a Figma value in per theme. |
| `scripts/build.mjs` | Writes `dist/tokens.css` and `dist/tokens.json`. No dependencies. |

Figma-only collections (Icon tone, Capability level) and variables without a code syntax aren't exported.
