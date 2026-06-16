import {defineField} from 'sanity'

// Shared fields for all section types
export const sectionCommonFields = [
  defineField({
    name: 'sectionId',
    title: 'Section ID',
    type: 'string',
    description: 'For anchor links (e.g., "services", "portfolio")',
  }),
  defineField({
    name: 'visible',
    title: 'Visible',
    type: 'boolean',
    initialValue: true,
  }),
  defineField({
    name: 'paddingTop',
    title: 'Padding Top',
    type: 'string',
    options: {
      list: [
        {title: 'Small', value: 'py-8'},
        {title: 'Medium', value: 'py-12'},
        {title: 'Large', value: 'py-16'},
        {title: 'Extra Large', value: 'py-24'},
      ],
      layout: 'radio',
    },
    initialValue: 'py-16',
  }),
  defineField({
    name: 'paddingBottom',
    title: 'Padding Bottom',
    type: 'string',
    options: {
      list: [
        {title: 'Small', value: 'py-8'},
        {title: 'Medium', value: 'py-12'},
        {title: 'Large', value: 'py-16'},
        {title: 'Extra Large', value: 'py-24'},
      ],
      layout: 'radio',
    },
    initialValue: 'py-16',
  }),
  defineField({
    name: 'backgroundType',
    title: 'Background Type',
    type: 'string',
    options: {
      list: [
        {title: 'Solid', value: 'solid'},
        {title: 'Gradient', value: 'gradient'},
        {title: 'Image', value: 'image'},
      ],
      layout: 'radio',
    },
    initialValue: 'solid',
  }),
  defineField({
    name: 'backgroundColor',
    title: 'Background Color',
    type: 'string',
  }),
  defineField({
    name: 'backgroundGradient',
    title: 'Background Gradient',
    type: 'object',
    fields: [
      defineField({
        name: 'from',
        title: 'From',
        type: 'string',
      }),
      defineField({
        name: 'to',
        title: 'To',
        type: 'string',
      }),
      defineField({
        name: 'direction',
        title: 'Direction',
        type: 'string',
        options: {
          list: [
            {title: 'Top to Bottom', value: 'bg-gradient-to-b'},
            {title: 'Bottom to Top', value: 'bg-gradient-to-t'},
            {title: 'Left to Right', value: 'bg-gradient-to-r'},
            {title: 'Right to Left', value: 'bg-gradient-to-l'},
          ],
          layout: 'dropdown',
        },
        initialValue: 'bg-gradient-to-b',
      }),
    ],
  }),
  defineField({
    name: 'backgroundImage',
    title: 'Background Image',
    type: 'image',
  }),
  defineField({
    name: 'backgroundImageOpacity',
    title: 'Background Image Opacity',
    type: 'number',
    description: '0-100%',
    initialValue: 100,
  }),
  defineField({
    name: 'alignment',
    title: 'Content Alignment',
    type: 'string',
    options: {
      list: [
        {title: 'Left', value: 'text-left items-start'},
        {title: 'Center', value: 'text-center items-center'},
        {title: 'Right', value: 'text-right items-end'},
      ],
      layout: 'radio',
    },
    initialValue: 'text-left items-start',
  }),
  defineField({
    name: 'containerWidthOverride',
    title: 'Container Width Override',
    type: 'string',
    options: {
      list: [
        {title: 'Inherit', value: ''},
        {title: 'Small', value: 'max-w-4xl'},
        {title: 'Medium', value: 'max-w-6xl'},
        {title: 'Large', value: 'max-w-7xl'},
        {title: 'Full', value: 'max-w-full'},
      ],
      layout: 'radio',
    },
    initialValue: '',
  }),
]

// Shared button object
export const buttonObject = defineField({
  name: 'buttons',
  title: 'Buttons',
  type: 'array',
  of: [
    {
      type: 'object',
      fields: [
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
          name: 'style',
          title: 'Style',
          type: 'string',
          options: {
            list: [
              {title: 'Primary', value: 'primary'},
              {title: 'Secondary', value: 'secondary'},
              {title: 'Ghost', value: 'ghost'},
              {title: 'Outline', value: 'outline'},
            ],
            layout: 'radio',
          },
          initialValue: 'primary',
        }),
        defineField({
          name: 'openInNewTab',
          title: 'Open in New Tab',
          type: 'boolean',
          initialValue: false,
        }),
      ],
      preview: {
        select: {title: 'label', subtitle: 'url'},
      },
    },
  ],
})