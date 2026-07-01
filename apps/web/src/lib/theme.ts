import {resolveColor} from './color'

export interface SanityTheme {
  primaryColor?: string | {hex?: string}
  secondaryColor?: string | {hex?: string}
  accentColor?: string | {hex?: string}
  darkModeDefault?: boolean | 'system' | 'light' | 'dark'
}

export type ColorScheme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'dotani-theme'

export function themeVars(theme?: SanityTheme): Record<string, string> {
  const vars: Record<string, string> = {}

  const primary = resolveColor(theme?.primaryColor)
  const secondary = resolveColor(theme?.secondaryColor)
  const accent = resolveColor(theme?.accentColor)

  if (primary) vars['--color-primary'] = primary
  if (secondary) vars['--color-secondary'] = secondary
  if (accent) vars['--color-accent'] = accent

  return vars
}

export function themeStyle(theme?: SanityTheme): string | undefined {
  const vars = themeVars(theme)
  const entries = Object.entries(vars)

  if (entries.length === 0) {
    return undefined
  }

  return entries.map(([name, value]) => `${name}: ${value}`).join('; ')
}

export function mergeInlineStyles(...styles: Array<string | undefined>): string | undefined {
  const merged = styles.filter(Boolean).join('; ')
  return merged || undefined
}

export function resolveInitialScheme(
  darkModeDefault?: boolean | 'system' | 'light' | 'dark',
): ColorScheme {
  if (darkModeDefault === true || darkModeDefault === 'dark') return 'dark'
  if (darkModeDefault === 'light') return 'light'
  return 'light'
}