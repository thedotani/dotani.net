import {defineType, defineField} from 'sanity'
import {sectionCommonFields, buttonObject} from '../sectionFields'
import {BellIcon} from '@sanity/icons'

export default defineType({
  name: 'finalCtaSection',
  title: 'Final CTA Section',
  type: 'object',
  icon: BellIcon,
  fields: [
    ...sectionCommonFields,
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'supportingText',
      title: 'Supporting Text',
      type: 'string',
    }),
    buttonObject,
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Centered', value: 'centered'},
          {title: 'Split', value: 'split'},
        ],
        layout: 'radio',
      },
      initialValue: 'centered',
    }),
    defineField({
      name: 'centeredBackground',
      title: 'Use Brand Background',
      type: 'boolean',
      description: 'Use primary color as background (centered layout)',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'headline',
    },
    prepare({title}) {
      return {
        title: title || 'Untitled CTA',
        subtitle: 'Final CTA Section',
        icon: BellIcon,
      }
    },
  },
})