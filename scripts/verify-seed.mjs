import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || 'tmw5kvr6',
  dataset: process.env.PUBLIC_SANITY_DATASET || 'staging',
  apiVersion: '2024-01-01',
  useCdn: false,
});

const expectedPages = ['home', 'services', 'portfolio', 'profile', 'contact', 'booking'];

const [settings, pages, counts] = await Promise.all([
  client.fetch(`*[_type == "siteSettings"][0]{ _id, header { menuItems } }`),
  client.fetch(`*[_type == "page"]{ title, "slug": slug.current, "sectionCount": count(sections) }`),
  client.fetch(`{
    "services": count(*[_type == "service"]),
    "portfolio": count(*[_type == "portfolio"]),
    "testimonials": count(*[_type == "testimonial"]),
    "caseStudies": count(*[_type == "caseStudy"])
  }`),
]);

const slugs = pages.map((page) => page.slug);
const missingPages = expectedPages.filter((slug) => !slugs.includes(slug));
const home = pages.find((page) => page.slug === 'home');

const ok =
  settings?._id === 'site-settings-main' &&
  missingPages.length === 0 &&
  (home?.sectionCount ?? 0) > 0 &&
  counts.services === 6 &&
  counts.portfolio === 5 &&
  counts.testimonials === 5 &&
  counts.caseStudies === 5 &&
  (settings?.header?.menuItems?.length ?? 0) >= 6;

console.log(
  JSON.stringify(
    {
      settings: { id: settings?._id, navCount: settings?.header?.menuItems?.length ?? 0 },
      pages,
      missingPages,
      counts,
      ok,
    },
    null,
    2,
  ),
);

process.exit(ok ? 0 : 1);