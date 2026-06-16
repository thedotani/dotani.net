import {defineType, defineField} from 'sanity'
import {UserIcon} from '@sanity/icons'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'authorRole',
      title: 'Author Role / Company',
      type: 'string',
    }),
    defineField({
      name: 'authorAvatar',
      title: 'Author Avatar',
      type: 'image',
    }),
    defineField({
      name: 'relatedService',
      title: 'Related Service',
      type: 'reference',
      to: [{type: 'service'}],
    }),
    defineField({
      name: 'relatedPortfolio',
      title: 'Related Portfolio Item',
      type: 'reference',
      to: [{type: 'portfolio'}],
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description: '1-5 stars',
      validation: (rule) => rule.min(1).max(5),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'authorName',
      subtitle: 'authorRole',
      media: 'authorAvatar',
    },
  },
})