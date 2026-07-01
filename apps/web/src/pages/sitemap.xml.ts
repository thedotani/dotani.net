import type { APIRoute } from 'astro'
import { client } from '../lib/sanity'

interface SitemapEntry {
  loc: string
  lastmod?: string
  changefreq?: string
  priority?: string
}

const STATIC_ROUTES: SitemapEntry[] = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/services', priority: '0.9', changefreq: 'monthly' },
  { loc: '/portfolio', priority: '0.9', changefreq: 'weekly' },
]

function url(entry: SitemapEntry, origin: string): string {
  const tags = [
    `<loc>${origin}${entry.loc}</loc>`,
    entry.lastmod && `<lastmod>${entry.lastmod}</lastmod>`,
    entry.changefreq && `<changefreq>${entry.changefreq}</changefreq>`,
    entry.priority && `<priority>${entry.priority}</priority>`,
  ].filter(Boolean).join('\n      ')
  return `  <url>\n      ${tags}\n    </url>`
}

async function fetchDynamicRoutes(): Promise<SitemapEntry[]> {
  try {
    const [services, portfolio, caseStudies] = await Promise.all([
      client.fetch<{ slug?: { current?: string }; _updatedAt?: string }[]>(
        `*[_type == "service" && defined(slug.current)]{ slug, _updatedAt }`,
      ),
      client.fetch<{ slug?: { current?: string }; _updatedAt?: string }[]>(
        `*[_type == "portfolio" && defined(slug.current)]{ slug, _updatedAt }`,
      ),
      client.fetch<{ slug?: { current?: string }; _updatedAt?: string }[]>(
        `*[_type == "caseStudy" && defined(slug.current)]{ slug, _updatedAt }`,
      ),
    ])

    const entries: SitemapEntry[] = []

    for (const s of services) {
      entries.push({
        loc: `/services/${s.slug?.current}`,
        lastmod: s._updatedAt?.split('T')[0],
        priority: '0.8',
        changefreq: 'monthly',
      })
    }

    for (const p of portfolio) {
      entries.push({
        loc: `/portfolio/${p.slug?.current}`,
        lastmod: p._updatedAt?.split('T')[0],
        priority: '0.8',
        changefreq: 'monthly',
      })
    }

    for (const c of caseStudies) {
      entries.push({
        loc: `/case-studies/${c.slug?.current}`,
        lastmod: c._updatedAt?.split('T')[0],
        priority: '0.7',
        changefreq: 'monthly',
      })
    }

    return entries
  } catch {
    return []
  }
}

export const GET: APIRoute = async ({ url: reqUrl }) => {
  const origin = `${reqUrl.protocol}//${reqUrl.host}`
  const dynamic = await fetchDynamicRoutes()
  const all = [...STATIC_ROUTES, ...dynamic]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map((e) => url(e, origin)).join('\n')}
</urlset>`

  return new Response(xml, {
    status: 200,
    headers: { 'Content-Type': 'application/xml' },
  })
}
