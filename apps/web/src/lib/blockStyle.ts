import { resolveColor } from './color'
import { sectionSurfaceClass } from './surface'
import { resolveSectionMeta } from './sectionStyle'

type Dimension = { value?: number; unit?: string } | null | undefined

export interface BlockStyleSection {
  sectionId?: string
  spacingMode?: 'global' | 'custom'
  blockGap?: Dimension
  inlineGap?: Dimension
  sectionWidth?: string
  customColors?: boolean
  backgroundType?: 'solid' | 'gradient' | 'image'
  backgroundColor?: string | { hex?: string }
  backgroundGradient?: {
    from?: string | { hex?: string }
    to?: string | { hex?: string }
    direction?: string
  }
  backgroundImage?: { asset?: { url?: string } }
  textColor?: string | { hex?: string }
  glass?: boolean
  glassBlur?: number
}

export function resolveBlockGap(section: BlockStyleSection): string | undefined {
  if (section.spacingMode !== 'custom' || section.blockGap?.value == null) return undefined
  return `${section.blockGap.value}${section.blockGap.unit || 'rem'}`
}

export function resolveInlineGap(section: BlockStyleSection): string | undefined {
  if (section.spacingMode !== 'custom' || section.inlineGap?.value == null) return undefined
  return `${section.inlineGap.value}${section.inlineGap.unit || 'rem'}`
}

export function blockSurfaceClass(section: BlockStyleSection): string {
  const bg = resolveColor(section.backgroundColor)
  return sectionSurfaceClass({ backgroundColor: bg })
}

export function blockInlineStyle(section: BlockStyleSection): Record<string, string> | undefined {
  const meta = resolveSectionMeta(section)
  const style: Record<string, string> = {}

  const blockGap = resolveBlockGap(section)
  const inlineGap = resolveInlineGap(section)
  if (blockGap) style['--block-gap'] = blockGap
  if (inlineGap) style['--inline-gap'] = inlineGap

  if (!section.customColors) {
    if (meta.isStats) {
      style.backgroundColor =
        'color-mix(in srgb, var(--color-bg) 92%, var(--color-primary) 8%)'
    }
    return Object.keys(style).length ? style : undefined
  }

  const bg = resolveColor(section.backgroundColor)
  const text = resolveColor(section.textColor)

  if (meta.useCtaGradient) {
    if (text) {
      style.color = text
      style['--block-text-color'] = text
    }
    return Object.keys(style).length ? style : undefined
  }

  if (section.backgroundType === 'solid' && bg) {
    style.backgroundColor = bg
  }

  if (section.backgroundType === 'gradient' && section.backgroundGradient) {
    const from = resolveColor(section.backgroundGradient.from)
    const to = resolveColor(section.backgroundGradient.to)
    if (from && to) {
      const direction = gradientDirection(section.backgroundGradient.direction)
      style.backgroundImage = `linear-gradient(${direction}, ${from}, ${to})`
    }
  }

  if (section.backgroundType === 'image' && section.backgroundImage?.asset?.url) {
    style.backgroundImage = `url(${section.backgroundImage.asset.url})`
    style.backgroundSize = 'cover'
    style.backgroundPosition = 'center'
  }

  if (text) {
    style.color = text
    style['--block-text-color'] = text
  }

  if (section.glass && section.glassBlur != null) {
    style['--glass-blur'] = `${section.glassBlur}px`
  }

  return Object.keys(style).length ? style : undefined
}

function gradientDirection(direction?: string): string {
  if (direction === 'to right' || direction === 'to left') return direction
  return 'to bottom'
}