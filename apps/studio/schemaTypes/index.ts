import siteSettings from './siteSettings'
import page from './page'
import {
  contentBoxSection,
  contentSetSection,
  richTextSection,
} from './sections'
import {seoAeoType} from '../lib/fields/seoAeo'
import {socialLinkEntry} from '../lib/fields/socialLink'

// Content types
import service from '../schemaTypes/contentTypes/service'
import portfolio from '../schemaTypes/contentTypes/portfolio'
import caseStudy from '../schemaTypes/contentTypes/caseStudy'
import testimonial from '../schemaTypes/contentTypes/testimonial'
import blogPost from '../schemaTypes/contentTypes/blogPost'
import contentSet from '../schemaTypes/contentTypes/contentSet'

export const schemaTypes = [
  // Shared objects
  seoAeoType,
  socialLinkEntry,

  // Singleton
  siteSettings,

  // Section blocks — must register before `page` (page array references these)
  contentBoxSection,
  contentSetSection,
  richTextSection,

  // Page builder
  page,

  // Content types
  service,
  portfolio,
  caseStudy,
  testimonial,
  blogPost,
  contentSet,
]