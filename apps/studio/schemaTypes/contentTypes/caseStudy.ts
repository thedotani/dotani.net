import {defineType, defineField} from 'sanity'
import {DocumentIcon} from '@sanity/icons'
import {seoAeoField} from '../../lib/fields/seoAeo'
import {arrayDialogOptions} from '../../lib/fields/arrayDialogOptions'

export default defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'overview', title: 'Overview', default: true},
    {name: 'story', title: 'Story'},
    {name: 'media', title: 'Media'},
    {name: 'results', title: 'Results'},
    {
      name: 'relations',
      title: 'Relations',
      description:
        'Link this case study to portfolio item(s). Default: one portfolio item per case study. Use multiple links only when several grid cards are entry points to the same client story.',
    },
    {name: 'seo', title: 'SEO'},
  ],
  fieldsets: [{name: 'overviewMeta', title: 'Meta', options: {columns: 2}}],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'overview',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'overview',
      fieldset: 'overviewMeta',
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
      group: 'overview',
      fieldset: 'overviewMeta',
    }),
    defineField({
      name: 'industry',
      title: 'Industry',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      group: 'overview',
      fieldset: 'overviewMeta',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      group: 'overview',
      fieldset: 'overviewMeta',
      initialValue: 0,
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'scope',
      title: 'Scope',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'tools',
      title: 'Tools Used',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'heroImage',
      title: 'Featured Image',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
    }),
    defineField({
      name: 'summary',
      title: 'Project Summary',
      type: 'array',
      group: 'story',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'challenge',
      title: 'The Challenge',
      type: 'array',
      group: 'story',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'approach',
      title: 'Strategic Approach',
      type: 'array',
      group: 'story',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'process',
      title: 'Execution Process',
      type: 'array',
      group: 'story',
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
      options: arrayDialogOptions,
    }),
    defineField({
      name: 'outputs',
      title: 'Key Outputs',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'visuals',
      title: 'Gallery',
      type: 'array',
      group: 'media',
      of: [{type: 'image', options: {hotspot: true}}],
      options: {...arrayDialogOptions, layout: 'grid'},
    }),
    defineField({
      name: 'results',
      title: 'Results',
      type: 'array',
      group: 'results',
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
      group: 'results',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'lessons',
      title: 'Lessons / Insights',
      type: 'array',
      group: 'results',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'relatedPortfolio',
      title: 'Related Portfolio Items',
      type: 'array',
      group: 'relations',
      description:
        'Best practice: link 1 portfolio item to 1 case study (the usual setup). Link 2–3 items only when they are different deliverables for the same client and all should open this one story. Avoid multiple case studies for the same small project. Not every portfolio item needs a case study — skip for NDA, logo-only, or thin work.',
      of: [{type: 'reference', to: [{type: 'portfolio'}]}],
    }),
    seoAeoField(),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'client',
    },
  },
})