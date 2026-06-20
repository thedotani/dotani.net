import {buildTheme} from '@sanity/ui/theme'
import {buildLegacyTheme, type StudioTheme} from 'sanity'

/**
 * Editorial 2026 palette — calm slate base, refined blue accent, soft contrast.
 * Studio-only; does not affect the public website.
 *
 * Uses buildLegacyTheme for color generation but omits __legacy so the
 * account menu keeps System / Dark / Light appearance options.
 */
const brandColors = {
  '--black': '#0b1120',
  '--white': '#f8fafc',
  '--gray': '#64748b',
  '--gray-base': '#64748b',
  '--component-bg': '#ffffff',
  '--component-text-color': '#0f172a',
  '--brand-primary': '#3b82f6',
  '--default-button-color': '#0f172a',
  '--default-button-primary-color': '#3b82f6',
  '--default-button-success-color': '#0d9488',
  '--default-button-warning-color': '#d97706',
  '--default-button-danger-color': '#dc2626',
  '--state-info-color': '#3b82f6',
  '--state-success-color': '#0d9488',
  '--state-warning-color': '#d97706',
  '--state-danger-color': '#dc2626',
  '--main-navigation-color': '#0b1120',
  '--focus-color': '#3b82f6',
} as const

const {color, fonts} = buildLegacyTheme(brandColors)

/** Sanity FormContainer uses theme.v2.container[1] (default 640px). */
const baseTheme = buildTheme({
  container: [320, 800, 960, 1280, 1600, 1920],
})

export const studioTheme: StudioTheme = {
  ...baseTheme,
  color,
  fonts,
}