import type { BlockStyleSection } from './blockStyle'
import { resolveColor } from './color'
import { isDarkBackground } from './surface'

export function resolveSectionMeta(section: BlockStyleSection & { sectionId?: string }) {
  const sectionId = section.sectionId || ''
  const isHomeHero = sectionId === 'hero'
  const isIntroHero = sectionId.endsWith('-hero') && !isHomeHero
  const isCta = sectionId === 'cta' || sectionId.endsWith('-cta')
  const isPortfolio = sectionId === 'work' || sectionId === 'portfolio-grid'
  const isStats = sectionId === 'stats'
  const isTestimonials = sectionId === 'testimonials' || sectionId === 'work-testimonials'
  const isContact = sectionId === 'contact' || sectionId === 'contact-form'
  const isBooking = sectionId === 'booking' || sectionId === 'contact-booking'

  const useCtaGradient =
    isCta && section.customColors && section.backgroundType === 'gradient'

  const isCentered = isIntroHero || isCta
  const isCenteredHeader = isCentered || isTestimonials

  const bg = resolveColor(section.backgroundColor)
  const isDark =
    useCtaGradient ||
    isBooking ||
    isDarkBackground(bg) ||
    (isTestimonials && section.customColors)

  return {
    sectionId,
    isHomeHero,
    isIntroHero,
    isCta,
    isPortfolio,
    isStats,
    isTestimonials,
    isContact,
    isBooking,
    isCentered,
    isCenteredHeader,
    useCtaGradient,
    isDark,
  }
}

export function sectionShellClasses(
  section: BlockStyleSection & { sectionId?: string },
  surfaceClass: string,
) {
  const meta = resolveSectionMeta(section)

  return [
    'w-full',
    meta.isHomeHero ? 'hero-section' : 'block-section',
    meta.isStats && 'block-section--stats',
    meta.isPortfolio && 'portfolio-section-bg',
    meta.useCtaGradient && 'cta-gradient-bg',
    (meta.isBooking || (meta.isDark && meta.isBooking)) && 'booking-section-bg',
    meta.isDark && 'section-surface-dark',
    surfaceClass,
  ].filter(Boolean)
}

const PORTFOLIO_ACCENTS = [
  ['#e11d48', '#881337'],
  ['#7c3aed', '#4c1d95'],
  ['#db2777', '#831843'],
  ['#0891b2', '#164e63'],
  ['#ea580c', '#7c2d12'],
  ['#059669', '#064e3b'],
]

export function portfolioAccent(title = '', index = 0) {
  const code = title.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return PORTFOLIO_ACCENTS[(code + index) % PORTFOLIO_ACCENTS.length]
}