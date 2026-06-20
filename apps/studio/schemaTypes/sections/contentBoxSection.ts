import {defineType, defineField, defineArrayMember} from 'sanity'
import {BlockContentIcon} from '@sanity/icons'
import {sectionPreview} from '../../lib/schemaHelpers'
import {arrayDialogOptions} from '../../lib/fields/arrayDialogOptions'
import {blockStyleFields} from '../../lib/fields/blockStyleFields'
import {sectionHeaderFields, sectionHeaderFieldset} from '../../lib/fields/sectionHeaderFields'

const DYNAMIC_CONTENT_TYPES = [
  {title: 'Services', value: 'service'},
  {title: 'Portfolio items', value: 'portfolio'},
  {title: 'Case studies', value: 'caseStudy'},
  {title: 'Testimonials', value: 'testimonial'},
  {title: 'Blog posts', value: 'blogPost'},
]

export default defineType({
  name: 'contentBoxSection',
  title: 'Content Box',
  type: 'object',
  icon: BlockContentIcon,
  fieldsets: [
    sectionHeaderFieldset,
    {
      name: 'content',
      title: 'Content',
      options: {collapsible: true, collapsed: false},
    },
  ],
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description: 'Optional anchor ID for in-page links.',
    }),
    defineField({
      name: 'visible',
      title: 'Visible',
      type: 'boolean',
      initialValue: true,
    }),
    ...sectionHeaderFields,
    defineField({
      name: 'contentMode',
      title: 'Content mode',
      type: 'string',
      fieldset: 'content',
      options: {
        list: [
          {title: 'Dynamic', value: 'dynamic'},
          {title: 'Custom', value: 'custom'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'dynamic',
    }),
    defineField({
      name: 'dynamicContentType',
      title: 'Content source',
      type: 'string',
      fieldset: 'content',
      options: {
        list: DYNAMIC_CONTENT_TYPES,
        layout: 'dropdown',
      },
      hidden: ({parent}) => parent?.contentMode !== 'dynamic',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {contentMode?: string}
          if (parent?.contentMode === 'dynamic' && !value) {
            return 'Select a content source.'
          }
          return true
        }),
    }),
    defineField({
      name: 'customContent',
      title: 'Custom content',
      type: 'array',
      fieldset: 'content',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Underline', value: 'underline'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({name: 'href', type: 'url', title: 'URL'}),
                  defineField({
                    name: 'openInNewTab',
                    type: 'boolean',
                    title: 'Open in new tab',
                    initialValue: false,
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({type: 'image', options: {hotspot: true}}),
      ],
      hidden: ({parent}) => parent?.contentMode !== 'custom',
    }),
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      fieldset: 'content',
      options: arrayDialogOptions,
      hidden: ({parent}) => parent?.contentMode !== 'custom',
      of: [
        {
          type: 'object',
          options: {columns: 2},
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
                direction: 'horizontal',
              },
              initialValue: 'primary',
            }),
            defineField({
              name: 'openInNewTab',
              title: 'New tab',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'url', style: 'style'},
            prepare({title, subtitle, style}) {
              return {
                title: title || 'Button',
                subtitle: [style, subtitle].filter(Boolean).join(' · '),
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'image',
      title: 'Section image',
      type: 'image',
      options: {hotspot: true},
      hidden: ({parent}) => parent?.contentMode !== 'custom',
    }),
    ...blockStyleFields,
  ],
  preview: {
    select: {
      title: 'title',
      mode: 'contentMode',
      source: 'dynamicContentType',
      visible: 'visible',
    },
    prepare({title, mode, source, visible}) {
      const contentName =
        mode === 'dynamic'
          ? (DYNAMIC_CONTENT_TYPES.find((item) => item.value === source)?.title ??
            'Dynamic (not set)')
          : 'Custom content'
      return sectionPreview('Content Box', {
        title: title || contentName,
        subtitle: contentName,
        visible,
      })
    },
  },
})