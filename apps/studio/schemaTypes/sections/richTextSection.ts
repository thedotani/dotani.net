import {defineType, defineField, defineArrayMember} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'
import {sectionPreview} from '../../lib/schemaHelpers'
import {blockStyleFields} from '../../lib/fields/blockStyleFields'

export default defineType({
  name: 'richTextSection',
  title: 'Rich Text',
  type: 'object',
  icon: DocumentTextIcon,
  fieldsets: [
    {
      name: 'body',
      title: 'Body',
      options: {collapsible: true, collapsed: false},
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
      name: 'body',
      title: 'Rich text',
      type: 'array',
      fieldset: 'body',
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
              {title: 'Code', value: 'code'},
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
      validation: (rule) => rule.required(),
    }),
    ...blockStyleFields,
  ],
  preview: {
    select: {
      body: 'body',
      visible: 'visible',
    },
    prepare({body, visible}) {
      const firstBlock = Array.isArray(body)
        ? body.find((block) => block._type === 'block' && block.children?.length)
        : undefined
      const title =
        firstBlock?.children
          ?.map((child: {text?: string}) => child.text)
          .join('')
          .slice(0, 60) || 'Rich text section'
      return sectionPreview('Rich Text', {title, visible})
    },
  },
})