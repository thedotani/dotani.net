import {defineField, defineType} from 'sanity'
import {ShareIcon} from '@sanity/icons'
import {arrayDialogOptions} from './arrayDialogOptions'

export const socialPlatformOptions = [
  {title: 'LinkedIn', value: 'linkedin'},
  {title: 'Facebook', value: 'facebook'},
  {title: 'Instagram', value: 'instagram'},
  {title: 'YouTube', value: 'youtube'},
  {title: 'WhatsApp', value: 'whatsapp'},
  {title: 'Twitter / X', value: 'twitter'},
  {title: 'GitHub', value: 'github'},
  {title: 'TikTok', value: 'tiktok'},
  {title: 'Email', value: 'email'},
  {title: 'Website', value: 'website'},
]

export const socialLinkEntry = defineType({
  name: 'socialLinkEntry',
  title: 'Link',
  type: 'object',
  icon: ShareIcon,
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {list: socialPlatformOptions, layout: 'dropdown'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
    }),
    defineField({
      name: 'hideOn',
      title: 'Hide On',
      type: 'object',
      options: {columns: 3},
      fields: [
        defineField({
          name: 'header',
          title: 'Header',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'footer',
          title: 'Footer',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'mobileMenu',
          title: 'Mobile',
          type: 'boolean',
          initialValue: false,
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'platform', subtitle: 'url'},
  },
})

export const socialLinksArrayField = defineField({
  name: 'links',
  title: 'Links',
  type: 'array',
  of: [{type: 'socialLinkEntry'}],
  options: arrayDialogOptions,
})