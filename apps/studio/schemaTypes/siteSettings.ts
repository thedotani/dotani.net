import {defineType, defineField} from 'sanity'
import {CogIcon} from '@sanity/icons'
import {dimensionField} from '../lib/fields/dimensionFields'
import {colorField} from '../lib/fields/colorField'
import {socialLinksArrayField} from '../lib/fields/socialLink'
import {universalMenuArrayField} from '../lib/fields/universalMenu'
import {logoRowFieldset} from '../lib/fields/fieldLayout'
import {seoAeoField} from '../lib/fields/seoAeo'

const widthModeOptions = {
  list: [
    {title: 'Full', value: 'full'},
    {title: 'Container', value: 'container'},
  ],
  layout: 'radio' as const,
  direction: 'horizontal' as const,
}

const ctaStyleOptions = {
  list: [
    {title: 'Default', value: 'default'},
    {title: 'Outline', value: 'outline'},
    {title: 'Ghost', value: 'ghost'},
  ],
  layout: 'radio' as const,
  direction: 'horizontal' as const,
}

const showHideOptions = {
  list: [
    {title: 'Show', value: 'show'},
    {title: 'Hide', value: 'hide'},
  ],
  layout: 'radio' as const,
  direction: 'horizontal' as const,
}

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'brand', title: 'Brand', default: true},
    {name: 'menus', title: 'Menus'},
    {name: 'header', title: 'Header'},
    {name: 'mobileMenu', title: 'Mobile'},
    {name: 'footer', title: 'Footer'},
    {name: 'socials', title: 'Socials'},
    {name: 'layout', title: 'Layout'},
    {name: 'theme', title: 'Theme'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'brand',
      title: ' ',
      type: 'object',
      group: 'brand',
      options: {collapsible: false},
      fieldsets: [
        logoRowFieldset,
        {name: 'identityRow', title: ' ', options: {columns: 3}},
      ],
      fields: [
        defineField({
          name: 'logoMain',
          title: 'Main Logo',
          type: 'image',
          fieldset: 'logoRow',
        }),
        defineField({
          name: 'logoMobile',
          title: 'Mobile Logo',
          type: 'image',
          fieldset: 'logoRow',
        }),
        defineField({
          name: 'logoFooter',
          title: 'Footer Logo',
          type: 'image',
          fieldset: 'logoRow',
        }),
        defineField({
          name: 'logoFavicon',
          title: 'Favicon',
          type: 'image',
          fieldset: 'logoRow',
        }),
        defineField({name: 'logoAlt', title: 'Alt Text', type: 'string', fieldset: 'identityRow'}),
        defineField({
          name: 'siteTitle',
          title: 'Title',
          type: 'string',
          fieldset: 'identityRow',
          initialValue: 'Dotani',
        }),
        defineField({name: 'tagline', title: 'Tagline', type: 'string', fieldset: 'identityRow'}),
      ],
    }),

    defineField({
      name: 'menus',
      title: ' ',
      type: 'object',
      group: 'menus',
      options: {collapsible: false},
      fields: [universalMenuArrayField],
    }),

    defineField({
      name: 'header',
      title: ' ',
      type: 'object',
      group: 'header',
      options: {collapsible: false},
      fieldsets: [{name: 'headerTop', title: ' ', options: {columns: 2}}],
      fields: [
        defineField({
          name: 'widthMode',
          title: 'Width',
          type: 'string',
          fieldset: 'headerTop',
          options: widthModeOptions,
          initialValue: 'container',
        }),
        defineField({
          name: 'showSocials',
          title: 'Socials',
          type: 'string',
          fieldset: 'headerTop',
          options: showHideOptions,
          initialValue: 'show',
        }),
        defineField({
          name: 'headerCta',
          title: 'CTA',
          type: 'object',
          fieldsets: [
            {name: 'ctaRow', title: ' ', options: {columns: 2}},
            {name: 'ctaOptions', title: ' ', options: {columns: 2}},
          ],
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string', fieldset: 'ctaRow'}),
            defineField({name: 'url', title: 'URL', type: 'string', fieldset: 'ctaRow'}),
            defineField({
              name: 'style',
              title: 'Style',
              type: 'string',
              fieldset: 'ctaOptions',
              options: ctaStyleOptions,
              initialValue: 'default',
            }),
            defineField({
              name: 'openInNewTab',
              title: 'New Tab',
              type: 'boolean',
              fieldset: 'ctaOptions',
              initialValue: false,
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'mobileMenu',
      title: ' ',
      type: 'object',
      group: 'mobileMenu',
      options: {collapsible: false},
      fields: [
        defineField({
          name: 'showSocials',
          title: 'Socials',
          type: 'string',
          options: showHideOptions,
          initialValue: 'show',
        }),
      ],
    }),

    defineField({
      name: 'footer',
      title: ' ',
      type: 'object',
      group: 'footer',
      options: {collapsible: false},
      fieldsets: [{name: 'footerColHeadings', title: ' ', options: {columns: 3}}],
      fields: [
        defineField({
          name: 'description',
          title: 'Branding description',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'col2Heading',
          title: 'Col 2',
          type: 'string',
          fieldset: 'footerColHeadings',
        }),
        defineField({
          name: 'col3Heading',
          title: 'Col 3',
          type: 'string',
          fieldset: 'footerColHeadings',
        }),
        defineField({
          name: 'col4Heading',
          title: 'Col 4',
          type: 'string',
          fieldset: 'footerColHeadings',
        }),
        defineField({
          name: 'copyrightText',
          title: 'Copyright',
          type: 'string',
        }),
      ],
    }),

    defineField({
      name: 'socials',
      title: ' ',
      type: 'object',
      group: 'socials',
      options: {collapsible: false},
      fields: [socialLinksArrayField],
    }),

    seoAeoField('seo', 'SEO & Discoverability', 'seo'),

    defineField({
      name: 'layoutSettings',
      title: ' ',
      type: 'object',
      group: 'layout',
      options: {collapsible: false, columns: 2},
      fields: [
        dimensionField('Max Width', 'containerMaxWidth', 80),
        dimensionField('Padding', 'containerPaddingInline', 1),
      ],
    }),

    defineField({
      name: 'theme',
      title: ' ',
      type: 'object',
      group: 'theme',
      options: {collapsible: false, columns: 2},
      fields: [
        colorField({
          name: 'primaryColor',
          title: 'Primary',
          initialValue: '#3b82f6',
        }),
        colorField({
          name: 'secondaryColor',
          title: 'Secondary',
          initialValue: '#64748b',
        }),
        colorField({
          name: 'accentColor',
          title: 'Accent',
          initialValue: '#f59e0b',
        }),
        colorField({
          name: 'themeColor',
          title: 'Theme',
          initialValue: '#0f172a',
        }),
        defineField({
          name: 'darkModeDefault',
          title: 'Default Mode',
          type: 'string',
          options: {
            list: [
              {title: 'System', value: 'system'},
              {title: 'Light', value: 'light'},
              {title: 'Dark', value: 'dark'},
            ],
            layout: 'radio',
            direction: 'horizontal',
          },
          initialValue: 'system',
        }),
        defineField({
          name: 'containerWidth',
          title: 'Container (Legacy)',
          type: 'string',
          hidden: true,
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
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})