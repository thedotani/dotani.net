import {defineType, defineField} from 'sanity'
import {ImagesIcon} from '@sanity/icons'
import {seoAeoField} from '../../lib/fields/seoAeo'
import {arrayDialogOptions} from '../../lib/fields/arrayDialogOptions'
import {colorField} from '../../lib/fields/colorField'
import {industryOrderAccentFieldset, yearClientRoleFieldset} from '../../lib/fields/fieldLayout'

export default defineType({
  name: 'portfolio',
  title: 'Portfolio',
  type: 'document',
  icon: ImagesIcon,
  groups: [
    {name: 'overview', title: 'Overview', default: true},
    {name: 'story', title: 'Story'},
    {name: 'media', title: 'Media'},
    {name: 'results', title: 'Results'},
    {
      name: 'relations',
      title: 'Links',
      description:
        'Case studies are linked from the Case Study document (Relations tab), not here. One portfolio item usually has one case study; the site shows a “Read Full Case Study” button when a study references this item.',
    },
    {name: 'seo', title: 'SEO'},
  ],
  fieldsets: [
    {name: 'overviewMeta', title: ' ', options: {columns: 2}},
    {name: 'mediaRow', title: ' ', options: {columns: 2}},
    yearClientRoleFieldset,
    industryOrderAccentFieldset,
  ],
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
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'overview',
      fieldset: 'overviewMeta',
      options: {
        list: [
          {title: 'Strategy', value: 'strategy'},
          {title: 'Content', value: 'content'},
          {title: 'Social Media', value: 'social'},
          {title: 'Branding', value: 'branding'},
          {title: 'Campaigns', value: 'campaigns'},
          {title: 'Communication', value: 'communication'},
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'thumbnail',
      title: 'Featured',
      type: 'image',
      group: 'media',
      fieldset: 'mediaRow',
      options: {hotspot: true},
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'media',
      fieldset: 'mediaRow',
      of: [{type: 'image', options: {hotspot: true}}],
      options: {...arrayDialogOptions, layout: 'grid'},
    }),
    defineField({
      name: 'shortResult',
      title: 'Outcome',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      group: 'overview',
      fieldset: 'clientRow',
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
      group: 'overview',
      fieldset: 'clientRow',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      group: 'overview',
      fieldset: 'clientRow',
    }),
    defineField({
      name: 'industry',
      title: 'Industry',
      type: 'string',
      group: 'overview',
      fieldset: 'tagsRow',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      group: 'overview',
      fieldset: 'tagsRow',
      initialValue: 0,
    }),
    colorField({
      name: 'accentColor',
      title: 'Accent',
      group: 'overview',
      fieldset: 'tagsRow',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'overview',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'projectSummary',
      title: 'Summary',
      type: 'array',
      group: 'story',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      group: 'story',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'keyPoints',
      title: 'Key Points',
      type: 'array',
      group: 'story',
      of: [{type: 'string'}],
      options: arrayDialogOptions,
    }),
    defineField({
      name: 'metrics',
      title: 'Metrics',
      type: 'array',
      group: 'results',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'value', title: 'Value', type: 'string'}),
          ],
          preview: {
            select: {title: 'value', subtitle: 'label'},
          },
        },
      ],
      options: arrayDialogOptions,
    }),
    defineField({
      name: 'relatedServices',
      title: 'Services',
      type: 'array',
      group: 'relations',
      of: [{type: 'reference', to: [{type: 'service'}]}],
    }),
    seoAeoField(),
  ],
  orderings: [
    {title: 'Order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
    {title: 'Year', name: 'yearDesc', by: [{field: 'year', direction: 'desc'}]},
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'shortResult',
      category: 'category',
      media: 'thumbnail',
      year: 'year',
    },
    prepare({title, subtitle, category, media, year}) {
      return {
        title: title || 'Untitled',
        subtitle: [category, year, subtitle].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})