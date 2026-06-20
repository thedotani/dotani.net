/** Maps Sanity section padding values to independent top/bottom Tailwind classes. */
const PADDING_MAP: Record<string, { pt: string; pb: string }> = {
  'section-pad': {
    pt: 'pt-14 sm:pt-16 md:pt-24',
    pb: 'pb-14 sm:pb-16 md:pb-24',
  },
  'section-pad-sm': {
    pt: 'pt-10 sm:pt-12 md:pt-16',
    pb: 'pb-10 sm:pb-12 md:pb-16',
  },
  'py-8': { pt: 'pt-8', pb: 'pb-8' },
  'py-12': { pt: 'pt-12', pb: 'pb-12' },
  'py-16': { pt: 'pt-16', pb: 'pb-16' },
  'py-24': { pt: 'pt-24', pb: 'pb-24' },
}

/** Section width options: full, half, or container (default) */
const SECTION_WIDTH_MAP: Record<string, string> = {
  container: '',
  full: 'section-container--full',
  half: 'section-container--half',
  '': '', // legacy default
}

const DEFAULT_PADDING = PADDING_MAP['section-pad']

export function sectionPaddingClasses(
  paddingTop = 'section-pad',
  paddingBottom = 'section-pad',
): string {
  const top = PADDING_MAP[paddingTop] ?? DEFAULT_PADDING
  const bottom = PADDING_MAP[paddingBottom] ?? DEFAULT_PADDING
  return `${top.pt} ${bottom.pb}`
}

export function sectionContainerClass(sectionWidth?: string): string {
  const key = sectionWidth || 'container'
  const modifier = SECTION_WIDTH_MAP[key]
  return modifier ? `section-container ${modifier}` : 'section-container'
}