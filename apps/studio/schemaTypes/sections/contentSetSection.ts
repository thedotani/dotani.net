import {defineType, defineField} from 'sanity'
import {ThListIcon} from '@sanity/icons'
import {sectionPreview} from '../../lib/schemaHelpers'
import {blockStyleFields, glassStyleFields} from '../../lib/fields/blockStyleFields'

export default defineType({
  name: 'contentSetSection',
  title: 'Content Set',
  type: 'object',
  icon: ThListIcon,
  fieldsets: [
    {
      name: 'display',
      title: 'Display',
      options: {collapsible: true, collapsed: false, columns: 2},
    },
    {
      name: 'marqueeMotion',
      title: 'Marquee motion',
      options: {collapsible: true, collapsed: true, columns: 2},
    },
  ],
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
    }),
    defineField({
      name: 'visible',
      title: 'Visible',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'displayType',
      title: 'Display type',
      type: 'string',
      fieldset: 'display',
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
      name: 'statsSet',
      title: 'Stats set',
      type: 'reference',
      fieldset: 'display',
      to: [{type: 'contentSet'}],
      options: {
        filter: () => ({
          filter: 'setType == $setType',
          params: {setType: 'stats'},
        }),
      },
      hidden: ({parent}) => parent?.displayType !== 'stats',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {displayType?: string}
          if (parent?.displayType === 'stats' && !value) {
            return 'Select a stats set.'
          }
          return true
        }),
    }),
    defineField({
      name: 'marqueeSet',
      title: 'Marquee set',
      type: 'reference',
      fieldset: 'display',
      to: [{type: 'contentSet'}],
      options: {
        filter: () => ({
          filter: 'setType == $setType',
          params: {setType: 'marquee'},
        }),
      },
      hidden: ({parent}) => parent?.displayType !== 'marquee',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {displayType?: string}
          if (parent?.displayType === 'marquee' && !value) {
            return 'Select a marquee set.'
          }
          return true
        }),
    }),
    defineField({
      name: 'speed',
      title: 'Speed',
      type: 'number',
      fieldset: 'marqueeMotion',
      description: 'Marquee scroll speed. Higher values move faster.',
      validation: (rule) => rule.min(1).max(100),
      initialValue: 30,
      hidden: ({parent}) => parent?.displayType !== 'marquee',
    }),
    defineField({
      name: 'skewY',
      title: 'Skew Y (deg)',
      type: 'number',
      fieldset: 'marqueeMotion',
      description: 'Vertical skew angle in degrees.',
      initialValue: 0,
      hidden: ({parent}) => parent?.displayType !== 'marquee',
    }),
    defineField({
      name: 'skewX',
      title: 'Skew X (deg)',
      type: 'number',
      fieldset: 'marqueeMotion',
      description: 'Optional horizontal skew angle in degrees.',
      initialValue: 0,
      hidden: ({parent}) => parent?.displayType !== 'marquee',
    }),
    defineField({
      name: 'height',
      title: 'Height',
      type: 'object',
      fieldset: 'marqueeMotion',
      hidden: ({parent}) => parent?.displayType !== 'marquee',
      fields: [
        defineField({
          name: 'value',
          title: 'Value',
          type: 'number',
          validation: (rule) => rule.min(0),
          initialValue: 4,
        }),
        defineField({
          name: 'unit',
          title: 'Unit',
          type: 'string',
          initialValue: 'rem',
          options: {
            list: ['px', 'rem', 'em', 'vh'],
            layout: 'dropdown',
          },
        }),
      ],
    }),
    ...blockStyleFields,
    ...glassStyleFields,
  ],
  preview: {
    select: {
      displayType: 'displayType',
      statsTitle: 'statsSet->title',
      marqueeTitle: 'marqueeSet->title',
      visible: 'visible',
    },
    prepare({displayType, statsTitle, marqueeTitle, visible}) {
      const typeLabel = displayType === 'stats' ? 'Stats' : 'Marquee'
      const contentName =
        displayType === 'stats'
          ? (statsTitle || 'Stats (not set)')
          : (marqueeTitle || 'Marquee (not set)')
      return sectionPreview('Content Set', {
        title: contentName,
        subtitle: typeLabel,
        visible,
      })
    },
  },
})