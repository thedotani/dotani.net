import type {Rule} from 'sanity'

export const slugRule = (rule: Rule) => rule.required()

export function sectionPreview(
  sectionLabel: string,
  {
    title,
    subtitle,
    visible,
  }: {
    title?: string
    subtitle?: string
    visible?: boolean
  },
) {
  const status = visible === false ? 'Hidden on site' : sectionLabel
  return {
    title: title || `Untitled ${sectionLabel}`,
    subtitle: subtitle ? `${subtitle} · ${status}` : status,
  }
}

export function formatPreviewDate(value?: string) {
  if (!value) return 'Draft'
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}