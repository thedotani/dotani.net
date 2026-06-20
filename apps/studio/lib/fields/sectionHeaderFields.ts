import {defineField} from 'sanity'
import {iconPickerField, NAV_ICON_OPTIONS} from './iconPicker'

export const sectionHeaderFieldset = {
  name: 'header',
  title: 'Section header',
  options: {collapsible: true, collapsed: false},
}

export const sectionHeaderFields = [
  iconPickerField({
    name: 'badge',
    title: 'Icon / badge',
    list: NAV_ICON_OPTIONS,
    fieldset: 'header',
  }),
  defineField({
    name: 'eyebrow',
    title: 'Eyebrow',
    type: 'string',
    fieldset: 'header',
  }),
  defineField({
    name: 'title',
    title: 'Title',
    type: 'string',
    fieldset: 'header',
  }),
  defineField({
    name: 'tagline',
    title: 'Tagline',
    type: 'string',
    fieldset: 'header',
  }),
  defineField({
    name: 'headerLink',
    title: 'Link',
    type: 'object',
    fieldset: 'header',
    options: {collapsible: false},
    fieldsets: [{name: 'headerLinkRow', title: ' ', options: {columns: 3}}],
    fields: [
      defineField({name: 'label', title: 'Label', type: 'string', fieldset: 'headerLinkRow'}),
      defineField({name: 'url', title: 'URL', type: 'string', fieldset: 'headerLinkRow'}),
      defineField({
        name: 'openInNewTab',
        title: 'New tab',
        type: 'boolean',
        fieldset: 'headerLinkRow',
        initialValue: false,
      }),
    ],
  }),
]