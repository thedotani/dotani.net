import {defineType, defineField} from 'sanity'
import {sectionCommonFields} from '../sectionFields'
import {InfoOutlineIcon} from '@sanity/icons'

export default defineType({
  name: 'statsSection',
  title: 'Stats / Trust Strip',
  type: 'object',
  icon: InfoOutlineIcon,
  fields: [
    ...sectionCommonFields,
    defineField({
      name: 'items',
      title: 'Stat Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'number',
              title: 'Number',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'note',
              title: 'Optional Note',
              type: 'string',
            }),
          ],
          preview: {
            select: {title: 'number', subtitle: 'label'},
          },
        },
      ],
      validation: (rule) => rule.min(1).required(),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Inline (horizontal)', value: 'inline'},
          {title: 'Grid', value: 'grid'},
        ],
        layout: 'radio',
      },
      initialValue: 'inline',
    }),
    defineField({
      name: 'divider',
      title: 'Show Divider',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'items.0.label',
      count: 'items.length',
    },
    prepare({title, count}) {
      return {
        title: `${count || 0} Stats`,
        subtitle: title || 'Stats Section',
        icon: InfoOutlineIcon,
      }
    },
  },
})