import {createClient} from '@sanity/client'
import type {SanityDocument} from '@sanity/client'

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'tmw5kvr6'
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production'

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
  heroImage {
    asset->{url}
  },
  backgroundImage {
    asset->{url}
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
    *[_type == "siteSettings"][0] {
      _id,
      header {
        logo {
          asset->{url}
        },
        logoAlt,
        title,
        menuItems,
        headerCta
      },
      footer {
        columns,
        socialLinks,
        copyrightText
      },
      theme {
        primaryColor,
        secondaryColor,
        accentColor,
        containerWidth,
        darkModeDefault
      }
    }
  `, {}, null)
}

export async function getPageBySlug(slug: string) {
  return safeFetch<SanityDocument | null>(`
    *[_type == "page" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      ${sectionProjection},
      seo,
      customColors,
      customColorScheme
    }
  `, {slug}, null)
}

export async function getAllPages() {
  return safeFetch<SanityDocument[]>(`
    *[_type == "page"] {
      _id,
      title,
      slug
    }
  `, {}, [])
}

export async function getHomePage() {
  return getPageBySlug('home')
}

export async function getAllServices() {
  return safeFetch<any[]>(`
    *[_type == "service"] | order(order asc) {
      _id,
      title,
      slug,
      icon,
      shortDescription,
      description,
      features,
      bestFor,
      deliverables,
      timeframe,
      relatedPortfolio,
      order
    }
  `, {}, [])
}

export async function getServiceBySlug(slug: string) {
  return safeFetch<any | null>(`
    *[_type == "service" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      icon,
      shortDescription,
      description,
      features,
      bestFor,
      deliverables,
      timeframe,
      relatedPortfolio,
      order
    }
  `, {slug}, null)
}

export async function getAllPortfolioItems() {
  return safeFetch<any[]>(`
    *[_type == "portfolio"] | order(order asc) {
      _id,
      title,
      slug,
      ${imageFields},
      category,
      shortResult,
      role,
      tags,
      client,
      year,
      industry,
      description,
      projectSummary,
      metrics,
      relatedServices,
      order
    }
  `, {}, [])
}

export async function getPortfolioItemBySlug(slug: string) {
  return safeFetch<any | null>(`
    *[_type == "portfolio" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      ${imageFields},
      category,
      shortResult,
      role,
      tags,
      client,
      year,
      industry,
      description,
      projectSummary,
      metrics,
      relatedServices,
      order
    }
  `, {slug}, null)
}

export async function getAllTestimonials() {
  return safeFetch<any[]>(`
    *[_type == "testimonial"] | order(order asc) {
      _id,
      quote,
      authorName,
      authorRole,
      authorAvatar {
        asset->{url}
      },
      relatedService,
      relatedPortfolio,
      rating,
      order
    }
  `, {}, [])
}