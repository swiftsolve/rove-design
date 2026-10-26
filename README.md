# @swiftsolve/rove-design

Design tokens for Rove, from the **Rove Design System** in Figma. Figma is the source of truth; this package turns its variables into CSS.

## Use

Install from a version tag. npm builds `dist/` on install.

```bash
npm install github:swiftsolve/rove-design#v2.0.0
```

```ts
import '@swiftsolve/rove-design/tokens.css'
```

Dark values sit on `:root`, Light values on `:root.theme-light`. `tokens.json` lists every token with its Figma name and both values.

The repo is private, so CI needs a token that can read it (see Rove's workflows). The Publish workflow can also put the package on GitHub Packages once the org's Packages budget allows private packages.

## Update the tokens

1. Change the variables in Figma.
2. Export them to `figma/variables.json`, either with the plugin in `figma-plugin/` (Figma desktop: Plugins → Development → Import plugin from manifest) or by asking Claude to export them through the Figma connection.
3. Run `npm run build` and check the diff in `dist/tokens.css`.
4. Bump the version, commit, push a matching tag (`v1.1.0`), and point Rove at the new tag.

## What's where

| Path | What |
| --- | --- |
| `figma/variables.json` | Raw Figma export. Every variable with a Web code syntax becomes that CSS variable. |
| `tokens/code.json` | Tokens Figma can't hold: shadows, font stacks, layout constants, motion. `{figma/name}` pulls a Figma value in per theme. |
| `scripts/build.mjs` | Writes `dist/tokens.css` and `dist/tokens.json`. No dependencies. |
| `docs/rationale.md` | Why the values are what they are (contrast targets, theme choices). |

Figma-only collections (Icon tone, Capability level) and variables without a code syntax aren't exported.
