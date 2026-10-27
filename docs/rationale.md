# Why the values are what they are

The reasoning behind the token values, carried over from Rove's `index.css` when the tokens moved here. The values themselves now come from Figma; this is the rationale.

Typography is exported from Figma's text styles, not variables. Figma can't bind a percentage line height to a variable, so line heights and letter spacings live only in the styles; copying them into variables as well would give the type scale two sources that could drift apart.

```css
:root {
  /* Surfaces — a genuine elevation ladder rather than one flat panel colour */
  --bg-app: #0a0b0e;
  --bg-chrome: #0c0d11;
  --bg-panel: #141519;
  --bg-raised: #191a1f;
  --bg-inset: #0e0f13;
  --bg-hover: #202127;

  /* Hairlines — panels read as real surfaces lit from above */
  --border: rgba(255, 255, 255, 0.07);
  --border-strong: rgba(255, 255, 255, 0.11);
  --border-hairline-top: rgba(255, 255, 255, 0.05);

  --text-primary: #f5f6f8;
  --text-secondary: #a4a7b2;
  /* The lightest that still clears AA (4.5:1) on a hovered row (--bg-hover). */
  --text-tertiary: #868992;

  --accent: #5b8cff;
  --accent-hover: #6f9bff;
  --accent-press: #4d7ef0;
  --accent-muted: rgba(91, 140, 255, 0.14);
  /* Accent for words sitting on --accent-muted (a selected segment, a tinted
     button). The tint lowers contrast, so light mode needs a darker blue here
     to keep 4.5:1; dark mode's accent already clears it. */
  --text-accent: var(--accent);
  /* Solid fills under white labels. The bright accent reads well as text on the
     dark surfaces but gives white text only 3.2:1, so filled buttons sit a step
     darker to clear AA (4.5:1). Hover deepens rather than brightens: any lighter
     fill would drop the white label below 4.5:1. */
  --accent-fill: #476ec8;
  --accent-fill-hover: #3d62b8;
  --status-negative-fill: #ba4136;

  --status-positive: #43d6a0;
  --status-warning: #f5c451;
  /* Red sits at hue 5°, a touch toward orange: at 0° or below, a light red
     reads salmon or pink. Still well clear of --status-poor's orange. */
  --status-negative: #f6675a;
  /* Status colour for words ("Online", "Slow"). The dark theme uses the same
     shade as the icons and bars beside them; the light theme darkens them to
     pass as text (see .theme-light). */
  --text-positive: var(--status-positive);
  --text-warning: var(--status-warning);
  --text-negative: var(--status-negative);
  /* The two in-between steps of the capability scale (excellent → good → fair →
     poor), which sit between --status-positive/--status-warning and --status-warning/--status-negative. */
  --status-good: #7fd88a;
  --status-poor: #f0a35e;
  --text-good: var(--status-good);
  --text-poor: var(--status-poor);

  --series-down: #6aa0ff;
  --series-up: #b39dff;

  /* The content area behind the cards. Dark mode keeps it on the backdrop; light
     mode greys it a touch so the white cards keep floating on it. */
  --bg-shell: var(--bg-app);
  /* Translucent fills that lift off whatever sits behind them: the nav hover, the
     page-header icon chip, and unlit meter segments in a testing list. */
  --fill-nav-hover: rgba(255, 255, 255, 0.04);
  --fill-chip: rgba(255, 255, 255, 0.05);
  --fill-track: rgba(255, 255, 255, 0.06);

  /* White labels and glyphs on solid fills (filled and stop buttons, the toggle
     knob), and the red the close button fills with on hover. */
  --text-on-fill: #fff;
  --window-close-hover: #e5484d;
  --status-negative-fill-hover: color-mix(in srgb, var(--status-negative-fill) 84%, #000);

  /* Wash strengths for currentColor tints, so a tinted tile or an unlit bar reads
     the same wherever it appears. Percentages, for color-mix(). */
  --opacity-tint-md: 14%;
  --opacity-tint-sm: 10%;
  --opacity-tint-xs: 8%;
  --opacity-tint-lg: 22%;
  --opacity-unlit: 22%;
  --opacity-disabled: 40%;

  /* The faint wash under a hovered row or connection strip, the lit bars of a
     testing list, scrollbar thumbs, the text selection and the dialog backdrop. */
  --fill-row-hover: rgba(255, 255, 255, 0.03);
  --fill-track-lit: rgba(255, 255, 255, 0.16);
  --fill-scrollbar: rgba(255, 255, 255, 0.1);
  --fill-selection: rgba(59, 130, 246, 0.35);
  --bg-scrim: rgba(0, 0, 0, 0.5);

  /* Soft lift so panels read as raised surfaces on the near-black backdrop —
     depth from shadow rather than hard outlines. */
  --shadow-panel: 0 1px 2px rgba(0, 0, 0, 0.35), 0 4px 12px rgba(0, 0, 0, 0.22);
  --shadow-raised: 0 12px 32px rgba(0, 0, 0, 0.45);

  --radius-lg: 13px;
  --radius-sm: 8px;
  --radius-xs: 5px;
  /* The nav item and page-header chip: a step rounder than --radius-sm. */
  --radius-md: 10px;
  --radius-full: 999px;
  /* Keyboard focus ring — the same 1px accent line as the nav-flash highlight.
     Controls get it outside their edge (--focus-offset). Rows that sit flush in a
     card draw it just inside (--focus-inset), square-cornered like the highlight,
     rounding only where the row meets the card's own rounded corners. */
  --focus-ring-width: 1px;
  --focus-ring: var(--focus-ring-width) solid var(--accent);
  --focus-offset: 2px;
  --focus-inset: calc(-1 * var(--focus-ring-width));

  /* One padding value on every axis so cards read as evenly inset, matching the
     14px gap the cards stack at. */
  --section-padding: 14px;
  --section-header-padding-y: var(--section-padding);
  --section-header-padding-x: var(--section-padding);
  --section-header-min-height: 42px;
  --section-header-height: 44px;
  --section-body-padding: var(--section-padding);

  /* One 2px-based spacing scale — every gap/pad/margin should be one of these. */
  --space-2: 2px;
  --space-4: 4px;
  --space-6: 6px;
  --space-8: 8px;
  --space-10: 10px;
  --space-12: 12px;
  --space-16: 16px;
  --space-20: 20px;
  --row-padding-y: 8px;
  /* The side inset the nav rail and the content column share, so the content
     sits as far from the window edge as the nav icons do. */
  --space-11: 11px;

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-fast: 140ms;
  --duration-normal: 220ms;

  --font: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-numeric: 'Questrial', ui-sans-serif, system-ui, sans-serif;

  --font-size-2xs: 10px;
  --font-size-xs: 11px;
  --font-size-sm: 12px;
  --font-size-md: 13px;
  --font-size-lg: 14px;
  /* Dialog titles: a step under the page title. */
  --font-size-xl: 15px;
  --font-size-2xl: 17px;
  --font-size-3xl: 28px;

  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
}
:root.theme-light {
  --bg-app: #f6f7fa;
  --bg-chrome: #fafbfd;
  --bg-panel: #ffffff;
  --bg-raised: #f6f7fa;
  --bg-inset: #f4f6fa;
  --bg-hover: #e9ecf2;

  --border: rgba(15, 18, 30, 0.10);
  --border-strong: rgba(15, 18, 30, 0.16);
  --border-hairline-top: rgba(255, 255, 255, 0.7);

  --text-primary: #1a1c22;
  --text-secondary: #565a66;
  /* The lightest grey that still clears AA (4.5:1) on the grey shell
     (--bg-shell), not just on the white cards. */
  --text-tertiary: #6a6d77;

  --accent: #3a69d5;
  --accent-hover: #3360c9;
  --accent-press: #2c55b8;
  --accent-muted: rgba(58, 105, 213, 0.12);
  --text-accent: #2c55b8;
  --accent-fill: #3a69d5;
  --accent-fill-hover: #2f5bc0;
  /* The red Stop button and its hover: each a step darker and duller than the
     one before, as in the dark theme, so negative, fill and hover read as three
     reds rather than two. White labels sit at 5.6:1 and 7.4:1. */
  --status-negative-fill: #b24238;
  --status-negative-fill-hover: #913930;

  /* One shade per status hue for icons, bars and dots. Each is the lightest
     shade of its hue that still clears 3:1 (the bar for icons and other
     graphics) on every surface it sits on: the white cards, the grey inset and
     shell, and the 14% tints of icon tiles and timeline markers. Each is held
     at the most saturated it can be at that lightness (OKLCH chroma at the
     sRGB edge), so the colours read bright rather than dark or brown. Green is
     nudged from the dark theme's mint toward pure green, where the gamut has
     more room. Red is the exception to the saturation rule: at the sRGB edge
     it turns neon beside the other hues, so it stays a step below it, at the
     dark theme's hue (still 3.3:1 or more on every surface). */
  --status-positive: #01934a;
  --status-warning: #ac7601;
  --status-negative: #cf4134;
  /* Status words ("Online", "Slow", "5 Up") need 4.5:1, which the shades above
     miss (3.5–4.4:1). These are the same hues, darkened just enough to clear
     it on every surface they sit on. */
  --text-positive: #017e40;
  --text-warning: #926401;
  --text-negative: #c53b2f;
  /* The capability scale's in-between steps, on the same rule. Their hues are
     pulled apart from their neighbours (good is yellow-green, poor is orange)
     so the four levels stay distinct. */
  --status-good: #4a9001;
  --status-poor: #ce6001;

  --series-down: #3a69d5;
  --series-up: #7154e8;

  /* The title bar and nav rail sit near-white (--bg-chrome) while the content
     area stays a touch greyer, so the white cards keep floating on it rather
     than washing out. Overlays flip from white-on-dark to black-on-light so they
     darken rather than disappear on pale surfaces. */
  --bg-shell: #f0f2f6;
  --fill-nav-hover: rgba(15, 18, 30, 0.05);
  --fill-chip: rgba(15, 18, 30, 0.05);
  --fill-track: rgba(15, 18, 30, 0.07);
  --fill-row-hover: rgba(15, 18, 30, 0.03);
  --fill-track-lit: rgba(15, 18, 30, 0.18);
  --fill-scrollbar: rgba(15, 18, 30, 0.18);

  --shadow-panel: 0 1px 2px rgba(15, 20, 35, 0.06), 0 4px 12px rgba(15, 20, 35, 0.05);
  --shadow-raised: 0 12px 32px rgba(15, 20, 35, 0.14);
}
```
