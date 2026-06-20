import {defineType, defineField, defineArrayMember} from 'sanity'
import {HomeIcon, BlockContentIcon, ThListIcon, DocumentTextIcon} from '@sanity/icons'
import {seoAeoField} from '../lib/fields/seoAeo'
import {colorField} from '../lib/fields/colorField'

const PAGE_SECTION_MEMBERS = [
  defineArrayMember({
    type: 'contentBoxSection',
    title: 'Content Box',
    icon: BlockContentIcon,
  }),
  defineArrayMember({
    type: 'contentSetSection',
    title: 'Content Set',
    icon: ThListIcon,
  }),
  defineArrayMember({
    type: 'richTextSection',
    title: 'Rich Text',
    icon: DocumentTextIcon,
  }),
]

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'info', title: 'Info', default: true},
    {name: 'content', title: 'Content'},
    {name: 'style', title: 'Style'},
    {name: 'seo', title: 'SEO'},
  ],
  fieldsets: [
    {name: 'basics', title: 'Basics', options: {columns: 2}},
    {
      name: 'appearanceFields',
      title: 'Colours',
      options: {collapsible: true, collapsed: true, columns: 2},
    },
    {
      name: 'gradientFields',
      title: 'Gradient',
      options: {collapsible: true, collapsed: true, columns: 2},
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'info',
      fieldset: 'basics',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'info',
      fieldset: 'basics',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: 'info',
      rows: 3,
    }),
    defineField({
      name: 'sections',
      title: 'Page content',
      type: 'array',
      group: 'content',
      description:
        'Add content boxes, stats/marquee sets, or rich text blocks. New sections appear inline below.',
      of: PAGE_SECTION_MEMBERS,
      options: {
        insertMenu: {
          filter: true,
          views: [{name: 'list'}],
        },
      },
    }),
    defineField({
      name: 'customColors',
      title: 'Custom Colours',
      type: 'boolean',
      group: 'style',
      fieldset: 'appearanceFields',
      initialValue: false,
    }),
    defineField({
      name: 'colorMode',
      title: 'Mode',
      type: 'string',
      group: 'style',
      options: {
        list: [
          {title: 'Simple', value: 'simple'},
          {title: 'Gradient', value: 'gradient'},
          {title: 'Image', value: 'image'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'simple',
      hidden: ({parent}) => !parent?.customColors,
    }),
    defineField({
      name: 'customColorScheme',
      title: 'Simple',
      type: 'object',
      group: 'style',
      fieldset: 'appearanceFields',
      options: {columns: 2},
      fields: [
        colorField({name: 'bodyText', title: 'Text'}),
        colorField({name: 'headings', title: 'Headings'}),
        colorField({name: 'buttons', title: 'Buttons'}),
        colorField({name: 'accent', title: 'Accent'}),
        colorField({name: 'background', title: 'BG'}),
      ],
      hidden: ({parent}) => !parent?.customColors || parent?.colorMode !== 'simple',
    }),
    defineField({
      name: 'customGradient',
      title: 'Gradient',
      type: 'object',
      group: 'style',
      fieldset: 'gradientFields',
      options: {columns: 2},
      fields: [
        colorField({name: 'from', title: 'From'}),
        colorField({name: 'to', title: 'To'}),
        defineField({
          name: 'direction',
          title: 'Direction',
          type: 'string',
          options: {
            list: [
              {title: '↓', value: 'bg-gradient-to-b'},
              {title: '↑', value: 'bg-gradient-to-t'},
              {title: '→', value: 'bg-gradient-to-r'},
              {title: '←', value: 'bg-gradient-to-l'},
              {title: '↘', value: 'bg-gradient-to-br'},
            ],
            layout: 'dropdown',
          },
          initialValue: 'bg-gradient-to-b',
        }),
        defineField({
          name: 'angle',
          title: 'Angle',
          type: 'number',
        }),
      ],
      hidden: ({parent}) => !parent?.customColors || parent?.colorMode !== 'gradient',
    }),
    defineField({
      name: 'customBackgroundImage',
      title: 'BG Image',
      type: 'image',
      group: 'style',
      hidden: ({parent}) => !parent?.customColors || parent?.colorMode !== 'image',
    }),
    seoAeoField(),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      sections: 'sections',
    },
    prepare({title, slug, sections}) {
      const count = Array.isArray(sections) ? sections.length : 0
      return {
        title: title || 'Untitled',
        subtitle: [slug ? `/${slug}` : null, `${count} sections`].filter(Boolean).join(' · '),
      }
    },
  },
})