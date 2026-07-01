export function sectionPaddingClasses(
  _paddingTop?: string,
  _paddingBottom?: string,
): string {
  return 'section'
}

export function sectionWidthClass(sectionWidth?: string): string {
  if (!sectionWidth || sectionWidth === 'container') return ''
  if (sectionWidth === 'full' || sectionWidth === 'wfull') return 'wfull'
  if (sectionWidth === 'half') return 'whalf'
  if (/^w\d+$/.test(sectionWidth)) return sectionWidth
  return ''
}

export function sectionContainerClass(sectionWidth?: string): string {
  const key = sectionWidth || 'container'
  const map: Record<string, string> = {
    container: '',
    full: 'section-container--full',
    half: 'section-container--half',
    '': '',
  }
  const modifier = map[key]
  return modifier ? `section-container ${modifier}` : 'section-container'
}
