import { Code, Joined, Name, Page, Section, Table, TableRow } from './blocks'
import { colorDark, colorIn, cssName, flatten, isUsedIn, palette, paletteColor, pointsAt, shadeOf } from './tokens'

export default { title: 'Colour' }

// The Figma page's sections, in its order, each with the tokens it lists.
const SECTIONS = [
  {
    title: 'Backgrounds',
    intro: 'Base, surface and inset, plus popover, hover and the dialog scrim. Cards use bg/surface.',
    names: ['bg.base', 'bg.surface', 'bg.popover', 'bg.inset', 'bg.hover', 'bg.scrim'],
  },
  {
    title: 'Borders & fills',
    intro: 'Thin borders and see-through fills.',
    names: [
      'border.default',
      'border.strong',
      'border.highlight',
      'fill.default',
      'fill.strong',
      'fill.selection',
      'fill.faint',
      'fill.subtle',
    ],
  },
  {
    title: 'Text',
    intro: 'Three text colours, strongest to faintest, plus on-fill for text on solid buttons.',
    names: ['text.primary', 'text.secondary', 'text.tertiary', 'text.on-fill'],
  },
  {
    title: 'Accent',
    intro: 'Use accent/fill behind white text, as on filled buttons.',
    names: [
      'accent.default',
      'accent.hover',
      'accent.press',
      'accent.muted',
      'text.accent',
      'accent.fill',
      'accent.fill-hover',
    ],
  },
  {
    title: 'Status',
    intro: 'Five capability levels, positive to negative. The negative fills are for the Stop button.',
    names: [
      'status.positive',
      'status.good',
      'status.warning',
      'status.poor',
      'status.negative',
      'status.negative-fill',
      'status.negative-fill-hover',
      'text.positive',
      'text.good',
      'text.warning',
      'text.poor',
      'text.negative',
    ],
  },
  {
    title: 'Data series',
    intro: 'Chart colours: blue for download, violet for upload.',
    names: ['series.down', 'series.up'],
  },
  {
    title: 'Focus',
    intro: 'Keyboard focus ring, 1px with a 2px offset.',
    names: ['focus.ring'],
  },
  {
    title: 'Shadow colours',
    intro: 'The colours behind the shadow styles. Softer in Light mode.',
    names: ['shadow-color.panel-1', 'shadow-color.panel-2', 'shadow-color.raised', 'shadow-color.popover-1', 'shadow-color.popover-2'],
  },
]

const COLUMNS = [
  ['Token', 'minmax(180px, 2.5fr)'],
  ['Dark', 'minmax(170px, 1.45fr)'],
  ['Light', 'minmax(170px, 1.45fr)'],
  ['Code', 'minmax(180px, 1fr)'],
]

const hexText = ({ hex }) => hex.toUpperCase()

// The hex, with its alpha after a dot when it's see-through.
function ShadeValue({ shade }) {
  const alpha = shade.alpha ?? 1
  return alpha < 1 ? <Joined parts={[hexText(shade), `${Math.round(alpha * 100)}%`]} /> : hexText(shade)
}

// A colour in one theme, on that theme's surface. Text shows as text, on the
// surface it's read on (on-fill on accent/fill); everything else as a fill.
function ModeCell({ theme, path }) {
  const shade = shadeOf(theme, `{${path.join('.')}}`)
  const color = paletteColor(shade)
  const isText = path[0] === 'text'
  const surface = path[1] === 'on-fill' ? colorIn(theme, 'accent.fill') : colorIn(theme, 'bg.surface')
  return (
    <span className="mode">
      <span
        className="mode-frame"
        style={{ background: colorIn(theme, 'bg.surface'), borderColor: colorIn(theme, 'border.default') }}
      >
        {isText ? (
          <span className="mode-text" style={{ color, background: surface }}>
            Aa
          </span>
        ) : (
          <span className="mode-fill" style={{ background: color }} />
        )}
      </span>
      <span className="mode-value">
        <span>
          <ShadeValue shade={shade} />
        </span>
        <span className="mode-ref">→ {pointsAt(theme, path)}</span>
      </span>
    </span>
  )
}

// The shadow colours aren't CSS variables; they live inside the shadow tokens.
const codeFor = (path) =>
  path[0] === 'shadow-color'
    ? `in var(--shadow-${path[1].replace(/-\d$/, '')})`
    : `var(${cssName(path)})`

function ColourTable({ names }) {
  const tokens = flatten(colorDark)
  return (
    <Table columns={COLUMNS}>
      {names.map((name) => {
        const path = name.split('.')
        const token = tokens.find((candidate) => candidate.path.join('.') === name)
        return (
          <TableRow key={name}>
            <Name name={path.join('/')} description={token?.$description} />
            <ModeCell theme="dark" path={path} />
            <ModeCell theme="light" path={path} />
            <Code copy={codeFor(path).replace(/^in /, '')}>{codeFor(path)}</Code>
          </TableRow>
        )
      })}
    </Table>
  )
}

// A family's shades. White leads gray, as on the Figma page. A see-through
// shade sits on the backdrop of the theme that uses it: dark for Dark only,
// unless it's black, which only shows on white.
function Family({ name, shades }) {
  const hexes = new Set(shades.map(({ token }) => token.$value.hex))
  const sharedHex = hexes.size === 1 && shades.length > 1 ? [...hexes][0] : null
  return (
    <div className="family">
      <p className="family-name">
        {name}
        {sharedHex && <span className="family-hex">{sharedHex.toUpperCase()}</span>}
      </p>
      <div className="swatches">
        {shades.map(({ label, token }) => {
          const color = paletteColor(token.$value)
          const isAlpha = (token.$value.alpha ?? 1) < 1
          const isDarkOnly = isUsedIn('dark', token.path) && !isUsedIn('light', token.path)
          const isOnDark = isDarkOnly && token.$value.hex !== '#000000'
          const backdrop = isOnDark ? colorIn('dark', 'bg.base') : '#ffffff'
          return (
            <div key={label} className="swatch">
              <span
                className="swatch-color"
                style={{ background: isAlpha ? `linear-gradient(${color}, ${color}), ${backdrop}` : color }}
              />
              <span className="swatch-name">{label}</span>
              {!sharedHex && <span className="swatch-hex">{hexText(token.$value)}</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PaletteGrid() {
  const shades = flatten(palette)
  const families = Object.groupBy(
    shades.filter((token) => token.path[0] !== 'white'),
    (token) => token.path[0],
  )
  const white = shades.find((token) => token.path[0] === 'white')
  const entries = Object.entries(families).map(([name, tokens]) => {
    const labelled = tokens.map((token) => ({ label: token.path.slice(1).join('/'), token }))
    return [name, name === 'gray' ? [{ label: 'white', token: white }, ...labelled] : labelled]
  })
  const groups = [
    ['Solid', entries.filter(([name]) => !name.endsWith('-alpha'))],
    ['Translucent', entries.filter(([name]) => name.endsWith('-alpha'))],
  ]
  return groups.map(([title, groupEntries]) => (
    <div key={title} className="palette-group">
      <p className="table-label">{title}</p>
      {groupEntries.map(([name, familyShades]) => (
        <Family key={name} name={name} shades={familyShades} />
      ))}
    </div>
  ))
}

export const Colour = {
  render: () => (
    <Page title="Colour" intro="Palette shades, and the semantic tokens that point at them, in Dark and Light.">
      <Section title="Palette" intro="Every colour the tokens point at. Higher numbers are darker.">
        <PaletteGrid />
      </Section>
      {SECTIONS.map(({ title, intro, names }) => (
        <Section key={title} title={title} intro={intro}>
          <ColourTable names={names} />
        </Section>
      ))}
    </Page>
  ),
}
