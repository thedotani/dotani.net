import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONTENT_SETS, PAGE_SECTIONS } from './seed-pages.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceSeed = resolve(repoRoot, 'scripts', 'seed-source.js');
const seedNdjson = resolve(repoRoot, 'seed.ndjson');

const PAGE_IDS = new Set([
  'page-home',
  'page-services',
  'page-work',
  'page-about',
  'page-contact',
  'page-booking',
]);

const KEEP_TYPES = new Set([
  'siteSettings',
  'service',
  'portfolio',
  'testimonial',
  'caseStudy',
  'page',
  'contentSet',
]);

let raw;

if (existsSync(sourceSeed)) {
  raw = execFileSync(process.execPath, [sourceSeed], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });
} else if (existsSync(seedNdjson)) {
  raw = readFileSync(seedNdjson, 'utf8');
} else {
  throw new Error(
    'No seed source found. Add scripts/seed-source.js or commit seed.ndjson to the repo.',
  );
}

const docs = raw
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line))
  .filter((doc) => {
    if (!KEEP_TYPES.has(doc._type)) return false;
    if (doc._type === 'page' && !PAGE_IDS.has(doc._id)) return false;
    return true;
  });

function replaceUrls(value) {
  if (typeof value === 'string') {
    return value
      .replaceAll('/work', '/portfolio')
      .replaceAll('/about', '/profile')
      .replaceAll('/blog', '/');
  }

  if (Array.isArray(value)) {
    return value.map(replaceUrls);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, replaceUrls(entry)]),
    );
  }

  return value;
}

function bookingPage() {
  return {
    _id: 'page-booking',
    _type: 'page',
    title: 'Booking',
    slug: { _type: 'slug', current: 'booking' },
    excerpt: 'Book a focused intro call to talk through your project, idea, or challenge.',
    customColors: false,
    sections: PAGE_SECTIONS['page-booking'],
    seo: {
      title: 'Book a Call — Dotani',
      description:
        'Schedule a 30-minute intro call with Raza Dotani to discuss strategy, content, or digital presence.',
    },
  };
}

const navItems = [
  { _key: 'nav-home', label: 'Home', url: '/' },
  { _key: 'nav-services', label: 'Services', url: '/services' },
  { _key: 'nav-portfolio', label: 'Portfolio', url: '/portfolio' },
  { _key: 'nav-profile', label: 'Profile', url: '/profile' },
  { _key: 'nav-contact', label: 'Contact', url: '/contact' },
  { _key: 'nav-booking', label: 'Booking', url: '/booking' },
];

for (const doc of docs) {
  if (doc._type === 'siteSettings') {
    doc.header ??= {};
    doc.header.menuItems = navItems;
    doc.header.headerCta = { label: 'Book a Call', url: '/booking' };

    doc.footer ??= {};
    doc.footer.col3Heading ??= 'Quick Links';
  }

  if (doc._type === 'page') {
    doc.sections = replaceUrls(PAGE_SECTIONS[doc._id] ?? []);

    if (doc._id === 'page-about') {
      doc.title = 'Profile';
      doc.slug = { _type: 'slug', current: 'profile' };
    }

    if (doc._id === 'page-work') {
      doc.title = 'Portfolio';
      doc.slug = { _type: 'slug', current: 'portfolio' };
    }
  }
}

if (!docs.some((doc) => doc._id === 'page-booking')) {
  docs.push(bookingPage());
}

for (const contentSet of CONTENT_SETS) {
  const index = docs.findIndex((doc) => doc._id === contentSet._id);
  if (index >= 0) {
    docs[index] = contentSet;
  } else {
    docs.push(contentSet);
  }
}

for (const doc of docs) {
  process.stdout.write(`${JSON.stringify(doc)}\n`);
}

const counts = docs.reduce((summary, doc) => {
  summary[doc._type] = (summary[doc._type] ?? 0) + 1;
  return summary;
}, {});

process.stderr.write(
  [
    '',
    `Prepared ${docs.length} documents for import:`,
    ...Object.entries(counts).map(([type, count]) => `  ${type}: ${count}`),
    '',
    'Source: scripts/seed-source.js + scripts/seed-pages.mjs',
    'Pages: home, services, portfolio, profile, contact, booking.',
    'Page builder: contentBoxSection, contentSetSection, richTextSection.',
    'Excluded: blogPost and sections demo.',
    '',
  ].join('\n'),
);