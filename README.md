<div align="center">

<img src="docs/assets/rove-mark.svg" width="72" height="72" alt="Rove Mark">

# Rove Design System

`@swiftsolve/rove-design` · tokens for Rove, straight from Figma

[![Version](https://img.shields.io/github/package-json/v/swiftsolve/rove-design?label=version&labelColor=17181b&color=5b8cff)](https://github.com/swiftsolve/rove-design/tags)
[![Figma](https://img.shields.io/badge/Figma-source_of_truth-5b8cff?logo=figma&logoColor=white&labelColor=17181b)](https://www.figma.com/design/NoICIoyhWNOya9tOnNfEhH/Rove-Design-System)
[![DTCG](https://img.shields.io/badge/DTCG-2025.10-5b8cff?labelColor=17181b)](https://www.designtokens.org/tr/2025.10/format/)
[![Style Dictionary](https://img.shields.io/badge/Style_Dictionary-5-5b8cff?labelColor=17181b)](https://styledictionary.com/)
[![Themes](https://img.shields.io/badge/themes-Dark_·_Light-5b8cff?labelColor=17181b)](#-use)
[![Node](https://img.shields.io/badge/node-%E2%89%A522-5b8cff?logo=nodedotjs&logoColor=white&labelColor=17181b)](.nvmrc)

[🎨 Figma file](https://www.figma.com/design/NoICIoyhWNOya9tOnNfEhH/Rove-Design-System) &nbsp;·&nbsp;
[🖼️ Slideshow](https://swiftsolve.github.io/rove-design/) &nbsp;·&nbsp;
[📐 DESIGN.md](DESIGN.md) &nbsp;·&nbsp;
[💡 Rationale](docs/rationale.md)

</div>

---

Figma is the source of truth; this package turns its variables and text styles into DTCG token files, and those into CSS with [Style Dictionary](https://styledictionary.com/).

> [!TIP]
> **Building Rove UI?** [`DESIGN.md`](DESIGN.md) says which token to use for what, with every value. It ships in the package, so coding agents in Rove can read it from `node_modules/@swiftsolve/rove-design/DESIGN.md`.

## 📦 Use

Install from a version tag. npm builds `tokens.css` and `tokens/` on install, which needs Node 22 (see `.nvmrc`).

```bash
npm install github:swiftsolve/rove-design#v5.3.0
```

```css
@import '@swiftsolve/rove-design/tokens.css';
```

Dark values sit on `:root`, Light values on `:root.theme-light`. CSS names follow the Figma names: `bg/app` is `--bg-app`, `spacing/12` is `--spacing-12`.

Each Figma text style becomes four tokens: `--type-<style>-size`, `-weight`, `-line-height` (a unitless ratio) and `-letter-spacing` (in `em`). `Metric/Display` gives `--type-metric-display-size` and so on. A size bound to a variable comes through as that variable (`var(--font-size-3xl)`).

The repo is public, so installing from a tag needs no token. The Publish workflow can also put the package on GitHub Packages.

### 🧩 DTCG

`tokens/` holds the same tokens in the [Design Tokens Format](https://www.designtokens.org/tr/2025.10/format/) (2025.10), for Style Dictionary, Tokens Studio and similar tools:

| File | What |
| --- | --- |
| `palette.tokens.json` | Every colour, once |
| `color.dark.tokens.json`, `color.light.tokens.json` | The Color tokens in each theme, pointing at the palette (`{gray.850}`) |
| `spacing.tokens.json`, `typography.tokens.json`, `opacity.tokens.json` | The other Figma collections |
| `text-styles.tokens.json` | Each text style as a `typography` token |
| `code.tokens.json` | The code-only tokens (shadows, motion, layout) |

A theme is every file plus one of the two color files. Paths follow the Figma names (`bg/app` is `bg.app`). Tokens that other tokens point at but that aren't CSS variables (the palette, the shadow colours) are marked `"$extensions": { "net.swiftsolve.rove-design": { "css": false } }`. CSS-only expressions (`--focus-inset`, a `calc()`) aren't in them.

## 🔄 Update the tokens

1. Change the variables or text styles in Figma.
2. Export them to `src/figma/variables.json` and `src/figma/text-styles.json`, either with the plugin in `figma-plugin/` (Figma desktop: Plugins → Development → Import plugin from manifest; then **Export**) or by asking Claude to export them through the Figma connection.
3. Run `npm run build` (Node 22) and check `tokens.css`. It writes the DTCG files, then generates `tokens.css` from them with Style Dictionary, then rewrites the token reference at the end of `DESIGN.md`. The build stops if a variable's code syntax doesn't match its name, or a DTCG reference doesn't resolve.
4. Commit the change.

## 🚀 Release

1. On the Figma cover (`COVER` page), set **Version** to the one you're about to release and **Updated** to today's date (`27 Oct 2026`). They're the one place a release can't be stamped from here: Figma's API can't edit canvas text on this plan, so do it by hand or ask Claude to through the Figma connection.
2. Bump, commit and tag in one step, then push both:

   ```bash
   npm version minor
   ```

   ```bash
   git push --follow-tags
   ```

   Use `patch` for fixes and `major` for breaking changes.
3. The tag runs the **Presentation** workflow, which exports the Figma file and republishes <https://swiftsolve.github.io/rove-design/>. The page's header shows the version from `package.json`. To republish between releases (after Figma edits), run the workflow by hand from the Actions tab.
4. Point Rove at the new tag (`github:swiftsolve/rove-design#v5.1.0`).

## 🗂️ What's where

| Path | What |
| --- | --- |
| `src/figma/variables.json` | Raw Figma export. Every variable with a Web code syntax becomes that CSS variable. |
| `src/figma/text-styles.json` | Raw export of the local text styles: font, size, weight, line height, letter spacing and the variables bound to them. Each style becomes a `--type-*` group. |
| `figma-plugin/` | The Figma plugin that writes the two exports. |
| `src/code-tokens.json` | What Figma variables can't hold: font stacks for the font-family variables, shadows, layout constants, motion. `{figma/name}` pulls a Figma value in per theme. |
| `DESIGN.md` | How to build Rove UI with the tokens. The rules at the top are written by hand; the token reference below the marker line is generated by the build. |
| `scripts/tokens/build.mjs` | `npm run build`: runs the three steps below and writes `tokens.css` at the package root, where the import path points. |
| `scripts/tokens/dtcg.mjs` | Figma export → the DTCG files in `tokens/`, checking that every reference resolves in both themes. |
| `scripts/tokens/css.mjs` | DTCG files → `tokens.css`, with Style Dictionary and a `rove/css` format: Dark on `:root`, what differs in Light on `:root.theme-light`, each text style as four `--type-*` variables (letter spacing included). |
| `scripts/tokens/design.mjs` | Figma export and `tokens.css` → the token reference in `DESIGN.md`: every token by name and Figma description, with values for the scales (spacing, radius, type, opacity) but not the colours, so nobody copies a hex. |
| `scripts/presentation/export.mjs` | `npm run present`: exports the Figma file's pages to `presentation/index.html`, a slideshow styled with the tokens. Needs `FIGMA_TOKEN` (a Figma personal access token, `file_content:read`) in `.env.local`. |
| `scripts/presentation/open.mjs` | `npm run present:open`: opens the exported presentation in your browser. |
| `scripts/presentation/publish.mjs` | `npm run present:publish`: pushes the exported presentation to the `gh-pages` branch, which GitHub Pages serves at <https://swiftsolve.github.io/rove-design/>. Each publish replaces the last. |
| `.github/workflows/presentation.yml` | Runs the export and publish on every `v*` tag, or by hand. Needs the `FIGMA_TOKEN` repository secret. |
| `docs/rationale.md` | Why the values are what they are (contrast targets, theme choices). |

Every colour lives once in the Palette collection (`gray/850`, `blue/450`; higher numbers are darker), and the Color tokens point at it. The Palette isn't in `tokens.css`: a token that points at a shade gets the shade's value there. Figma-only collections (Icon tone, Capability level) and variables without a code syntax aren't in `tokens.css` either.
