import {createClient} from '@sanity/client'
import type {SanityDocument} from '@sanity/client'

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID
const dataset = import.meta.env.PUBLIC_SANITY_DATASET
const SITE_SETTINGS_DOCUMENT_ID = 'site-settings-main'

export const client = createClient({
  projectId,
  dataset,
  useCdn: true,
  apiVersion: '2024-01-01',
})

async function safeFetch<T>(query: string, params: Record<string, unknown> = {}, fallback: T): Promise<T> {
  try {
    return await client.fetch<T>(query, params)
  } catch (error) {
    console.error('Sanity fetch failed:', error)
    return fallback
  }
}

const sectionProjection = `sections[]{
  ...,
  image {
    asset->{url}
  },
  backgroundImage {
    asset->{url}
  },
  "backgroundColor": coalesce(backgroundColor.hex, backgroundColor),
  "textColor": coalesce(textColor.hex, textColor),
  backgroundGradient {
    "from": coalesce(from.hex, from),
    "to": coalesce(to.hex, to),
    direction
  },
  statsSet->{
    _id,
    title,
    setType,
    metrics[]{
      _key,
      name,
      value,
      description,
      note
    }
  },
  marqueeSet->{
    _id,
    title,
    setType,
    marqueeItems[]{
      _key,
      name,
      note
    }
  }
}`

const imageFields = `
  thumbnail {
    asset->{url}
  },
  gallery[] {
    asset->{url}
  }
`

export async function getSiteSettings() {
  return safeFetch<SanityDocument | null>(`
    *[_type == "siteSettings" && _id == $siteSettingsId][0] {
      _id,
      brand {
        "logos": {
          "main": coalesce(logoMain, logos.main) { asset->{url} },
          "mobile": coalesce(logoMobile, logos.mobile) { asset->{url} },
          "footer": coalesce(logoFooter, logos.footer) { asset->{url} },
          "favicon": coalesce(logoFavicon, logos.favicon) { asset->{url} }
        },
        logoAlt,
        siteTitle,
        tagline
      },
      menus {
        items[] {
          label,
          url,
          showIn {
            header,
            mobileMenu,
            mobileMenuFooter,
            footerCol2,
            footerCol3,
            footerCol4,
            footerCopyright
          }
        }
      },
      header {
        logo { asset->{url} },
        logoAlt,
        title,
        menuItems,
        headerCta,
        showSocials,
        widthMode
      },
      mobileMenu {
        menuItems,
        showSocials,
        footerText
      },
      footer {
        description,
        col2Heading,
        col3Heading,
        col4Heading,
        copyrightText
      },
      socials {
        links
      },
      layoutSettings {
        containerMaxWidth,
        containerPaddingInline
      },
      theme {
        "primaryColor": coalesce(primaryColor.hex, primaryColor),
        "secondaryColor": coalesce(secondaryColor.hex, secondaryColor),
        "accentColor": coalesce(accentColor.hex, accentColor),
        "themeColor": coalesce(themeColor.hex, themeColor),
        containerWidth,
        darkModeDefault
      },
      seo
    }
  `, {siteSettingsId: SITE_SETTINGS_DOCUMENT_ID}, null)
}

export async function getPageBySlug(slug: string) {
  return safeFetch<SanityDocument | null>(`
    *[_type == "page" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      ${sectionProjection},
      customColors,
      colorMode,
      customColorScheme {
        "bodyText": coalesce(bodyText.hex, bodyText),
        "headings": coalesce(headings.hex, headings),
        "buttons": coalesce(buttons.hex, buttons),
        "accent": coalesce(accent.hex, accent),
        "background": coalesce(background.hex, background)
      },
      customGradient {
        "from": coalesce(from.hex, from),
        "to": coalesce(to.hex, to),
        direction,
        angle
      },
      customBackgroundImage {
        asset->{url}
      },
      seo
    }
  `, {slug}, null)
}

export async function getHomePage() {
  return getPageBySlug('home')
}

export async function getAllServices() {
  return safeFetch<SanityDocument[]>(`
    *[_type == "service"] | order(order asc, title asc) {
      _id,
      title,
      slug,
      icon,
      shortDescription,
      features,
      bestFor,
      order
    }
  `, {}, [])
}

export async function getServiceBySlug(slug: string) {
  return safeFetch<SanityDocument | null>(`
    *[_type == "service" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      icon,
      shortDescription,
      description,
      features,
      deliverables,
      bestFor,
      timeframe,
      order,
      "relatedPortfolio": relatedPortfolio[]->{ _id, title, slug, shortResult, thumbnail { asset->{url} } },
      "relatedTestimonials": relatedTestimonials[]->{ _id, authorName, authorRole, quote, authorAvatar { asset->{url} } },
      seo
    }
  `, {slug}, null)
}

export async function getAllPortfolioItems() {
  return safeFetch<SanityDocument[]>(`
    *[_type == "portfolio"] | order(order asc, year desc) {
      _id,
      title,
      slug,
      category,
      shortResult,
      year,
      order,
      ${imageFields}
    }
  `, {}, [])
}

export async function getPortfolioItemBySlug(slug: string) {
  return safeFetch<SanityDocument | null>(`
    *[_type == "portfolio" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      category,
      shortResult,
      year,
      client,
      role,
      industry,
      tags,
      order,
      projectSummary,
      description,
      keyPoints,
      metrics,
      ${imageFields},
      "relatedServices": relatedServices[]->{ _id, title, slug, icon },
      "caseStudy": *[_type == "caseStudy" && references(^._id)][0]{
        _id,
        title,
        slug,
        summary
      },
      seo
    }
  `, {slug}, null)
}

const caseStudyImageFields = `
  heroImage {
    asset->{url}
  },
  visuals[] {
    asset->{url}
  }
`

export async function getAllCaseStudies() {
  return safeFetch<SanityDocument[]>(`
    *[_type == "caseStudy"] | order(order asc, year desc) {
      _id,
      title,
      slug,
      client,
      industry,
      year,
      role,
      order,
      heroImage {
        asset->{url}
      },
      "relatedPortfolio": relatedPortfolio[]->{
        _id,
        title,
        slug,
        shortResult,
        thumbnail { asset->{url} }
      }
    }
  `, {}, [])
}

export async function getCaseStudyBySlug(slug: string) {
  return safeFetch<SanityDocument | null>(`
    *[_type == "caseStudy" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      client,
      industry,
      year,
      role,
      scope,
      duration,
      tools,
      summary,
      challenge,
      approach,
      process,
      outputs,
      results,
      impact,
      lessons,
      ${caseStudyImageFields},
      "relatedPortfolio": relatedPortfolio[]->{
        _id,
        title,
        slug,
        shortResult,
        category,
        year,
        thumbnail { asset->{url} }
      },
      seo
    }
  `, {slug}, null)
}

export async function getAllTestimonials() {
  return safeFetch<SanityDocument[]>(`
    *[_type == "testimonial"] | order(featured desc, order asc) {
      _id,
      authorName,
      authorRole,
      quote,
      rating,
      featured,
      order,
      authorAvatar { asset->{url} }
    }
  `, {}, [])
}

export async function getAllBlogPosts() {
  return safeFetch<SanityDocument[]>(`
    *[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      publishedAt
    }
  `, {}, [])
}