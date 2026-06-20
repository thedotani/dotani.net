const QUICK_LINKS: Record<string, string> = {
  Home: '/',
  Services: '/services',
  Portfolio: '/portfolio',
}

export function slugifyLabel(label: string): string {
  return label
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function resolveFooterHref(label: string): string | null {
  const trimmed = label.trim()
  if (!trimmed) return null
  if (/^(\/|https?:\/\/|#|mailto:)/.test(trimmed)) return trimmed
  if (trimmed.length > 72 || trimmed.includes('@')) return null
  if (QUICK_LINKS[trimmed]) return QUICK_LINKS[trimmed]
  if (trimmed.includes('/') && !trimmed.startsWith('/')) return null

  return `/services/${slugifyLabel(trimmed)}`
}

export function isNavActive(pathname: string, href: string): boolean {
  if (!href || href.startsWith('#') || href.startsWith('http')) return false
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}