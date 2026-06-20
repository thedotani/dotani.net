import {defineField} from 'sanity'

export const SERVICE_ICON_OPTIONS = [
  {title: 'Social Media', value: 'social-media'},
  {title: 'Personal Brand', value: 'personal-brand'},
  {title: 'Content Strategy', value: 'content-strategy'},
  {title: 'Web Design', value: 'web-design'},
  {title: 'Campaign', value: 'campaign'},
  {title: 'Training', value: 'training'},
  {title: 'Strategy', value: 'strategy'},
  {title: 'Analytics', value: 'analytics'},
  {title: 'Consulting', value: 'consulting'},
]

export const NAV_ICON_OPTIONS = [
  {title: 'None', value: ''},
  {title: 'Home', value: 'home'},
  {title: 'Services', value: 'services'},
  {title: 'Portfolio', value: 'portfolio'},
  {title: 'About', value: 'about'},
  {title: 'Contact', value: 'contact'},
  {title: 'Blog', value: 'blog'},
  {title: 'Calendar', value: 'calendar'},
  {title: 'External', value: 'external'},
]

export const iconPickerField = (options: {
  name?: string
  title?: string
  list?: Array<{title: string; value: string}>
  group?: string
  fieldset?: string
}) =>
  defineField({
    name: options.name ?? 'icon',
    title: options.title ?? 'Icon',
    type: 'string',
    group: options.group,
    fieldset: options.fieldset,
    options: {
      list: options.list ?? NAV_ICON_OPTIONS,
      layout: 'dropdown',
    },
  })