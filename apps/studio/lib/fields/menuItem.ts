import {defineField} from 'sanity'
import {iconPickerField} from './iconPicker'

export const navMenuItemFields = [
  defineField({
    name: 'label',
    title: 'Label',
    type: 'string',
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: 'url',
    title: 'URL',
    type: 'string',
    validation: (rule) => rule.required(),
  }),
  iconPickerField({
    name: 'icon',
    title: 'Icon',
  }),
]

export const navMenuItemPreview = {
  select: {title: 'label', subtitle: 'url', icon: 'icon'},
  prepare({title, subtitle, icon}: {title?: string; subtitle?: string; icon?: string}) {
    return {
      title: title || 'Item',
      subtitle: [icon, subtitle].filter(Boolean).join(' · '),
    }
  },
}