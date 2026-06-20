import {defineField} from 'sanity'
import {arrayDialogOptions} from './arrayDialogOptions'

export const MENU_PLACEMENT_FIELDS = [
  defineField({name: 'header', title: 'Header', type: 'boolean', initialValue: false}),
  defineField({name: 'mobileMenu', title: 'Mobile', type: 'boolean', initialValue: false}),
  defineField({
    name: 'mobileMenuFooter',
    title: 'Mobile Footer',
    type: 'boolean',
    initialValue: false,
  }),
  defineField({name: 'footerCol2', title: 'Footer Col 2', type: 'boolean', initialValue: false}),
  defineField({name: 'footerCol3', title: 'Footer Col 3', type: 'boolean', initialValue: false}),
  defineField({name: 'footerCol4', title: 'Footer Col 4', type: 'boolean', initialValue: false}),
  defineField({
    name: 'footerCopyright',
    title: 'Copyright Menu',
    type: 'boolean',
    initialValue: false,
  }),
]

export const universalMenuItemFields = [
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
  defineField({
    name: 'showIn',
    title: 'Show In',
    type: 'object',
    options: {columns: 2},
    fields: MENU_PLACEMENT_FIELDS,
  }),
]

export const universalMenuPreview = {
  select: {
    title: 'label',
    subtitle: 'url',
    header: 'showIn.header',
    mobileMenu: 'showIn.mobileMenu',
    mobileMenuFooter: 'showIn.mobileMenuFooter',
    footerCol2: 'showIn.footerCol2',
    footerCol3: 'showIn.footerCol3',
    footerCol4: 'showIn.footerCol4',
    footerCopyright: 'showIn.footerCopyright',
  },
  prepare({
    title,
    subtitle,
    header,
    mobileMenu,
    mobileMenuFooter,
    footerCol2,
    footerCol3,
    footerCol4,
    footerCopyright,
  }: {
    title?: string
    subtitle?: string
    header?: boolean
    mobileMenu?: boolean
    mobileMenuFooter?: boolean
    footerCol2?: boolean
    footerCol3?: boolean
    footerCol4?: boolean
    footerCopyright?: boolean
  }) {
    const placements = [
      header ? 'Header' : null,
      mobileMenu ? 'Mobile' : null,
      mobileMenuFooter ? 'Mob Footer' : null,
      footerCol2 ? 'Col 2' : null,
      footerCol3 ? 'Col 3' : null,
      footerCol4 ? 'Col 4' : null,
      footerCopyright ? 'Copyright' : null,
    ].filter(Boolean)

    return {
      title: title || 'Menu Item',
      subtitle: [subtitle, placements.join(', ')].filter(Boolean).join(' · '),
    }
  },
}

export const universalMenuArrayField = defineField({
  name: 'items',
  title: 'Items',
  type: 'array',
  of: [
    {
      type: 'object',
      fields: universalMenuItemFields,
      preview: universalMenuPreview,
    },
  ],
  options: arrayDialogOptions,
})