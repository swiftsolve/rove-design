# Why the values are what they are

The reasoning behind the token values, carried over from Rove's `index.css` when the tokens moved here. The values themselves now come from Figma; this is the rationale.

```css
:root {
  /* Surfaces — a genuine elevation ladder rather than one flat panel colour */
  --bg-app: #0a0b0e;
  --bg-app-2: #0c0d11;
  --bg-panel: #141519;
  --bg-panel-hi: #191a1f;
  --bg-inset: #0e0f13;
  --bg-hover: #202127;

  /* Hairlines — panels read as real surfaces lit from above */
  --border: rgba(255, 255, 255, 0.07);
  --border-strong: rgba(255, 255, 255, 0.11);
  --hairline-top: rgba(255, 255, 255, 0.05);

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
  --accent-text: var(--accent);
  /* Solid fills under white labels. The bright accent reads well as text on the
     dark surfaces but gives white text only 3.2:1, so filled buttons sit a step
     darker to clear AA (4.5:1). Hover deepens rather than brightens: any lighter
     fill would drop the white label below 4.5:1. */
  --accent-fill: #476ec8;
  --accent-fill-hover: #3d62b8;
  --negative-fill: #b75b5b;

  --positive: #43d6a0;
  --warning: #f5c451;
  --negative: #f77b7b;
  /* Status colour for words ("Online", "Slow"). Both themes use the same shade
     as the icons and bars beside them, so a green place is one green; these stay
     separate tokens so a theme could split them if text ever needed it. */
  --positive-text: var(--positive);
  --warning-text: var(--warning);
  --negative-text: var(--negative);
  /* The two in-between steps of the capability scale (excellent → good → fair →
     poor), which sit between --positive/--warning and --warning/--negative. */
  --good: #7fd88a;
  --poor: #f0a35e;
  --good-text: var(--good);
  --poor-text: var(--poor);

  --series-down: #6aa0ff;
  --series-up: #b39dff;

  /* The content area behind the cards. Dark mode keeps it on the backdrop; light
     mode greys it a touch so the white cards keep floating on it. */
  --bg-shell: var(--bg-app);
  /* Translucent fills that lift off whatever sits behind them: the nav hover, the
     page-header icon chip, and unlit meter segments in a testing list. */
  --fill-hover-subtle: rgba(255, 255, 255, 0.04);
  --fill-chip: rgba(255, 255, 255, 0.05);
  --fill-track: rgba(255, 255, 255, 0.06);

  /* White labels and glyphs on solid fills (filled and stop buttons, the toggle
     knob), and the red the close button fills with on hover. */
  --text-on-fill: #fff;
  --close-hover: #e5484d;
  --negative-fill-hover: color-mix(in srgb, var(--negative-fill) 84%, #000);

  /* Wash strengths for currentColor tints, so a tinted tile or an unlit bar reads
     the same wherever it appears. Percentages, for color-mix(). */
  --opacity-tint: 14%;
  --opacity-tint-soft: 10%;
  --opacity-tint-faint: 8%;
  --opacity-tint-hover: 22%;
  --opacity-unlit: 22%;
  --opacity-disabled: 0.4;

  /* The faint wash under a hovered row or connection strip, the lit bars of a
     testing list, scrollbar thumbs, the text selection and the dialog backdrop. */
  --fill-row-hover: rgba(255, 255, 255, 0.03);
  --fill-track-lit: rgba(255, 255, 255, 0.16);
  --fill-scrollbar: rgba(255, 255, 255, 0.1);
  --selection: rgba(59, 130, 246, 0.35);
  --scrim: rgba(0, 0, 0, 0.5);

  /* Soft lift so panels read as raised surfaces on the near-black backdrop —
     depth from shadow rather than hard outlines. */
  --shadow-panel: 0 1px 2px rgba(0, 0, 0, 0.35), 0 4px 12px rgba(0, 0, 0, 0.22);
  --shadow-raised: 0 12px 32px rgba(0, 0, 0, 0.45);

  --radius: 13px;
  --radius-sm: 8px;
  --radius-xs: 5px;
  /* The nav item and page-header chip: a step rounder than --radius-sm. */
  --radius-nav: 10px;
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
     14px gap the cards stack at (--gap-stack). */
  --section-pad: 14px;
  --section-header-y: var(--section-pad);
  --section-header-x: var(--section-pad);
  --section-header-min: 42px;
  --section-header-h: 44px;
  --section-body: var(--section-pad);

  /* One 2px-based spacing scale — every gap/pad/margin should be one of these. */
  --gap-2xs: 2px;
  --gap-xs: 4px;
  --gap-tight: 6px;
  --gap-sm: 8px;
  --gap-md: 12px;
  --gap-stack: 10px;
  --gap-lg: 16px;
  --gap-xl: 20px;
  --row-py: 8px;
  /* The side inset the nav rail and the content column share, so the content
     sits as far from the window edge as the nav icons do. */
  --gap-inset: 11px;

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-fast: 140ms;
  --duration-normal: 220ms;

  --font: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-numeric: 'Questrial', ui-sans-serif, system-ui, sans-serif;
  /* Kept as an alias so any lingering references resolve to Questrial too. */
  --font-mono: var(--font-numeric);

  --text-micro: 10px;
  --text-caption: 11px;
  --text-small: 12px;
  --text-body: 13px;
  --text-section: 14px;
  /* Dialog titles: a step under the page title. */
  --text-dialog: 15px;
  --text-title: 17px;
  --text-display-sm: 28px;
  --text-display: 28px;

  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
}
:root.theme-light {
  --bg-app: #f6f7fa;
  --bg-app-2: #fafbfd;
  --bg-panel: #ffffff;
  --bg-panel-hi: #f6f7fa;
  --bg-inset: #f4f6fa;
  --bg-hover: #e9ecf2;

  --border: rgba(15, 18, 30, 0.10);
  --border-strong: rgba(15, 18, 30, 0.16);
  --hairline-top: rgba(255, 255, 255, 0.7);

  --text-primary: #1a1c22;
  --text-secondary: #565a66;
  /* The lightest grey that still clears AA (4.5:1) on the grey shell
     (--bg-shell), not just on the white cards. */
  --text-tertiary: #6a6d77;

  --accent: #3a69d5;
  --accent-hover: #3360c9;
  --accent-press: #2c55b8;
  --accent-muted: rgba(58, 105, 213, 0.12);
  --accent-text: #2c55b8;
  --accent-fill: #3a69d5;
  --accent-fill-hover: #2f5bc0;
  /* The red Stop button: the lightest red that keeps its white label at 4.5:1,
     a hair deeper than --negative. */
  --negative-fill: #ed0132;

  /* One shade per status hue, shared by its words, icons, bars and dots so a
     place that's green is one green throughout. Each is the lightest shade of
     its hue that still clears 3:1 (the bar for icons and other graphics) on
     every surface it sits on: the white cards, the grey inset and shell, and
     the 14% tints of icon tiles and timeline markers. Each is held at the most
     saturated it can be at that lightness (OKLCH chroma at the sRGB edge).
     This is a deliberate trade: status words in these colours ("Excellent",
     "Online", "5 Up") land near 3:1, short of the 4.5:1 text minimum, in
     exchange for colours that read bright rather than dark or brown. Green is
     nudged from the dark theme's mint toward pure green, where the gamut has
     more room. The -text tokens fall back to these (see :root). */
  --positive: #01934a;
  --warning: #ac7601;
  --negative: #f40134;
  /* The capability scale's in-between steps, on the same rule. Their hues are
     pulled apart from their neighbours (good is yellow-green, poor is orange)
     so the four levels stay distinct. */
  --good: #4a9001;
  --poor: #ce6001;

  --series-down: #3a69d5;
  --series-up: #7154e8;

  /* The title bar and nav rail sit near-white (--bg-app-2) while the content
     area stays a touch greyer, so the white cards keep floating on it rather
     than washing out. Overlays flip from white-on-dark to black-on-light so they
     darken rather than disappear on pale surfaces. */
  --bg-shell: #f0f2f6;
  --fill-hover-subtle: rgba(15, 18, 30, 0.05);
  --fill-chip: rgba(15, 18, 30, 0.05);
  --fill-track: rgba(15, 18, 30, 0.07);
  --fill-row-hover: rgba(15, 18, 30, 0.03);
  --fill-track-lit: rgba(15, 18, 30, 0.18);
  --fill-scrollbar: rgba(15, 18, 30, 0.18);

  --shadow-panel: 0 1px 2px rgba(15, 20, 35, 0.06), 0 4px 12px rgba(15, 20, 35, 0.05);
  --shadow-raised: 0 12px 32px rgba(15, 20, 35, 0.14);
}
```
