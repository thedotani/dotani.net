export type DimensionUnit = 'px' | 'rem' | 'em' | '%' | 'vw'

export interface DimensionValue {
  value?: number
  unit?: DimensionUnit
}

export interface LayoutSettings {
  containerMaxWidth?: DimensionValue
  containerPaddingInline?: DimensionValue
}

const DEFAULT_MAX_WIDTH: DimensionValue = { value: 72, unit: 'rem' }

export function formatDimension(
  dimension?: DimensionValue,
  fallback: DimensionValue = DEFAULT_MAX_WIDTH,
): string {
  const value = dimension?.value ?? fallback.value
  const unit = dimension?.unit ?? fallback.unit ?? 'rem'
  if (value == null || Number.isNaN(value)) {
    return `${fallback.value}${fallback.unit}`
  }
  return `${value}${unit}`
}

export function layoutVars(
  layout?: LayoutSettings,
  _legacyContainerWidth?: string,
): Record<string, string> {
  const vars: Record<string, string> = {}

  const maxWidth = layout?.containerMaxWidth

  if (maxWidth) {
    vars['--container-max-width'] = formatDimension(maxWidth, DEFAULT_MAX_WIDTH)
  }

  if (layout?.containerPaddingInline) {
    vars['--container-padding-inline'] = formatDimension(
      layout.containerPaddingInline,
      { value: 1, unit: 'rem' },
    )
  }

  return vars
}

export function layoutStyle(
  layout?: LayoutSettings,
  legacyContainerWidth?: string,
): string | undefined {
  const vars = layoutVars(layout, legacyContainerWidth)
  const entries = Object.entries(vars)
  if (entries.length === 0) return undefined
  return entries.map(([name, value]) => `${name}: ${value}`).join('; ')
}