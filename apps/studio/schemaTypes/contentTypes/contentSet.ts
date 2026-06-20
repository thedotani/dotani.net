import {defineType, defineField, defineArrayMember} from 'sanity'
import {ThListIcon} from '@sanity/icons'
import {arrayDialogOptions} from '../../lib/fields/arrayDialogOptions'

export default defineType({
  name: 'contentSet',
  title: 'Content Set',
  type: 'document',
  icon: ThListIcon,
  description:
    'Reusable stats or marquee item sets. Internal content only — not indexed by search engines.',
  groups: [
    {name: 'overview', title: 'Overview', default: true},
    {name: 'items', title: 'Items'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Set name',
      type: 'string',
      group: 'overview',
      description: 'Stats set name or marquee set name.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'setType',
      title: 'Set type',
      type: 'string',
      group: 'overview',
      options: {
        list: [
          {title: 'Stats', value: 'stats'},
          {title: 'Marquee', value: 'marquee'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'metrics',
      title: 'Metrics',
      type: 'array',
      group: 'items',
      hidden: ({parent}) => parent?.setType !== 'stats',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'metric',
          fields: [
            defineField({
              name: 'name',
              title: 'Stat name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Number / value / count',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'One-line description',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'note',
              title: 'Small note',
              type: 'string',
            }),
          ],
          preview: {
            select: {title: 'name', subtitle: 'value', description: 'description'},
            prepare({title, subtitle, description}) {
              return {
                title: title || 'Untitled metric',
                subtitle: [subtitle, description].filter(Boolean).join(' · '),
              }
            },
          },
        }),
      ],
      options: arrayDialogOptions,
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {setType?: string}
          if (parent?.setType === 'stats' && (!value || value.length === 0)) {
            return 'Add at least one metric.'
          }
          return true
        }),
    }),
    defineField({
      name: 'marqueeItems',
      title: 'Marquee items',
      type: 'array',
      group: 'items',
      hidden: ({parent}) => parent?.setType !== 'marquee',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'marqueeItem',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'note',
              title: 'Small note',
              type: 'string',
            }),
          ],
          preview: {
            select: {title: 'name', subtitle: 'note'},
          },
        }),
      ],
      options: arrayDialogOptions,
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {setType?: string}
          if (parent?.setType === 'marquee' && (!value || value.length === 0)) {
            return 'Add at least one marquee item.'
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      setType: 'setType',
      metricCount: 'metrics.length',
      itemCount: 'marqueeItems.length',
    },
    prepare({title, setType, metricCount, itemCount}) {
      const count = setType === 'stats' ? metricCount : itemCount
      const label = setType === 'stats' ? 'Stats' : setType === 'marquee' ? 'Marquee' : 'Set'
      return {
        title: title || 'Untitled set',
        subtitle: `${label} · ${count || 0} items`,
      }
    },
  },
})