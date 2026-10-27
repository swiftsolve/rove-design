# Why the tokens are what they are

The reasons behind the token values. The values themselves live in Figma (and in `tokens.css`); this page doesn't repeat them, so it can't drift from them.

## Structure

- **Every colour lives once, in the Palette.** Color tokens point at Palette shades, and each shade is named by hue and darkness (`gray/850`, `blue/450`; higher is darker). The numbers aren't even steps: each shade was tuned for one job, and the number says how dark it is.
- **CSS names follow Figma names.** `bg/app` is `--bg-app`, `border/default` is `--border-default`; the build refuses a code syntax that doesn't match.
- **Typography comes from the text styles, not variables.** Figma can't bind a percentage line height to a variable, so line heights and letter spacings live only in the styles; copying them into variables would give the type scale two sources that could drift apart.

## Surfaces and lines

- **Backgrounds are an elevation ladder** (app, chrome, shell, panel, raised, inset, hover), not one flat panel colour.
- **The shell sits behind the cards.** Dark mode keeps it on the backdrop; light mode greys it a touch so the white cards keep floating on it. In light mode the title bar and rail sit near-white for the same reason.
- **Hairlines and the top highlight** make panels read as real surfaces lit from above.
- **Overlays flip with the theme:** white-on-dark in dark mode, near-black-on-light in light mode, so hovers, chips and tracks darken pale surfaces rather than disappearing on them.
- **Shadows give depth** instead of hard outlines; panels get a soft two-layer lift, menus and tooltips a deeper one.

## Text

- **`text/tertiary` is the lightest grey that still clears AA (4.5:1)**: on a hovered row in dark mode, and on the grey shell (not just the white cards) in light mode.
- **`text/accent` is for words on `accent/muted`** (a selected segment, a tinted button). The tint lowers contrast, so light mode uses the pressed accent to keep 4.5:1; dark mode's accent already clears it.

## Accent and fills

- **`accent/fill` sits a step darker than the accent.** The bright accent reads well as text but gives a white label only 3.2:1; the fill clears 4.5:1.
- **Fill hovers deepen rather than brighten:** any lighter fill would drop the white label below 4.5:1.
- **The Stop button's reds** (negative, fill, fill hover) each step darker and duller, so they read as three reds rather than two. White labels sit at 5.6:1 and 7.4:1 in light mode.

## Status

- **One shade per status hue for icons, bars and dots.** In light mode each is the lightest shade of its hue that clears 3:1 (the bar for graphics) on every surface it sits on, including the 14% tints of icon tiles and timeline markers. Each is held at the most saturated it can be at that lightness (OKLCH chroma at the sRGB edge), so the colours read bright rather than dark or brown.
- **Green moves from the dark theme's mint toward pure green** in light mode, where the gamut has more room.
- **Red stays a step below the sRGB edge,** where it would turn neon beside the other hues. Its hue sits a touch toward orange: at 0° or below, a light red reads salmon or pink.
- **Status words need 4.5:1, which the light-mode icon shades miss (3.5–4.4:1).** `text/positive`, `text/warning` and `text/negative` are the same hues, darkened just enough to clear it on every surface. Dark mode uses the icon shades, which already pass.
- **The capability scale's in-between steps** (good, poor) follow the same rules, with their hues pulled apart from their neighbours (good is yellow-green, poor is orange) so the four levels stay distinct.

## Opacity

- **Tint strengths are shared** so a tinted tile or an unlit bar reads the same wherever it appears. They're percentages, for `color-mix()`.

## Spacing, radius and focus

- **One 2px-based spacing scale:** every gap, padding and margin is one of its steps. `spacing/11` is the side inset the nav rail and the content column share, so the content sits as far from the window edge as the nav icons do.
- **Cards use one padding on every axis** (`--section-padding`), matching the gap the cards stack at, so they read as evenly inset.
- **`radius/md` is for the nav item and page-header chip,** a step rounder than `radius/sm`.
- **The focus ring is the same 1px accent line as the nav-flash highlight.** Controls get it outside their edge (`focus/offset`). Rows flush in a card draw it just inside (`--focus-inset`), square-cornered like the highlight.

## Type sizes

- **`font-size/xl` is for dialog titles,** a step under the page title.
