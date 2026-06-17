export interface SanityTheme {
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  darkModeDefault?: boolean
}

const darkTokens = {
  '--color-bg': '#0f172a',
  '--color-text': '#f1f5f9',
  '--color-heading': '#f8fafc',
  '--color-muted': '#94a3b8',
  '--color-border': '#334155',
  '--color-card': '#1e293b',
} as const

export function themeVars(theme?: SanityTheme): Record<string, string> {
  const vars: Record<string, string> = {}

  if (theme?.primaryColor) {
    vars['--color-primary'] = theme.primaryColor
  }
  if (theme?.secondaryColor) {
    vars['--color-secondary'] = theme.secondaryColor
  }
  if (theme?.accentColor) {
    vars['--color-accent'] = theme.accentColor
  }

  if (theme?.darkModeDefault) {
    Object.assign(vars, darkTokens)
  }

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