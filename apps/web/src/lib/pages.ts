export function pageIncludesContactSection(page: { sections?: any[] } | null | undefined) {
  return (
    page?.sections?.some((section) => {
      if (section?.visible === false) return false
      if (section?._type === 'contentBoxSection') {
        return section.sectionId === 'contact' || section.sectionId === 'contact-form'
      }
      return false
    }) ?? false
  )
}

export const CMS_PAGE_SLUGS = ['profile', 'contact', 'booking'] as const

export const SLUG_REDIRECTS: Record<string, string> = {
  home: '/',
  about: '/profile',
  work: '/portfolio',
}