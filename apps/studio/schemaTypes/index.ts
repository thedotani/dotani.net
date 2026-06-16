import siteSettings from './siteSettings'
import page from './page'
import * as sections from './sections'

// Content types
import service from '../schemaTypes/contentTypes/service'
import portfolio from '../schemaTypes/contentTypes/portfolio'
import caseStudy from '../schemaTypes/contentTypes/caseStudy'
import testimonial from '../schemaTypes/contentTypes/testimonial'
import blogPost from '../schemaTypes/contentTypes/blogPost'

export const schemaTypes = [
  // Singleton
  siteSettings,

  // Page builder
  page,

  // Section blocks
  ...Object.values(sections),

  // Content types
  service,
  portfolio,
  caseStudy,
  testimonial,
  blogPost,
]
