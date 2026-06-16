import {defineType, defineField} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

export default defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title',
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
      name: 'client',
      title: 'Client',
      type: 'string',
    }),
    defineField({
      name: 'industry',
      title: 'Industry',
      type: 'string',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
    }),
    defineField({
      name: 'scope',
      title: 'Scope',
      type: 'string',
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
    }),
    defineField({
      name: 'tools',
      title: 'Tools Used',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
    }),
    defineField({
      name: 'summary',
      title: 'Project Summary',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Short paragraph explaining what the project was',
    }),
    defineField({
      name: 'challenge',
      title: 'The Challenge',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'approach',
      title: 'Strategic Approach',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'process',
      title: 'Execution Process',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'number',
              title: 'Step Number',
              type: 'number',
            }),
            defineField({
              name: 'title',
              title: 'Step Title',
              type: 'string',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'outputs',
      title: 'Key Outputs',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'visuals',
      title: 'Visual Showcase',
      type: 'array',
      of: [{type: 'image'}],
    }),
    defineField({
      name: 'results',
      title: 'Results',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'impact',
      title: 'Impact',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'lessons',
      title: 'Lessons / Insights',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'relatedPortfolio',
      title: 'Related Portfolio Items',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'portfolio'}]}],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'client',
    },
  },
})