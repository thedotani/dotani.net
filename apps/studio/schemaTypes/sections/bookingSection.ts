import {defineType, defineField} from 'sanity'
import {sectionCommonFields} from '../sectionFields'
import {CalendarIcon} from '@sanity/icons'

export default defineType({
  name: 'bookingSection',
  title: 'Booking Section',
  type: 'object',
  icon: CalendarIcon,
  fields: [
    ...sectionCommonFields,
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
    }),
    defineField({
      name: 'supportingText',
      title: 'Supporting Text',
      type: 'string',
    }),
    defineField({
      name: 'calLink',
      title: 'Cal.com Link',
      type: 'url',
      description: 'Optional. Falls back to PUBLIC_CALCOM_USERNAME if empty.',
    }),
    defineField({
      name: 'buttonLabel',
      title: 'Button Label',
      type: 'string',
      initialValue: 'Book a Call',
    }),
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
  ],
  preview: {
    select: {
      title: 'headline',
    },
    prepare({title}) {
      return {
        title: title || 'Untitled Booking Section',
        subtitle: 'Booking Section',
        icon: CalendarIcon,
      }
    },
  },
})