export type SocialLink = {
  platform: string
  url: string
  label?: string
  hideOn?: {
    header?: boolean
    footer?: boolean
    mobileMenu?: boolean
  }
}

export type SocialArea = 'header' | 'footer' | 'mobileMenu'

export function filterSocialLinks(links: SocialLink[] = [], area: SocialArea): SocialLink[] {
  return links.filter((link) => !link.hideOn?.[area])
}

export function resolveSocialLinks(
  links: SocialLink[] = [],
  area: SocialArea,
  areaEnabled = true,
): SocialLink[] {
  if (!areaEnabled || links.length === 0) return []
  return filterSocialLinks(links, area)
}