import {defineType, defineField} from 'sanity'
import {sectionCommonFields, buttonObject} from '../sectionFields'
import {ImagesIcon} from '@sanity/icons'

export default defineType({
  name: 'portfolioSection',
  title: 'Portfolio / Featured Work Section',
  type: 'object',
  icon: ImagesIcon,
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
      name: 'ctaButton',
      title: 'CTA Button',
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
          {title: 'Auto-fetch from Portfolio', value: 'auto'},
        ],
        layout: 'radio',
      },
      initialValue: 'auto',
    }),
    defineField({
      name: 'cardLayout',
      title: 'Card Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Cards 3-up', value: 'cards-3'},
          {title: 'Cards 4-up', value: 'cards-4'},
          {title: 'Featured Large', value: 'featured'},
        ],
        layout: 'radio',
      },
      initialValue: 'cards-3',
    }),
    defineField({
      name: 'limit',
      title: 'Number of Items',
      type: 'number',
      description: 'Max items to display (auto mode)',
      initialValue: 6,
    }),
  ],
  preview: {
    select: {
      title: 'sectionTitle',
    },
    prepare({title}) {
      return {
        title: title || 'Untitled Portfolio Section',
        subtitle: 'Portfolio Section',
        icon: ImagesIcon,
      }
    },
  },
})