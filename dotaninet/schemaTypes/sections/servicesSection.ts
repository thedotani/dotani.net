import {defineType, defineField} from 'sanity'
import {sectionCommonFields, buttonObject} from '../sectionFields'
import {TagIcon} from '@sanity/icons'

export default defineType({
  name: 'servicesSection',
  title: 'Services Section',
  type: 'object',
  icon: TagIcon,
  fields: [
    ...sectionCommonFields,
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
    }),
    defineField({
      name: 'sectionTagline',
      title: 'Section Tagline',
      type: 'string',
    }),
    defineField({
      name: 'headerButton',
      title: 'Header Button',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Label',
          type: 'string',
        }),
        defineField({
          name: 'url',
          title: 'URL',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'displayMode',
      title: 'Display Mode',
      type: 'string',
      options: {
        list: [
          {title: 'Manual Select', value: 'manual'},
          {title: 'Auto-fetch from Services', value: 'auto'},
        ],
        layout: 'radio',
      },
      initialValue: 'auto',
    }),
    defineField({
      name: 'manualServices',
      title: 'Manual Services',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
            }),
            defineField({
              name: 'oneLinePromise',
              title: 'One Line Promise',
              type: 'string',
            }),
            defineField({
              name: 'features',
              title: 'Features',
              type: 'array',
              of: [{type: 'string'}],
            }),
            defineField({
              name: 'bestFor',
              title: 'Best For',
              type: 'string',
            }),
            defineField({
              name: 'url',
              title: 'Link URL',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'cardLayout',
      title: 'Card Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Cards 3-up', value: 'cards-3'},
          {title: 'Cards 4-up', value: 'cards-4'},
          {title: 'List', value: 'list'},
        ],
        layout: 'radio',
      },
      initialValue: 'cards-3',
    }),
  ],
  preview: {
    select: {
      title: 'sectionTitle',
    },
    prepare({title}) {
      return {
        title: title || 'Untitled Services Section',
        subtitle: 'Services Section',
        icon: TagIcon,
      }
    },
  },
})