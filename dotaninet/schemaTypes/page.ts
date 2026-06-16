import {defineType, defineField} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Page Excerpt',
      type: 'text',
      rows: 3,
      description: '2-3 lines summary for meta',
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      of: [
        {type: 'heroSection'},
        {type: 'statsSection'},
        {type: 'servicesSection'},
        {type: 'portfolioSection'},
        {type: 'whyMeSection'},
        {type: 'testimonialsSection'},
        {type: 'finalCtaSection'},
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'SEO Title',
          type: 'string',
        }),
        defineField({
          name: 'description',
          title: 'Meta Description',
          type: 'text',
        }),
      ],
    }),
    defineField({
      name: 'customColors',
      title: 'Use Custom Colors',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'customColorScheme',
      title: 'Custom Color Scheme',
      type: 'object',
      fields: [
        defineField({
          name: 'bodyText',
          title: 'Body Text',
          type: 'string',
        }),
        defineField({
          name: 'headings',
          title: 'Headings',
          type: 'string',
        }),
        defineField({
          name: 'buttons',
          title: 'Buttons',
          type: 'string',
        }),
        defineField({
          name: 'accent',
          title: 'Accent',
          type: 'string',
        }),
        defineField({
          name: 'background',
          title: 'Background',
          type: 'string',
        }),
      ],
      hidden: ({parent}) => !parent?.customColors,
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})