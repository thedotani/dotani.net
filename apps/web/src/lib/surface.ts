import { resolveColor } from './color'

type SanityColor = string | { hex?: string } | null | undefined

/** Relative luminance (0–1). Values below ~0.45 read as dark backgrounds. */
export function colorLuminance(color: string): number {
  const hex = color.replace('#', '')
  const normalized =
    hex.length === 3
      ? hex
          .split('')
          .map((c) => c + c)
          .join('')
      : hex

  if (normalized.length < 6) return 1

  const r = parseInt(normalized.slice(0, 2), 16) / 255
  const g = parseInt(normalized.slice(2, 4), 16) / 255
  const b = parseInt(normalized.slice(4, 6), 16) / 255

  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)

  const rl = toLinear(r)
  const gl = toLinear(g)
  const bl = toLinear(b)

  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl
}

export function isDarkBackground(color?: SanityColor): boolean {
  const hex = resolveColor(color)
  if (!hex) return false
  return colorLuminance(hex) < 0.45
}

export interface SectionSurfaceOptions {
  backgroundColor?: SanityColor
  /** Built-in dark section presets (booking, gradient CTA, etc.) */
  preset?: 'dark' | 'light' | 'auto'
}

/**
 * Returns a CSS class that scopes heading/body colors for dark-background sections.
 * Works in both light and dark site themes.
 */
export function sectionSurfaceClass({
  backgroundColor,
  preset = 'auto',
}: SectionSurfaceOptions = {}): string {
  if (preset === 'dark') return 'section-surface-dark'
  if (preset === 'light') return 'section-surface-light'
  if (isDarkBackground(backgroundColor)) return 'section-surface-dark'
  return ''
}