import {createClient} from '@sanity/client'
import type {SanityDocument} from '@sanity/client'

export const client = createClient({
  projectId: 'tmw5kvr6',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
})

export async function getSiteSettings() {
  return client.fetch<SanityDocument | null>(`
    *[_type == "siteSettings"][0] {
      _id,
      header {
        logo,
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
  `)
}

export async function getPageBySlug(slug: string) {
  return client.fetch<SanityDocument | null>(`
    *[_type == "page" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      sections,
      seo,
      customColors,
      customColorScheme
    }
  `, {slug})
}

export async function getAllPages() {
  return client.fetch<SanityDocument[]>(`
    *[_type == "page"] {
      _id,
      title,
      slug
    }
  `)
}

export async function getHomePage() {
  return getPageBySlug('home')
}

export async function getAllServices() {
  return client.fetch<any[]>(`
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
  `)
}

export async function getServiceBySlug(slug: string) {
  return client.fetch<any | null>(`
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
  `, {slug})
}

export async function getAllPortfolioItems() {
  return client.fetch<any[]>(`
    *[_type == "portfolio"] | order(order asc) {
      _id,
      title,
      slug,
      thumbnail,
      category,
      shortResult,
      role,
      tags,
      client,
      year,
      industry,
      description,
      projectSummary,
      gallery,
      metrics,
      relatedServices,
      order
    }
  `)
}

export async function getPortfolioItemBySlug(slug: string) {
  return client.fetch<any | null>(`
    *[_type == "portfolio" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      thumbnail,
      category,
      shortResult,
      role,
      tags,
      client,
      year,
      industry,
      description,
      projectSummary,
      gallery,
      metrics,
      relatedServices,
      order
    }
  `, {slug})
}

export async function getAllTestimonials() {
  return client.fetch<any[]>(`
    *[_type == "testimonial"] {
      _id,
      quote,
      authorName,
      authorRole,
      authorAvatar,
      relatedService,
      relatedPortfolio,
      rating,
      order
    }
  `)
}