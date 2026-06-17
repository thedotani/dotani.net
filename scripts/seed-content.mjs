import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceSeed = resolve(repoRoot, 'Prompts', 'seed_new.js');

const PAGE_HOME_ID = 'page-home';

const KEEP_TYPES = new Set(['siteSettings', 'service', 'portfolio', 'testimonial', 'page']);

const raw = execFileSync(process.execPath, [sourceSeed], {
  cwd: repoRoot,
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'ignore'],
});

const docs = raw
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line))
  .filter((doc) => {
    if (!KEEP_TYPES.has(doc._type)) return false;
    if (doc._type === 'page' && doc._id !== PAGE_HOME_ID) return false;
    return true;
  });

function replaceUrls(value) {
  if (typeof value === 'string') {
    return value
      .replaceAll('/work', '/portfolio')
      .replaceAll('/contact', '#contact')
      .replaceAll('/about', '/')
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

function contactSections() {
  return [
    {
      _type: 'contactSection',
      _key: 'seed-contact',
      sectionId: 'contact',
      visible: true,
      paddingTop: 'py-24',
      paddingBottom: 'py-24',
      backgroundType: 'solid',
      backgroundColor: '',
      backgroundImageOpacity: 100,
      alignment: 'text-left items-start',
      containerWidthOverride: '',
      headline: 'Send a message',
      supportingText:
        "Tell me about the project, the problem, or the idea. I'll get back to you within 48 hours.",
      submitButtonText: 'Send Message',
      successMessage: "Got it. I'll be in touch within 48 hours.",
    },
    {
      _type: 'bookingSection',
      _key: 'seed-booking',
      sectionId: 'booking',
      visible: true,
      paddingTop: 'py-16',
      paddingBottom: 'py-24',
      backgroundType: 'solid',
      backgroundColor: '#1e293b',
      backgroundImageOpacity: 100,
      alignment: 'text-center items-center',
      containerWidthOverride: '',
      headline: 'Prefer a call?',
      supportingText:
        'Book a 30-minute intro call directly in my calendar. No agenda required.',
      calLink: '',
      buttonLabel: 'Book a Call',
      layout: 'centered',
    },
  ];
}

for (const doc of docs) {
  if (doc._type === 'siteSettings') {
    doc.header ??= {};
    doc.header.menuItems = [
      { _key: 'nav-home', label: 'Home', url: '/' },
      { _key: 'nav-services', label: 'Services', url: '/services' },
      { _key: 'nav-portfolio', label: 'Portfolio', url: '/portfolio' },
    ];
    doc.header.headerCta = { label: "Let's Talk", url: '#contact' };

    if (doc.footer?.columns) {
      const quickLinks = doc.footer.columns.find((column) => column.heading === 'Quick Links');
      if (quickLinks) {
        quickLinks.links = ['Home', 'Services', 'Portfolio'];
      }
    }
  }

  if (doc._type === 'page' && doc._id === PAGE_HOME_ID) {
    doc.sections = replaceUrls(doc.sections ?? []);

    const portfolioSection = doc.sections.find((section) => section._type === 'portfolioSection');
    if (portfolioSection) {
      portfolioSection.ctaButton = {
        label: 'See All Work',
        url: '/portfolio',
      };
    }

    const hasContact = doc.sections.some((section) => section._type === 'contactSection');
    if (!hasContact) {
      doc.sections.push(...contactSections());
    }
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
    'Excluded: blogPost, caseStudy, and CMS pages without Astro routes.',
    'Adjusted links: /portfolio, /services, #contact.',
    '',
  ].join('\n'),
);