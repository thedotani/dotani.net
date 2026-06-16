import {defineType, defineField} from 'sanity'
import {sectionCommonFields, buttonObject} from '../sectionFields'
import {CommentIcon} from '@sanity/icons'

export default defineType({
  name: 'testimonialsSection',
  title: 'Testimonials Section',
  type: 'object',
  icon: CommentIcon,
  fields: [
    ...sectionCommonFields,
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
    }),
    defineField({
      name: 'sectionTagline',
      title: 'Section Tagline',
      type: 'string',
    }),
    defineField({
      name: 'displayMode',
      title: 'Display Mode',
      type: 'string',
      options: {
        list: [
          {title: 'Manual Select', value: 'manual'},
          {title: 'Auto-fetch Testimonials', value: 'auto'},
        ],
        layout: 'radio',
      },
      initialValue: 'auto',
    }),
    defineField({
      name: 'cardStyle',
      title: 'Card Style',
      type: 'string',
      options: {
        list: [
          {title: 'Standard', value: 'standard'},
          {title: 'Minimal', value: 'minimal'},
          {title: 'Quote', value: 'quote'},
        ],
        layout: 'radio',
      },
      initialValue: 'standard',
    }),
    defineField({
      name: 'limit',
      title: 'Number of Testimonials',
      type: 'number',
      description: 'Max items to display (auto mode)',
      initialValue: 3,
    }),
  ],
  preview: {
    select: {
      title: 'sectionTitle',
    },
    prepare({title}) {
      return {
        title: title || 'Untitled Testimonials Section',
        subtitle: 'Testimonials Section',
        icon: CommentIcon,
      }
    },
  },
})