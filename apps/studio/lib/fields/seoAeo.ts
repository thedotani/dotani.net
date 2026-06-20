import {defineField, defineType} from 'sanity'
import {SearchIcon} from '@sanity/icons'
import {arrayDialogOptions} from './arrayDialogOptions'

export const seoAeoType = defineType({
  name: 'seoAeo',
  title: 'SEO & Discoverability',
  type: 'object',
  icon: SearchIcon,
  groups: [
    {name: 'search', title: 'Search', default: true},
    {name: 'social', title: 'Social Preview'},
    {name: 'ai', title: 'AI & Answers'},
    {name: 'advanced', title: 'Advanced'},
  ],
  fieldsets: [
    {name: 'searchBasics', title: 'Search Basics', options: {columns: 1}},
    {name: 'socialPreview', title: 'Open Graph', options: {columns: 2}},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Search Title',
      type: 'string',
      group: 'search',
      fieldset: 'searchBasics',
      description: 'Concise title for search results. Aim for 50–60 characters.',
      validation: (rule) => rule.max(70).warning('Titles longer than 70 characters may be truncated.'),
    }),
    defineField({
      name: 'description',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      group: 'search',
      fieldset: 'searchBasics',
      description: 'Summary shown in search snippets. Aim for 140–160 characters.',
      validation: (rule) =>
        rule.max(170).warning('Descriptions longer than 170 characters may be truncated.'),
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      group: 'search',
      description: 'Preferred URL when duplicate or syndicated content exists.',
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from Search Engines',
      type: 'boolean',
      group: 'search',
      description: 'Adds a noindex directive for this page or entry.',
      initialValue: false,
    }),
    defineField({
      name: 'ogTitle',
      title: 'Social Title',
      type: 'string',
      group: 'social',
      fieldset: 'socialPreview',
      description: 'Overrides the search title on social platforms when set.',
    }),
    defineField({
      name: 'ogDescription',
      title: 'Social Description',
      type: 'text',
      rows: 3,
      group: 'social',
      fieldset: 'socialPreview',
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Preview Image',
      type: 'image',
      group: 'social',
      description: 'Recommended 1200×630px. Used for Open Graph and Twitter cards.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'aiSummary',
      title: 'AI Retrieval Summary',
      type: 'text',
      rows: 4,
      group: 'ai',
      description:
        'Plain-language summary optimised for answer engines and AI retrieval. Focus on who, what, and why.',
    }),
    defineField({
      name: 'answerIntent',
      title: 'Primary Query Intent',
      type: 'string',
      group: 'ai',
      description: 'The main question or intent this content should answer (e.g. “What services do you offer?”).',
    }),
    defineField({
      name: 'keyEntities',
      title: 'Key Entities & Topics',
      type: 'array',
      group: 'ai',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      description: 'Semantic topics and entities that describe this content for modern search systems.',
    }),
    defineField({
      name: 'faq',
      title: 'FAQ / Q&A',
      type: 'array',
      group: 'ai',
      description: 'Optional question-and-answer pairs for rich results and answer engines.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {title: 'question', subtitle: 'answer'},
          },
        },
      ],
      options: arrayDialogOptions,
    }),
    defineField({
      name: 'structuredDataType',
      title: 'Structured Data Type',
      type: 'string',
      group: 'advanced',
      options: {
        list: [
          {title: 'Auto (recommended)', value: 'auto'},
          {title: 'WebPage', value: 'WebPage'},
          {title: 'Article', value: 'Article'},
          {title: 'Service', value: 'Service'},
          {title: 'CreativeWork', value: 'CreativeWork'},
          {title: 'Review', value: 'Review'},
          {title: 'Organization', value: 'Organization'},
        ],
        layout: 'dropdown',
      },
      initialValue: 'auto',
    }),
    defineField({
      name: 'jsonLdExtras',
      title: 'Structured Data Notes',
      type: 'text',
      rows: 3,
      group: 'advanced',
      description: 'Internal notes for custom JSON-LD properties. Not rendered directly.',
    }),
  ],
})

export function seoAeoField(name = 'seo', title = 'SEO & Discoverability', group = 'seo') {
  return defineField({
    name,
    title,
    type: 'seoAeo',
    group,
    options: {collapsible: true, collapsed: false},
  })
}