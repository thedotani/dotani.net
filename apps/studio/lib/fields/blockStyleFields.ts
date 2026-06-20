import {defineField} from 'sanity'
import {colorField} from './colorField'

export const blockStyleFields = [
  defineField({
    name: 'spacingMode',
    title: 'Spacing',
    type: 'string',
    options: {
      list: [
        {title: 'Global gap (default)', value: 'global'},
        {title: 'Custom', value: 'custom'},
      ],
      layout: 'radio',
      direction: 'horizontal',
    },
    initialValue: 'global',
  }),
  defineField({
    name: 'blockGap',
    title: 'Block gap',
    type: 'object',
    hidden: ({parent}) => parent?.spacingMode !== 'custom',
    fields: [
      defineField({
        name: 'value',
        title: 'Value',
        type: 'number',
        validation: (rule) => rule.min(0),
      }),
      defineField({
        name: 'unit',
        title: 'Unit',
        type: 'string',
        initialValue: 'rem',
        options: {
          list: ['px', 'rem', 'em'],
          layout: 'dropdown',
        },
      }),
    ],
  }),
  defineField({
    name: 'inlineGap',
    title: 'Inline gap',
    type: 'object',
    hidden: ({parent}) => parent?.spacingMode !== 'custom',
    fields: [
      defineField({
        name: 'value',
        title: 'Value',
        type: 'number',
        validation: (rule) => rule.min(0),
      }),
      defineField({
        name: 'unit',
        title: 'Unit',
        type: 'string',
        initialValue: 'rem',
        options: {
          list: ['px', 'rem', 'em'],
          layout: 'dropdown',
        },
      }),
    ],
  }),
  defineField({
    name: 'sectionWidth',
    title: 'Section width',
    type: 'string',
    options: {
      list: [
        {title: 'Container (default)', value: 'container'},
        {title: 'Full (100vw)', value: 'full'},
        {title: 'Half (50%)', value: 'half'},
      ],
      layout: 'radio',
      direction: 'horizontal',
    },
    initialValue: 'container',
  }),
  defineField({
    name: 'customColors',
    title: 'Colours',
    type: 'boolean',
    initialValue: false,
  }),
  defineField({
    name: 'backgroundType',
    title: 'Background',
    type: 'string',
    options: {
      list: [
        {title: 'Solid colour', value: 'solid'},
        {title: 'Gradient', value: 'gradient'},
        {title: 'Image', value: 'image'},
      ],
      layout: 'radio',
      direction: 'horizontal',
    },
    initialValue: 'solid',
    hidden: ({parent}) => !parent?.customColors,
  }),
  colorField({
    name: 'backgroundColor',
    title: 'Background colour',
    hidden: ({parent}) => !parent?.customColors || parent?.backgroundType !== 'solid',
  }),
  defineField({
    name: 'backgroundGradient',
    title: 'Gradient',
    type: 'object',
    hidden: ({parent}) => !parent?.customColors || parent?.backgroundType !== 'gradient',
    options: {columns: 2},
    fields: [
      colorField({name: 'from', title: 'From'}),
      colorField({name: 'to', title: 'To'}),
      defineField({
        name: 'direction',
        title: 'Direction',
        type: 'string',
        options: {
          list: [
            {title: '↓', value: 'bg-gradient-to-b'},
            {title: '↑', value: 'bg-gradient-to-t'},
            {title: '→', value: 'bg-gradient-to-r'},
            {title: '←', value: 'bg-gradient-to-l'},
            {title: '↘', value: 'bg-gradient-to-br'},
          ],
          layout: 'dropdown',
        },
        initialValue: 'bg-gradient-to-b',
      }),
    ],
  }),
  defineField({
    name: 'backgroundImage',
    title: 'Background image',
    type: 'image',
    options: {hotspot: true},
    hidden: ({parent}) => !parent?.customColors || parent?.backgroundType !== 'image',
  }),
  colorField({
    name: 'textColor',
    title: 'Text colour',
    hidden: ({parent}) => !parent?.customColors,
  }),
]

export const glassStyleFields = [
  defineField({
    name: 'glass',
    title: 'Glass effect',
    type: 'boolean',
    initialValue: false,
  }),
  defineField({
    name: 'glassBlur',
    title: 'Glass blur',
    type: 'number',
    description: 'Blur intensity for the glass effect (px).',
    validation: (rule) => rule.min(0).max(100),
    initialValue: 12,
    hidden: ({parent}) => !parent?.glass,
  }),
]