type SanityColor = string | {hex?: string} | null | undefined

export function resolveColor(value: SanityColor, fallback?: string): string | undefined {
  if (!value) return fallback
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value.hex) return value.hex
  return fallback
}