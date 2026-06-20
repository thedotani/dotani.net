import {defineType, defineField} from 'sanity'
import {CommentIcon} from '@sanity/icons'
import {featuredField} from '../../lib/fields/featuredField'
import {seoAeoField} from '../../lib/fields/seoAeo'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: CommentIcon,
  groups: [
    {name: 'author', title: 'Author', default: true},
    {name: 'quote', title: 'Quote'},
    {name: 'status', title: 'Status'},
    {name: 'relations', title: 'Links'},
    {name: 'seo', title: 'SEO'},
  ],
  fieldsets: [
    {name: 'authorDetails', title: ' ', options: {columns: 2}},
    {name: 'ratingFeatured', title: ' ', options: {columns: 3}},
    {name: 'relatedItems', title: ' ', options: {columns: 2}},
  ],
  fields: [
    defineField({
      name: 'authorName',
      title: 'Name',
      type: 'string',
      group: 'author',
      fieldset: 'authorDetails',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'authorRole',
      title: 'Role',
      type: 'string',
      group: 'author',
      fieldset: 'authorDetails',
    }),
    defineField({
      name: 'authorAvatar',
      title: 'Avatar',
      type: 'image',
      group: 'author',
      fieldset: 'authorDetails',
      options: {hotspot: true},
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      group: 'quote',
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      group: 'status',
      fieldset: 'ratingFeatured',
      validation: (rule) => rule.min(1).max(5),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      group: 'status',
      fieldset: 'ratingFeatured',
      initialValue: 0,
    }),
    featuredField({group: 'status', fieldset: 'ratingFeatured'}),
    defineField({
      name: 'relatedService',
      title: 'Service',
      type: 'reference',
      group: 'relations',
      fieldset: 'relatedItems',
      to: [{type: 'service'}],
    }),
    defineField({
      name: 'relatedPortfolio',
      title: 'Portfolio',
      type: 'reference',
      group: 'relations',
      fieldset: 'relatedItems',
      to: [{type: 'portfolio'}],
    }),
    seoAeoField(),
  ],
  orderings: [
    {title: 'Order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
    {title: 'Featured', name: 'featuredDesc', by: [{field: 'featured', direction: 'desc'}]},
  ],
  preview: {
    select: {
      title: 'authorName',
      subtitle: 'authorRole',
      quote: 'quote',
      media: 'authorAvatar',
      rating: 'rating',
      featured: 'featured',
    },
    prepare({title, subtitle, quote, media, rating, featured}) {
      const excerpt = quote ? `${quote.slice(0, 72)}${quote.length > 72 ? '…' : ''}` : ''
      return {
        title: title || 'Anonymous',
        subtitle: [
          featured ? 'Featured' : null,
          subtitle,
          rating ? `${rating}★` : null,
          excerpt,
        ]
          .filter(Boolean)
          .join(' · '),
        media,
      }
    },
  },
})