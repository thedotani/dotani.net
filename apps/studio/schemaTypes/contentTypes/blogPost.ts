import {defineType, defineField} from 'sanity'
import {ComposeIcon} from '@sanity/icons'
import {formatPreviewDate} from '../../lib/schemaHelpers'
import {seoAeoField} from '../../lib/fields/seoAeo'
import {featuredField} from '../../lib/fields/featuredField'
import {arrayDialogOptions} from '../../lib/fields/arrayDialogOptions'

export default defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  icon: ComposeIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'media', title: 'Media'},
    {name: 'meta', title: 'Metadata'},
    {name: 'seo', title: 'SEO'},
  ],
  fieldsets: [
    {name: 'postMeta', title: 'Post Info', options: {columns: 2}},
    {name: 'publishMeta', title: 'Publishing', options: {columns: 2}},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      fieldset: 'postMeta',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      fieldset: 'postMeta',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: 'content',
      rows: 3,
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      group: 'content',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'coverImage',
      title: 'Featured',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'media',
      of: [{type: 'image', options: {hotspot: true}}],
      options: {...arrayDialogOptions, layout: 'grid'},
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      group: 'meta',
      fieldset: 'publishMeta',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      group: 'meta',
      fieldset: 'publishMeta',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'meta',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    featuredField({group: 'meta'}),
    seoAeoField(),
  ],
  orderings: [
    {title: 'Published (Newest)', name: 'publishedDesc', by: [{field: 'publishedAt', direction: 'desc'}]},
    {title: 'Featured First', name: 'featuredDesc', by: [{field: 'featured', direction: 'desc'}]},
  ],
  preview: {
    select: {
      title: 'title',
      publishedAt: 'publishedAt',
      author: 'author',
      media: 'coverImage',
      featured: 'featured',
    },
    prepare({title, publishedAt, author, media, featured}) {
      return {
        title: title || 'Untitled Post',
        subtitle: [featured ? 'Featured' : null, formatPreviewDate(publishedAt), author]
          .filter(Boolean)
          .join(' · '),
        media,
      }
    },
  },
})