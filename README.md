# @swiftsolve/rove-design

Design tokens for Rove, from the **Rove Design System** in Figma. Figma is the source of truth; this package turns its variables and text styles into CSS, and into DTCG token files for other tools.

## Use

Install from a version tag. npm builds `tokens.css` and `tokens/` on install.

```bash
npm install github:swiftsolve/rove-design#v4.0.0
```

```css
@import '@swiftsolve/rove-design/tokens.css';
```

Dark values sit on `:root`, Light values on `:root.theme-light`. CSS names follow the Figma names: `bg/app` is `--bg-app`, `spacing/12` is `--spacing-12`.

Each Figma text style becomes four tokens: `--type-<style>-size`, `-weight`, `-line-height` (a unitless ratio) and `-letter-spacing` (in `em`). `Metric/Display` gives `--type-metric-display-size` and so on. A size bound to a variable comes through as that variable (`var(--font-size-3xl)`).

The repo is public, so installing from a tag needs no token. The Publish workflow can also put the package on GitHub Packages.

### DTCG

`tokens/` holds the same tokens in the [Design Tokens Format](https://www.designtokens.org/tr/2025.10/format/) (2025.10), for Style Dictionary, Tokens Studio and similar tools:

| File | What |
| --- | --- |
| `palette.tokens.json` | Every colour, once |
| `color.dark.tokens.json`, `color.light.tokens.json` | The Color tokens in each theme, pointing at the palette (`{gray.850}`) |
| `spacing.tokens.json`, `typography.tokens.json`, `opacity.tokens.json` | The other Figma collections |
| `text-styles.tokens.json` | Each text style as a `typography` token |
| `code.tokens.json` | The code-only tokens (shadows, motion, layout) |

A theme is every file plus one of the two color files. Paths follow the Figma names (`bg/app` is `bg.app`). CSS-only expressions (`--focus-inset`, a `calc()`) aren't in them.

## Update the tokens

1. Change the variables or text styles in Figma.
2. Export them to `figma/variables.json` and `figma/text-styles.json`, either with the plugin in `figma/plugin/` (Figma desktop: Plugins → Development → Import plugin from manifest; pick each file from the menu and download it) or by asking Claude to export them through the Figma connection.
3. Run `npm run build` and check `tokens.css`. The build stops if a variable's code syntax doesn't match its name, or a DTCG reference doesn't resolve.
4. Bump the version, commit, push a matching tag (`v1.1.0`), and point Rove at the new tag.

## What's where

| Path | What |
| --- | --- |
| `figma/variables.json` | Raw Figma export. Every variable with a Web code syntax becomes that CSS variable. |
| `figma/text-styles.json` | Raw export of the local text styles: font, size, weight, line height, letter spacing and the variables bound to them. Each style becomes a `--type-*` group. |
| `figma/plugin/` | The Figma plugin that writes the two exports. |
| `code-tokens.json` | What Figma variables can't hold: font stacks for the font-family variables, shadows, layout constants, motion. `{figma/name}` pulls a Figma value in per theme. |
| `scripts/build.mjs` | Writes `tokens.css` at the package root, where the import path points. No dependencies. |
| `scripts/dtcg.mjs` | Writes the DTCG files in `tokens/`, and checks that every reference resolves in both themes. |
| `scripts/present.mjs` | `npm run present`: exports the Figma file's pages to `presentation/index.html`, a slideshow styled with the tokens. Needs `FIGMA_TOKEN` (a Figma personal access token, `file_content:read`) in `.env.local`. |
| `scripts/open-presentation.mjs` | `npm run present:open`: opens the exported presentation in your browser. |
| `scripts/publish-presentation.mjs` | `npm run present:publish`: pushes the exported presentation to the `gh-pages` branch, which GitHub Pages serves at <https://swiftsolve.github.io/rove-design/>. Each publish replaces the last. |
| `docs/rationale.md` | Why the values are what they are (contrast targets, theme choices). |

Every colour lives once in the Palette collection (`gray/850`, `blue/450`; higher numbers are darker), and the Color tokens point at it. The Palette isn't in `tokens.css`: a token that points at a shade gets the shade's value there. Figma-only collections (Icon tone, Capability level) and variables without a code syntax aren't in `tokens.css` either.
