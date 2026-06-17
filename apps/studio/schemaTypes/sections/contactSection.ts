import {defineType, defineField} from 'sanity'
import {sectionCommonFields} from '../sectionFields'
import {EnvelopeIcon} from '@sanity/icons'

export default defineType({
  name: 'contactSection',
  title: 'Contact Section',
  type: 'object',
  icon: EnvelopeIcon,
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
      name: 'submitButtonText',
      title: 'Submit Button Text',
      type: 'string',
      initialValue: 'Send Message',
    }),
    defineField({
      name: 'successMessage',
      title: 'Success Message',
      type: 'string',
      initialValue: 'Thank you! Your message has been sent.',
    }),
  ],
  preview: {
    select: {
      title: 'headline',
    },
    prepare({title}) {
      return {
        title: title || 'Untitled Contact Section',
        subtitle: 'Contact Section',
        icon: EnvelopeIcon,
      }
    },
  },
})