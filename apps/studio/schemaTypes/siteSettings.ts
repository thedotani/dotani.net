import {defineType, defineField} from 'sanity'
import {CogIcon} from '@sanity/icons'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    // Header Configuration
    defineField({
      name: 'header',
      title: 'Header',
      type: 'object',
      fields: [
        defineField({
          name: 'logo',
          title: 'Logo',
          type: 'image',
        }),
        defineField({
          name: 'logoAlt',
          title: 'Logo Alt Text',
          type: 'string',
        }),
        defineField({
          name: 'title',
          title: 'Site Title',
          type: 'string',
        }),
        defineField({
          name: 'menuItems',
          title: 'Menu Items',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'label',
                  title: 'Label',
                  type: 'string',
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: 'url',
                  title: 'URL',
                  type: 'string',
                  validation: (rule) => rule.required(),
                }),
              ],
              preview: {
                select: {title: 'label', subtitle: 'url'},
              },
            },
          ],
        }),
        defineField({
          name: 'headerCta',
          title: 'Header CTA Button',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'string',
            }),
          ],
        }),
      ],
    }),

    // Footer Configuration
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      fields: [
        defineField({
          name: 'columns',
          title: 'Footer Columns',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'width',
                  title: 'Column Width',
                  type: 'string',
                  options: {
                    list: [
                      {title: '20%', value: '20%'},
                      {title: '40%', value: '40%'},
                      {title: '33%', value: '33%'},
                    ],
                    layout: 'radio',
                  },
                }),
                defineField({
                  name: 'heading',
                  title: 'Heading',
                  type: 'string',
                }),
                defineField({
                  name: 'links',
                  title: 'Links',
                  type: 'array',
                  of: [{type: 'string'}],
                }),
              ],
            },
          ],
        }),
        defineField({
          name: 'socialLinks',
          title: 'Social Links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'platform',
                  title: 'Platform',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'LinkedIn', value: 'linkedin'},
                      {title: 'Facebook', value: 'facebook'},
                      {title: 'Instagram', value: 'instagram'},
                      {title: 'YouTube', value: 'youtube'},
                      {title: 'WhatsApp', value: 'whatsapp'},
                      {title: 'Twitter/X', value: 'twitter'},
                      {title: 'GitHub', value: 'github'},
                    ],
                    layout: 'dropdown',
                  },
                }),
                defineField({
                  name: 'url',
                  title: 'URL',
                  type: 'url',
                }),
              ],
            },
          ],
        }),
        defineField({
          name: 'copyrightText',
          title: 'Copyright Text',
          type: 'string',
        }),
      ],
    }),

    // Theme Configuration
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'object',
      fields: [
        defineField({
          name: 'primaryColor',
          title: 'Primary Color',
          type: 'string',
          initialValue: '#3b82f6',
        }),
        defineField({
          name: 'secondaryColor',
          title: 'Secondary Color',
          type: 'string',
          initialValue: '#64748b',
        }),
        defineField({
          name: 'accentColor',
          title: 'Accent Color',
          type: 'string',
          initialValue: '#f59e0b',
        }),
        defineField({
          name: 'containerWidth',
          title: 'Container Width',
          type: 'string',
          options: {
            list: [
              {title: 'Small', value: 'max-w-4xl'},
              {title: 'Medium', value: 'max-w-6xl'},
              {title: 'Large', value: 'max-w-7xl'},
              {title: 'Full', value: 'max-w-full'},
            ],
            layout: 'radio',
          },
          initialValue: 'max-w-7xl',
        }),
        defineField({
          name: 'darkModeDefault',
          title: 'Dark Mode Default',
          type: 'boolean',
          initialValue: false,
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
      }
    },
  },
})