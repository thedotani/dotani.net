import {defineType, defineField} from 'sanity'
import {sectionCommonFields, buttonObject} from '../sectionFields'
import {UserIcon} from '@sanity/icons'

export default defineType({
  name: 'whyMeSection',
  title: 'Why Me Section',
  type: 'object',
  icon: UserIcon,
  fields: [
    ...sectionCommonFields,
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'features',
      title: 'Feature Points',
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
              name: 'description',
              title: 'Description',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'image',
      title: 'Optional Image',
      type: 'image',
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Left Content / Right Image', value: 'contentLeft'},
          {title: 'Right Content / Left Image', value: 'imageLeft'},
        ],
        layout: 'radio',
      },
      initialValue: 'contentLeft',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
    },
    prepare({title}) {
      return {
        title: title || 'Untitled Why Me Section',
        subtitle: 'Why Me Section',
        icon: UserIcon,
      }
    },
  },
})