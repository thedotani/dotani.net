import {resolveColor} from './color'

export interface SanityTheme {
  primaryColor?: string | {hex?: string}
  secondaryColor?: string | {hex?: string}
  accentColor?: string | {hex?: string}
  darkModeDefault?: boolean | 'system' | 'light' | 'dark'
}

export type ColorScheme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'dotani-theme'

export const lightTokens = {
  '--color-bg': '#ffffff',
  '--color-text': '#1f2937',
  '--color-heading': '#111827',
  '--color-muted': '#6b7280',
  '--color-border': '#e5e7eb',
  '--color-card': '#ffffff',
  '--shadow-card': '0 1px 2px rgb(15 23 42 / 0.06)',
  '--shadow-card-hover': '0 12px 28px rgb(15 23 42 / 0.12)',
  '--shadow-overlay': '0 24px 48px rgb(15 23 42 / 0.12)',
} as const

export const darkTokens = {
  '--color-bg': '#0b1120',
  '--color-text': '#e2e8f0',
  '--color-heading': '#f8fafc',
  '--color-muted': '#94a3b8',
  '--color-border': '#1e293b',
  '--color-card': '#131c2e',
  '--shadow-card': '0 1px 2px rgb(0 0 0 / 0.35)',
  '--shadow-card-hover': '0 16px 32px rgb(0 0 0 / 0.45)',
  '--shadow-overlay': '0 24px 48px rgb(0 0 0 / 0.55)',
} as const

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