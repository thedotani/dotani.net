import type {StructureResolver} from 'sanity/structure'
import {SITE_SETTINGS_DOCUMENT_ID, PAGE_DOCUMENTS} from '../lib/constants'
import {
  CogIcon,
  HomeIcon,
  DocumentsIcon,
  CaseIcon,
  UsersIcon,
  ComposeIcon,
  DocumentTextIcon,
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  StackIcon,
  ThListIcon,
} from '@sanity/icons'

const PAGE_ICONS: Record<string, typeof HomeIcon> = {
  'page-home': HomeIcon,
  'page-services': CaseIcon,
  'page-work': StackIcon,
  'page-about': UserIcon,
  'page-contact': EnvelopeIcon,
  'page-booking': CalendarIcon,
}

const MANAGED_TYPES = new Set([
  'siteSettings',
  'page',
  'service',
  'portfolio',
  'testimonial',
  'caseStudy',
  'blogPost',
  'contentSet',
])

function singleton(
  S: Parameters<StructureResolver>[0],
  typeName: string,
  title: string,
  documentId: string,
  icon: typeof CogIcon,
) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .child(
      S.document()
        .schemaType(typeName)
        .documentId(documentId)
        .title(title),
    )
}

function orderedList(
  S: Parameters<StructureResolver>[0],
  typeName: string,
  title: string,
  icon: typeof CogIcon,
  orderField = 'order',
) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .child(
      S.documentTypeList(typeName)
        .title(title)
        .defaultOrdering([{field: orderField, direction: 'asc'}]),
    )
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Dotani Studio')
    .items([
      S.listItem()
        .title('Site')
        .icon(HomeIcon)
        .child(
          S.list()
            .title('Site')
            .items([
              singleton(
                S,
                'siteSettings',
                'Site Settings',
                SITE_SETTINGS_DOCUMENT_ID,
                CogIcon,
              ),
              S.divider(),
              ...PAGE_DOCUMENTS.map((page) =>
                singleton(
                  S,
                  'page',
                  page.title,
                  page.id,
                  PAGE_ICONS[page.id] ?? DocumentTextIcon,
                ),
              ),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title('Content Library')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Content Library')
            .items([
              orderedList(S, 'service', 'Services', CaseIcon),
              orderedList(S, 'portfolio', 'Portfolio', DocumentTextIcon),
              orderedList(S, 'testimonial', 'Testimonials', UsersIcon),
              orderedList(S, 'caseStudy', 'Case Studies', DocumentsIcon),
              S.documentTypeListItem('blogPost')
                .title('Blog Posts')
                .icon(ComposeIcon)
                .child(
                  S.documentTypeList('blogPost')
                    .title('Blog Posts')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
                ),
              S.divider(),
              orderedList(S, 'contentSet', 'Content Sets', ThListIcon, 'title'),
            ]),
        ),

      S.divider(),

      ...S.documentTypeListItems().filter((item) => !MANAGED_TYPES.has(item.getId() as string)),
    ])