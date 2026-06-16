import {defineType, defineField} from 'sanity'
import {sectionCommonFields, buttonObject} from '../sectionFields'
import {DocumentTextIcon} from '@sanity/icons'

export default defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    ...sectionCommonFields,
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow / Small Line',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Main Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline / Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}],
    }),
    buttonObject,
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Content Left / Image Right', value: 'contentLeft'},
          {title: 'Image Left / Content Right', value: 'imageLeft'},
          {title: 'Centered (No Image)', value: 'centered'},
        ],
        layout: 'radio',
      },
      initialValue: 'contentLeft',
    }),
    defineField({
      name: 'verticalAlignment',
      title: 'Vertical Alignment',
      type: 'string',
      options: {
        list: [
          {title: 'Top', value: 'items-start'},
          {title: 'Center', value: 'items-center'},
          {title: 'Bottom', value: 'items-end'},
        ],
        layout: 'radio',
      },
      initialValue: 'items-center',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'eyebrow',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Untitled Hero',
        subtitle: subtitle || 'Hero Section',
        icon: DocumentTextIcon,
      }
    },
  },
})