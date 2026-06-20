import {defineType, defineField} from 'sanity'
import {CaseIcon} from '@sanity/icons'
import {iconPickerField, SERVICE_ICON_OPTIONS} from '../../lib/fields/iconPicker'
import {seoAeoField} from '../../lib/fields/seoAeo'
import {arrayDialogOptions} from '../../lib/fields/arrayDialogOptions'
import {ServiceIconBadge} from '../../lib/components/ServiceIconBadge'
import {slugOrderIconFieldset} from '../../lib/fields/fieldLayout'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  icon: CaseIcon,
  groups: [
    {name: 'overview', title: 'Overview', default: true},
    {name: 'content', title: 'Content'},
    {name: 'details', title: 'Details'},
    {name: 'relations', title: 'Links'},
    {name: 'seo', title: 'SEO'},
  ],
  fieldsets: [
    slugOrderIconFieldset,
    {name: 'relatedItems', title: ' ', options: {columns: 2}},
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
      name: 'order',
      title: 'Order',
      type: 'number',
      group: 'overview',
      fieldset: 'overviewMeta',
      initialValue: 0,
    }),
    iconPickerField({
      title: 'Icon',
      list: SERVICE_ICON_OPTIONS,
      group: 'overview',
      fieldset: 'overviewMeta',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Excerpt',
      type: 'text',
      group: 'overview',
      rows: 3,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      group: 'content',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [defineField({name: 'text', title: 'Feature', type: 'string'})],
          preview: {
            select: {title: 'text'},
            prepare({title}) {
              return {title: title || 'Feature'}
            },
          },
        },
      ],
      options: arrayDialogOptions,
    }),
    defineField({
      name: 'deliverables',
      title: 'Deliverables',
      type: 'array',
      group: 'details',
      of: [{type: 'string'}],
      options: arrayDialogOptions,
    }),
    defineField({
      name: 'bestFor',
      title: 'Best For',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'timeframe',
      title: 'Timeframe',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'relatedPortfolio',
      title: 'Portfolio',
      type: 'array',
      group: 'relations',
      fieldset: 'relatedItems',
      of: [{type: 'reference', to: [{type: 'portfolio'}]}],
    }),
    defineField({
      name: 'relatedTestimonials',
      title: 'Testimonials',
      type: 'array',
      group: 'relations',
      fieldset: 'relatedItems',
      of: [{type: 'reference', to: [{type: 'testimonial'}]}],
    }),
    seoAeoField(),
  ],
  orderings: [
    {title: 'Order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
    {title: 'Title', name: 'titleAsc', by: [{field: 'title', direction: 'asc'}]},
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'shortDescription',
      icon: 'icon',
      order: 'order',
    },
    prepare({title, subtitle, icon, order}) {
      return {
        title: title || 'Untitled',
        subtitle: [subtitle, order != null ? `#${order}` : null].filter(Boolean).join(' · '),
        media: icon ? () => ServiceIconBadge({icon}) : CaseIcon,
      }
    },
  },
})