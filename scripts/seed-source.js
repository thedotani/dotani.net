/**
 * seed.js — Sanity Demo Content for dotani.net
 *
 * Run:    node seed.js > seed.ndjson
 * Import: sanity dataset import seed.ndjson production --replace
 *
 * Documents:
 *   siteSettings × 1
 *   service       × 6
 *   portfolio     × 5
 *   caseStudy     × 5
 *   testimonial   × 5
 *   blogPost      × 5
 *   page          × 6  (Home, About, Services, Work, Contact, + Sections Demo)
 *
 * Page sections are overridden at import time by scripts/seed-pages.mjs
 * (contentBoxSection, contentSetSection, richTextSection).
 */

// ─── HELPERS ──────────────────────────────────────────────────────────────────

let _c = 1000
const key = () => 'k' + (++_c).toString(36)

const block = (text, style = 'normal') => {
  const k = key()
  return {
    _key: k,
    _type: 'block',
    style,
    markDefs: [],
    children: [{ _key: k + 'c', _type: 'span', marks: [], text }],
  }
}

const slug = (s) => ({ _type: 'slug', current: s })

// Reference inside an array (needs _key)
const aref = (id) => ({ _type: 'reference', _ref: id, _key: key() })

// Reference as a plain field (no _key needed)
const ref = (id) => ({ _type: 'reference', _ref: id })

// Button object for use inside buttons arrays
const btn = (label, url, style = 'primary', newTab = false) => ({
  _key: key(),
  label,
  url,
  style,
  openInNewTab: newTab,
})

// ─── sectionCommonFields defaults — use these as a base and spread/override
const common = (overrides = {}) => ({
  sectionId: overrides.sectionId || '',
  visible: true,
  paddingTop: overrides.paddingTop || 'py-16',
  paddingBottom: overrides.paddingBottom || 'py-16',
  backgroundType: overrides.backgroundType || 'solid',
  backgroundColor: overrides.backgroundColor || '',
  backgroundGradient: overrides.backgroundGradient || undefined,
  backgroundImageOpacity: 100,
  alignment: overrides.alignment || 'text-left items-start',
  containerWidthOverride: overrides.containerWidthOverride || '',
})

// ─── FIXED IDs ────────────────────────────────────────────────────────────────

const ID = {
  settings: 'site-settings-main',
  svcSMM:   'service-smm',
  svcPB:    'service-pb',
  svcCS:    'service-cs',
  svcWD:    'service-wd',
  svcDC:    'service-dc',
  svcTW:    'service-tw',
  portZLC:  'portfolio-zlc',
  portSH:   'portfolio-sh',
  portAM:   'portfolio-am',
  portKS:   'portfolio-ks',
  portTT:   'portfolio-tt',
  caseZLC:  'casestudy-zlc',
  caseSH:   'casestudy-sh',
  caseAM:   'casestudy-am',
  caseKS:   'casestudy-ks',
  caseTT:   'casestudy-tt',
  test1:    'testimonial-001',
  test2:    'testimonial-002',
  test3:    'testimonial-003',
  test4:    'testimonial-004',
  test5:    'testimonial-005',
  blog1:    'blog-001',
  blog2:    'blog-002',
  blog3:    'blog-003',
  blog4:    'blog-004',
  blog5:    'blog-005',
  pageHome:     'page-home',
  pageAbout:    'page-about',
  pageServices: 'page-services',
  pageWork:     'page-work',
  pageContact:  'page-contact',
  pageDemo:     'page-sections-demo',
}

const docs = []

// ─────────────────────────────────────────────────────────────────────────────
// SITE SETTINGS
// ─────────────────────────────────────────────────────────────────────────────

docs.push({
  _id: ID.settings,
  _type: 'siteSettings',
  header: {
    title: 'Dotani',
    logoAlt: 'Dotani — Digital Strategy & Creative Consulting',
    menuItems: [
      { _key: key(), label: 'Home',     url: '/'         },
      { _key: key(), label: 'Services', url: '/services' },
      { _key: key(), label: 'Work',     url: '/work'     },
      { _key: key(), label: 'About',    url: '/about'    },
      { _key: key(), label: 'Blog',     url: '/blog'     },
    ],
    headerCta: { label: "Let's Talk", url: '/contact' },
  },
  footer: {
    description:
      'Strategic digital consulting based in Pakistan. Building brands, voices, and presences that last.',
    col2Heading: 'Services',
    col3Heading: 'Quick Links',
    col4Heading: 'Get in Touch',
    socialLinks: [
      { _key: key(), platform: 'linkedin',  url: 'https://linkedin.com/in/razadotani'  },
      { _key: key(), platform: 'twitter',   url: 'https://twitter.com/razadotani'      },
      { _key: key(), platform: 'instagram', url: 'https://instagram.com/razadotani'    },
      { _key: key(), platform: 'youtube',   url: 'https://youtube.com/@razadotani'     },
      { _key: key(), platform: 'github',    url: 'https://github.com/thedotani'        },
    ],
    copyrightText: '© 2025 Dotani. All rights reserved.',
  },
  theme: {
    primaryColor:    '#3b82f6',
    secondaryColor:  '#64748b',
    accentColor:     '#f59e0b',
    containerWidth:  'max-w-7xl',
    darkModeDefault: false,
  },
})

// ─────────────────────────────────────────────────────────────────────────────
// SERVICES × 6
// ─────────────────────────────────────────────────────────────────────────────

docs.push({
  _id: ID.svcSMM,
  _type: 'service',
  title: 'Social Media Management',
  slug: slug('social-media-management'),
  icon: 'social-media',
  shortDescription: 'Full-cycle social media for brands that want presence with purpose, not just a posting schedule.',
  description: [
    block("Managing social media is not about posting on time. It's about knowing what to say, when, and why your audience should care. This service handles everything from content strategy to community management."),
    block("Whether you've been posting randomly for years or you're a new brand figuring out where to start, the process begins with your audience and works backward to content."),
  ],
  features: [
    { _key: key(), text: 'Monthly content calendar with platform-specific planning' },
    { _key: key(), text: 'Content creation — copy, creative direction, graphics brief' },
    { _key: key(), text: 'Community management and comment responses' },
    { _key: key(), text: 'Paid social oversight and performance monitoring' },
    { _key: key(), text: 'Monthly analytics report with actionable insights' },
  ],
  bestFor: 'Brands, SMEs, public figures, NGOs, and startups that need a consistent social presence without hiring in-house.',
  deliverables: [
    'Monthly content plan',
    '20–25 posts per month',
    'Platform analytics report',
    'Community response management',
    'Quarterly strategy review',
  ],
  timeframe: 'Ongoing retainer — minimum 3-month commitment',
  order: 1,
})

docs.push({
  _id: ID.svcPB,
  _type: 'service',
  title: 'Personal Branding',
  slug: slug('personal-branding'),
  icon: 'personal-brand',
  shortDescription: 'Build a professional identity that works before you walk into the room.',
  description: [
    block("Your personal brand is not your job title. It's what people think when they think about you professionally — and if you're not shaping that narrative, someone else is."),
    block("It starts with positioning: who you are, what you stand for, and who needs to know. From there, we build the visible markers — your LinkedIn, your bio, your content voice."),
  ],
  features: [
    { _key: key(), text: 'Brand positioning and messaging framework' },
    { _key: key(), text: 'LinkedIn profile complete overhaul' },
    { _key: key(), text: 'Professional bio in three lengths — short, medium, full' },
    { _key: key(), text: 'Content voice and tone guide' },
    { _key: key(), text: 'Starter content plan for first 60 days' },
  ],
  bestFor: 'Executives, entrepreneurs, academics, freelancers, and professionals looking to change roles, sectors, or visibility.',
  deliverables: [
    'Brand positioning document',
    'Full LinkedIn rebuild',
    'Bio pack in three lengths',
    'Content voice guide',
    '60-day content starter plan',
  ],
  timeframe: '2–4 weeks intensive, or 6–8 weeks paced',
  order: 2,
})

docs.push({
  _id: ID.svcCS,
  _type: 'service',
  title: 'Content Strategy',
  slug: slug('content-strategy'),
  icon: 'content-strategy',
  shortDescription: 'An editorial strategy that turns your brand voice into consistent, credible output.',
  description: [
    block("Content without strategy is noise. This service builds the framework your team needs to produce content that's consistent, on-brand, and actually useful to your audience."),
    block("The process starts with understanding who you're talking to, what they already believe, and what you want them to do. From there, we build something your team can sustain."),
  ],
  features: [
    { _key: key(), text: 'Audience research and persona development' },
    { _key: key(), text: 'Content pillar framework — 3 to 5 core themes' },
    { _key: key(), text: 'Platform mapping and channel strategy' },
    { _key: key(), text: 'Editorial calendar — 3 months' },
    { _key: key(), text: 'Brand voice and tone guidelines' },
    { _key: key(), text: 'Content workflow and publishing cadence design' },
  ],
  bestFor: 'Startups, media brands, NGOs, and businesses that produce content but lack a clear strategic framework.',
  deliverables: [
    'Content strategy document',
    'Audience personas × 2–3',
    'Content pillar framework',
    '3-month editorial calendar',
    'Brand voice guide',
    'Platform guidelines sheet',
  ],
  timeframe: '3–6 weeks',
  order: 3,
})

docs.push({
  _id: ID.svcWD,
  _type: 'service',
  title: 'Web Design & Digital Presence',
  slug: slug('web-design-digital-presence'),
  icon: 'web-design',
  shortDescription: 'Websites and digital identities designed to work, not just look good.',
  description: [
    block("A website nobody finds, or one people leave in five seconds, is worse than no website at all. This service covers the full process — from design through to a live, fast, mobile-first site."),
    block("The focus is always function first: what does this website need to do, and for whom? Design decisions follow that logic, not the other way around."),
  ],
  features: [
    { _key: key(), text: 'UX wireframing and information architecture' },
    { _key: key(), text: 'UI design with brand alignment' },
    { _key: key(), text: 'CMS-based build — Sanity, Webflow, or WordPress' },
    { _key: key(), text: 'Mobile-first responsive build' },
    { _key: key(), text: 'Page speed optimisation' },
    { _key: key(), text: 'SEO fundamentals — meta, structure, schema' },
  ],
  bestFor: 'Businesses without a proper web presence, brands due for a redesign, and professionals wanting a portfolio or agency site.',
  deliverables: [
    'UX wireframe',
    'UI design — desktop and mobile',
    'Fully built and deployed website',
    'CMS training session',
    '30 days post-launch support',
  ],
  timeframe: '4–8 weeks depending on scope and page count',
  order: 4,
})

docs.push({
  _id: ID.svcDC,
  _type: 'service',
  title: 'Digital Campaigns',
  slug: slug('digital-campaigns'),
  icon: 'campaign',
  shortDescription: 'Purpose-driven campaigns that create noise and leave a mark.',
  description: [
    block("A campaign is not a boosted post. It's a coordinated effort with a narrative, a timeline, a target, and a reason people should pay attention."),
    block("The work starts with what you're trying to change — an opinion, a behaviour, an awareness level — and builds backward to the content, channels, and timing that make it happen."),
  ],
  features: [
    { _key: key(), text: 'Campaign concept and narrative development' },
    { _key: key(), text: 'Cross-platform content rollout strategy' },
    { _key: key(), text: 'Influencer and community partner coordination' },
    { _key: key(), text: 'Real-time monitoring and response management' },
    { _key: key(), text: 'Impact tracking and post-campaign report' },
  ],
  bestFor: 'NGOs, advocacy organisations, brands with product or event launches, and social cause campaigns.',
  deliverables: [
    'Campaign brief and narrative',
    'Content asset library',
    'Platform rollout plan and schedule',
    'Influencer and partner coordination',
    'Post-campaign impact report',
  ],
  timeframe: '4–12 weeks — concept through execution',
  order: 5,
})

docs.push({
  _id: ID.svcTW,
  _type: 'service',
  title: 'Training & Workshops',
  slug: slug('training-workshops'),
  icon: 'training',
  shortDescription: 'Hands-on sessions for teams that want to own their digital presence internally.',
  description: [
    block("Not every organisation needs to outsource digital. Some need the skills in-house. This service delivers practical, no-fluff workshops for corporate teams, NGO staff, and communications professionals."),
    block("Sessions are designed around what participants will actually do — not generic theory. Every workshop ends with something the group can implement immediately."),
  ],
  features: [
    { _key: key(), text: 'Social media management — beginner to advanced' },
    { _key: key(), text: 'Personal branding for professional teams' },
    { _key: key(), text: 'Content creation for non-creatives' },
    { _key: key(), text: 'Analytics interpretation and reporting' },
    { _key: key(), text: 'Digital communications for NGOs and advocacy organisations' },
  ],
  bestFor: 'Corporate comms teams, NGO staff, journalism programmes, professional associations, and leadership cohorts.',
  deliverables: [
    'Workshop slides and materials',
    'Resource and tool pack',
    'Session recording — if opted',
    'Follow-up Q&A access for 30 days',
  ],
  timeframe: 'Half-day (3–4 hours) or full-day (6–7 hours)',
  order: 6,
})

// ─────────────────────────────────────────────────────────────────────────────
// PORTFOLIO × 5
// ─────────────────────────────────────────────────────────────────────────────

docs.push({
  _id: ID.portZLC,
  _type: 'portfolio',
  title: 'Zara Leather Co. — Instagram Transformation',
  slug: slug('zara-leather-co-instagram'),
  category: 'social',
  shortResult: 'Tripled engagement in 90 days and built a consistent brand voice from scratch.',
  role: 'Social Media Strategist',
  client: 'Zara Leather Co.',
  year: 2023,
  industry: 'Fashion & Retail',
  tags: ['social media', 'Instagram', 'fashion', 'Pakistan', 'content calendar', 'Reels'],
  description: [
    block("Zara Leather Co. had been posting on Instagram for two years with no strategy, no consistency, and no result. The brief was straightforward: fix it."),
    block("Three months later, they had a voice, a community, and metrics that actually said something."),
  ],
  projectSummary: [
    block("A 90-day Instagram overhaul for a Lahore-based leather goods brand — from random posting to a story-driven presence that tripled engagement and added 12,000 followers organically."),
  ],
  keyPoints: [
    'Rebuilt content strategy upward from audience research',
    'Introduced Reels as primary reach driver — zero before this project',
    'Launched micro-influencer seeding across Lahore and Karachi',
    'Reduced ad spend by 60% while holding equivalent reach',
    'Built a repeatable content calendar for the in-house team',
  ],
  metrics: [
    { _key: key(), label: 'Engagement rate',        value: '3× increase in 90 days'         },
    { _key: key(), label: 'Followers gained',        value: '+12,000 organic'                 },
    { _key: key(), label: 'Ad spend reduction',      value: '60% lower for same reach'        },
    { _key: key(), label: 'Reels average reach',     value: '40,000+ per post'                },
  ],
  relatedServices: [aref(ID.svcSMM)],
  order: 1,
})

docs.push({
  _id: ID.portSH,
  _type: 'portfolio',
  title: 'Saira Hamid — Executive Personal Brand',
  slug: slug('saira-hamid-personal-brand'),
  category: 'branding',
  shortResult: 'From invisible on LinkedIn to a recognised sector voice in four months.',
  role: 'Personal Branding Consultant',
  client: 'Saira Hamid',
  year: 2024,
  industry: 'Finance & Professional Services',
  tags: ['personal branding', 'LinkedIn', 'executive', 'finance', 'Karachi'],
  description: [
    block("Saira was a finance director with 15 years of experience and almost zero digital visibility. She was getting passed over for opportunities that went to people with less experience but more presence online."),
    block("Four months later, she had speaking invitations, media mentions, and a LinkedIn that reflected who she actually is."),
  ],
  projectSummary: [
    block("A personal brand build for a senior finance executive in Karachi — repositioning her as a visible, credible voice in Pakistan's financial sector through LinkedIn and strategic content."),
  ],
  keyPoints: [
    'Full positioning strategy and messaging framework',
    'LinkedIn complete rebuild — banner, headline, about, experience',
    'Bio pack in three lengths',
    'Content voice guide — enabling independent writing',
    'First 60-day content plan with topic bank of 40 ideas',
  ],
  metrics: [
    { _key: key(), label: 'LinkedIn profile views', value: '+800% in 60 days'   },
    { _key: key(), label: 'Speaking invitations',   value: '3 within 4 months'  },
    { _key: key(), label: 'Finance publications',   value: 'Quoted in 2'         },
    { _key: key(), label: 'LinkedIn followers',     value: '0 to 2,400'          },
  ],
  relatedServices: [aref(ID.svcPB)],
  order: 2,
})

docs.push({
  _id: ID.portAM,
  _type: 'portfolio',
  title: 'Aurat March 2023 — Digital Campaign',
  slug: slug('aurat-march-2023-digital-campaign'),
  category: 'campaigns',
  shortResult: '2.4 million organic reach in 10 days. Number one trending in Pakistan for six hours.',
  role: 'Digital Campaign Lead',
  client: 'Aurat March — Lahore',
  year: 2023,
  industry: 'Activism & Social Cause',
  tags: ['activism', 'campaign', 'Pakistan', 'Twitter', 'March 8'],
  description: [
    block("Aurat March needed a digital campaign that could cut through noise, counter a disinformation effort, and mobilise participation across multiple cities — simultaneously, in 10 days."),
  ],
  projectSummary: [
    block("A 10-day digital campaign for Aurat March 2023 Lahore — built to cut through disinformation, activate communities, and generate organic reach that no ad budget could have bought."),
  ],
  keyPoints: [
    'Two-layer hashtag strategy designed against hijacking risk',
    'Twitter Spaces coordination across three cities',
    'Counter-disinformation response framework deployed in real time',
    'Cross-city amplification network with 40+ volunteer accounts',
    '340 media mentions tracked across the campaign window',
  ],
  metrics: [
    { _key: key(), label: 'Total organic reach',           value: '2.4M impressions'         },
    { _key: key(), label: 'Trending position',             value: '#1 in Pakistan for 6 hrs' },
    { _key: key(), label: 'Media mentions',                value: '340+'                      },
    { _key: key(), label: 'Spaces listeners — combined',   value: '18,000'                   },
  ],
  relatedServices: [aref(ID.svcDC)],
  order: 3,
})

docs.push({
  _id: ID.portKS,
  _type: 'portfolio',
  title: 'Khaas Stories — Content Strategy',
  slug: slug('khaas-stories-content-strategy'),
  category: 'content',
  shortResult: 'From posting randomly to a four-month editorial calendar and 40% readership growth.',
  role: 'Content Strategist',
  client: 'Khaas Stories',
  year: 2024,
  industry: 'Media & Digital Publishing',
  tags: ['content strategy', 'media', 'editorial', 'Urdu', 'Pakistan', 'newsletter'],
  description: [
    block("Khaas Stories publishes Urdu-language digital content from smaller cities and overlooked communities across Pakistan. The editorial vision was sharp. The publishing operation was not."),
  ],
  projectSummary: [
    block("Content strategy for a Urdu-language digital media platform — moving from ad hoc publishing to a sustainable, audience-first editorial operation with measurable readership growth."),
  ],
  keyPoints: [
    'Audience research covering three distinct reader personas',
    'Five content pillars defined and mapped to platform sections',
    'Four-month editorial calendar built in full',
    'Urdu-specific tone-of-voice guide for multiple contributors',
    'Newsletter strategy designed and templated',
  ],
  metrics: [
    { _key: key(), label: 'Readership growth',          value: '+40% in 3 months'     },
    { _key: key(), label: 'Newsletter open rate',        value: '2× improvement'       },
    { _key: key(), label: 'Publishing cadence',          value: '3× per week, sustained' },
    { _key: key(), label: 'Average time on page',        value: '+65%'                 },
  ],
  relatedServices: [aref(ID.svcCS)],
  order: 4,
})

docs.push({
  _id: ID.portTT,
  _type: 'portfolio',
  title: 'Tariq Travels — Full Digital Presence',
  slug: slug('tariq-travels-digital-presence'),
  category: 'strategy',
  shortResult: '30% of new bookings came from digital channels within two months of launch.',
  role: 'Digital Strategist & Web Designer',
  client: 'Tariq Travels',
  year: 2024,
  industry: 'Travel & Hospitality',
  tags: ['web design', 'travel', 'Pakistan', 'Astro', 'Sanity', 'Google Business'],
  description: [
    block("Tariq Travels had been running for 22 years on referrals and walk-ins. No website. A Facebook page last updated in 2021. They were losing younger customers to competitors easier to find online."),
    block("Eight weeks. Full website, social setup, Google Business optimisation, WhatsApp automation, and a CMS simple enough for a non-technical team."),
  ],
  projectSummary: [
    block("Full digital presence build for a 22-year-old Karachi travel agency — new website, social accounts, Google Business optimisation, and inquiry automation that brought 30% of new bookings from digital within two months."),
  ],
  keyPoints: [
    'Website on Astro + Sanity + Cloudflare Pages — under 2 seconds on mobile',
    'Google Business profile created, verified, and optimised in week one',
    'WhatsApp Business automation for inquiry capture',
    'Instagram and Facebook with first 30 days of content',
    'Team trained on CMS in a half-day session',
  ],
  metrics: [
    { _key: key(), label: 'New bookings from digital',  value: '30% within 2 months'     },
    { _key: key(), label: 'Google Business rating',     value: '4.8 stars — up from 3.1' },
    { _key: key(), label: 'Website load time — mobile', value: 'Under 2 seconds'          },
    { _key: key(), label: 'WhatsApp inquiries/week',    value: '40+ from month one'       },
  ],
  relatedServices: [aref(ID.svcWD), aref(ID.svcSMM)],
  order: 5,
})

// ─────────────────────────────────────────────────────────────────────────────
// CASE STUDIES × 5
// ─────────────────────────────────────────────────────────────────────────────

docs.push({
  _id: ID.caseZLC,
  _type: 'caseStudy',
  title: 'How a Lahore Fashion Brand Found Its Voice on Instagram',
  slug: slug('zara-leather-co-case-study'),
  client: 'Zara Leather Co.',
  industry: 'Fashion & Retail',
  year: 2023,
  role: 'Social Media Strategist',
  scope: 'Full Instagram strategy and management — 90 days',
  duration: '3 months',
  tools: ['Meta Business Suite', 'Canva', 'Notion', 'Later'],
  summary: [
    block("Zara Leather Co. is a Lahore-based leather goods brand with strong products and a struggling Instagram. Two years of inconsistent posting had produced followers but no engagement, no community, and no identity beyond product photography."),
    block("This case study documents the 90-day process of rebuilding their social media from the ground up."),
  ],
  challenge: [
    block("The account was posting four to five times a week with no calendar, no visual consistency, and no engagement strategy. Every post was a product shot with a price."),
    block("The brand had no defined target audience. They were posting for everyone, which meant reaching no one in particular."),
  ],
  approach: [
    block("The strategy started with audience research — not assumption. We surveyed existing customers, analysed competitor accounts, and mapped the demographics of people who bought leather goods at this price point."),
    block("Three segments emerged: professional women aged 28–40, gift buyers, and fashion-adjacent men interested in accessories. The same account had to serve all three without losing coherence."),
  ],
  process: [
    { _key: key(), number: 1, title: 'Audit',     description: 'Review of 18 months of content — engagement rates, top performers, audience demographics, posting patterns, ad spend efficiency.' },
    { _key: key(), number: 2, title: 'Research',  description: 'Customer surveys, competitor analysis, and audience segmentation across three buyer personas.' },
    { _key: key(), number: 3, title: 'Strategy',  description: 'Content pillar framework, visual identity guidelines, Reels introduction plan, micro-influencer seeding strategy.' },
    { _key: key(), number: 4, title: 'Execution', description: '90 days of content — planned, created, scheduled, and monitored. Weekly performance reviews with real-time adjustments.' },
    { _key: key(), number: 5, title: 'Handoff',   description: 'Content calendar template, visual guideline document, and team training session for sustainable in-house continuation.' },
  ],
  outputs: [
    '90-day content calendar',
    'Visual identity guidelines document',
    'Reels production workflow',
    'Influencer seeding list — 22 accounts',
    'Monthly analytics report template',
  ],
  results: [
    { _key: key(), label: 'Engagement rate',         value: '3× increase in 90 days'         },
    { _key: key(), label: 'Organic followers gained', value: '+12,000'                         },
    { _key: key(), label: 'Ad spend reduction',       value: '60% lower for equivalent reach' },
    { _key: key(), label: 'Reels average reach',      value: '40,000+ per post'               },
    { _key: key(), label: 'Profile visits — month 3', value: '8,200 from Reels'               },
  ],
  impact: [
    block("By month three, Zara Leather Co. had a visually cohesive, audience-specific presence their team could sustain independently."),
    block("More importantly, the brand now had a voice — something customers could recognise and return to."),
  ],
  lessons: [
    block("Most brands do not have a posting problem. They have an audience clarity problem. Posting less, to a better-defined audience, almost always outperforms posting more to everyone."),
    block("Reels remain significantly underutilised by Pakistani fashion brands. The brands that commit early will own the algorithm advantage for the next 18 months."),
  ],
  relatedPortfolio: [aref(ID.portZLC)],
})

docs.push({
  _id: ID.caseSH,
  _type: 'caseStudy',
  title: 'Building a Personal Brand for a Finance Executive in 120 Days',
  slug: slug('saira-hamid-personal-brand-case-study'),
  client: 'Saira Hamid — name used with permission',
  industry: 'Finance & Professional Services',
  year: 2024,
  role: 'Personal Branding Consultant',
  scope: 'Full personal brand — positioning, LinkedIn, bio, content voice',
  duration: '4 months',
  tools: ['Notion', 'LinkedIn', 'Canva', 'Google Docs'],
  summary: [
    block("Saira was a finance director with 15 years of experience and almost no digital presence. She was being passed over for speaking invitations and nominations that went to people with less experience but more visibility."),
  ],
  challenge: [
    block("The core problem was not competence — it was discoverability. Her LinkedIn was a basic employment history. No content, no narrative, no bio in wider circulation."),
    block("She also had a constraint: she did not want to sound self-promotional or use the hollow thought-leadership language that had put her off LinkedIn for years. The brand had to feel like her, or she would not use it."),
  ],
  approach: [
    block("The starting point was positioning through conversation. Three extended sessions covering her career, opinions, what she finds interesting, and what she finds genuinely annoying about her industry."),
    block("Everything built from there. None of it was written for her to perform. It was written so she could speak — and have it sound like what she had been saying in rooms for fifteen years."),
  ],
  process: [
    { _key: key(), number: 1, title: 'Discovery',    description: 'Three deep-dive sessions covering career, opinions, expertise, and communication style.' },
    { _key: key(), number: 2, title: 'Positioning',  description: 'Brand statement, audience map, and core messaging. Two rounds of review and refinement.' },
    { _key: key(), number: 3, title: 'LinkedIn',     description: 'Custom banner, rewritten headline, full about section, all experience entries revised.' },
    { _key: key(), number: 4, title: 'Content Voice',description: 'Tone guide, topic bank of 40 ideas, and first 30 days of posts as models.' },
    { _key: key(), number: 5, title: 'Handoff',      description: 'Training on LinkedIn algorithm basics, content rhythm, and one-month check-in call.' },
  ],
  outputs: [
    'Brand positioning document',
    'Full LinkedIn rebuild',
    'Bio in three lengths',
    'Content voice and tone guide',
    'Topic bank — 40 ideas',
    'First 30-day content examples',
  ],
  results: [
    { _key: key(), label: 'LinkedIn profile views',   value: '+800% in 60 days'      },
    { _key: key(), label: 'Speaking invitations',      value: '3 within 4 months'     },
    { _key: key(), label: 'Finance publication quotes',value: '2 major outlets'       },
    { _key: key(), label: 'LinkedIn followers',        value: '0 to 2,400'            },
    { _key: key(), label: 'New connection requests',   value: 'Avg. 15/week'          },
  ],
  impact: [
    block("Saira received her first speaking invitation within six weeks of the LinkedIn going live. By month four she had been quoted in two finance publications."),
    block("She now writes her own content — two posts a week, consistently. That is the part that is hard to quantify."),
  ],
  lessons: [
    block("Personal branding for Pakistani professionals fails most often because the brief is 'make me look good online' rather than 'help me say what I already think, more visibly'."),
    block("LinkedIn in Pakistan is significantly underused by senior professionals in finance, law, and academia. The people who move first will disproportionately own the credibility gap."),
  ],
  relatedPortfolio: [aref(ID.portSH)],
})

docs.push({
  _id: ID.caseAM,
  _type: 'caseStudy',
  title: 'Aurat March 2023 Digital Campaign — What Worked and Why',
  slug: slug('aurat-march-2023-case-study'),
  client: 'Aurat March — Lahore',
  industry: 'Activism & Social Cause',
  year: 2023,
  role: 'Digital Campaign Lead',
  scope: 'Full campaign — strategy, content, Twitter, Instagram, community coordination',
  duration: '14 days total',
  tools: ['Twitter/X', 'Instagram', 'Canva', 'Notion', 'WhatsApp Broadcast'],
  summary: [
    block("Aurat March 2023 needed a digital campaign that could cut through a significant disinformation effort, build participation across multiple cities, and generate mainstream visibility — without paid reach."),
    block("Result: 2.4 million organic impressions in 10 days, six hours at number one trending on Pakistani Twitter, 340 media mentions."),
  ],
  challenge: [
    block("The campaign ran in a hostile information environment. Organised counter-campaigns had been active since February, using coordinated inauthentic behaviour to pre-emptively discredit Aurat March. Any hashtag strategy had to account for hijacking risk."),
    block("Participation also needed to feel accessible — not just activist-facing — to reach people who were sympathetic but not yet mobilised."),
  ],
  approach: [
    block("The hashtag architecture was built in two layers: a primary campaign hashtag specific enough to resist hijacking, and secondary hashtags tied to specific events and cities that could travel independently."),
    block("Twitter Spaces were used as a broadcast and conversation mechanism — not just for converted audiences but as an entry point for curious observers."),
  ],
  process: [
    { _key: key(), number: 1, title: 'Intelligence',   description: 'Analysis of counter-campaign patterns and hashtag vulnerability. Response framework designed in advance.' },
    { _key: key(), number: 2, title: 'Architecture',   description: 'Two-layer hashtag strategy designed. Content timeline mapped. Spaces schedule confirmed five days ahead.' },
    { _key: key(), number: 3, title: 'Network',        description: 'Coordination with 40+ volunteer amplifier accounts. Timing guidelines and content assets distributed.' },
    { _key: key(), number: 4, title: 'Production',     description: 'Graphics, video clips, quote cards, and real-time response content across the full 10-day window.' },
    { _key: key(), number: 5, title: 'Monitoring',     description: 'Real-time sentiment tracking, engagement monitoring, and rapid disinformation response. Daily adjustments.' },
  ],
  outputs: [
    'Campaign narrative and messaging guide',
    '200+ content assets across platforms',
    '6 Twitter Spaces episodes',
    'Disinformation response framework',
    'Post-campaign impact report',
  ],
  results: [
    { _key: key(), label: 'Total organic reach',         value: '2.4 million impressions'       },
    { _key: key(), label: 'Trending position',           value: '#1 in Pakistan for 6 hours'    },
    { _key: key(), label: 'Media mentions',              value: '340+'                           },
    { _key: key(), label: 'Spaces listeners — combined', value: '18,000'                        },
    { _key: key(), label: 'Volunteer amplifiers',        value: '40+ accounts coordinated'      },
  ],
  impact: [
    block("The campaign reached audiences Aurat March had not previously been able to engage — particularly men over 35 and people in smaller cities who encountered it through the trending tab."),
    block("No hashtag hijacking succeeded during the campaign window — largely due to the two-layer architecture and real-time monitoring."),
  ],
  lessons: [
    block("Disinformation is a logistics problem more than a messaging problem. Campaigns that build a response framework before launch are significantly more resilient than those that improvise under pressure."),
    block("Twitter Spaces remain the most underutilised tool in Pakistani digital activism. The format allows for nuance that text limits cannot — and real-time urgency that pre-planned content cannot replicate."),
  ],
  relatedPortfolio: [aref(ID.portAM)],
})

docs.push({
  _id: ID.caseKS,
  _type: 'caseStudy',
  title: 'From Zero to Editorial Calendar — Khaas Stories',
  slug: slug('khaas-stories-case-study'),
  client: 'Khaas Stories',
  industry: 'Media & Digital Publishing',
  year: 2024,
  role: 'Content Strategist',
  scope: 'Full content strategy — audience research, pillars, editorial calendar, voice guide',
  duration: '6 weeks',
  tools: ['Notion', 'Google Sheets', 'Airtable', 'Mailchimp'],
  summary: [
    block("Khaas Stories publishes Urdu-language stories from smaller cities and overlooked communities across Pakistan. The editorial vision was original. The publishing operation was not."),
    block("Six weeks produced a framework the team could sustain: audience personas, content pillars, a four-month calendar, and a tone guide that worked across multiple contributors."),
  ],
  challenge: [
    block("Publishing happened when content was ready — not when strategy required it. No content pillars. No editorial calendar. Different writers produced noticeably different voices. Reader retention was low."),
    block("The added complexity: Khaas Stories publishes in Urdu, which meant most available content strategy frameworks didn't map cleanly onto their editorial context or audience behaviour."),
  ],
  approach: [
    block("Audience research started with readers, not assumptions. Surveys and informal interviews with 60 existing readers produced detailed insight into what they were looking for and which stories they had shared."),
    block("The content pillar framework was built around reader need, not category convention. Five pillars emerged — each tied to a specific reader motivation."),
  ],
  process: [
    { _key: key(), number: 1, title: 'Audience Research', description: 'Reader surveys and interviews with 60 existing readers. Three detailed audience personas developed.' },
    { _key: key(), number: 2, title: 'Platform Audit',    description: 'Analysis of 8 months of published content — what performed, what did not, and why.' },
    { _key: key(), number: 3, title: 'Pillar Development',description: 'Five content pillars defined and tested against audience personas and team editorial interests.' },
    { _key: key(), number: 4, title: 'Calendar Build',    description: 'Four-month editorial calendar in Airtable — 3 stories per week, with pillar balance and special editions.' },
    { _key: key(), number: 5, title: 'Voice Guide',       description: 'Urdu-specific tone-of-voice guide for multiple contributors — sentence structure, formality, storytelling conventions.' },
    { _key: key(), number: 6, title: 'Newsletter',        description: 'Weekly newsletter structure and content formula defined. First 8 issues templated.' },
  ],
  outputs: [
    'Content strategy document — Urdu and English versions',
    'Three audience personas',
    'Five content pillars with editorial guidance',
    'Four-month editorial calendar',
    'Urdu tone-of-voice guide',
    'Newsletter structure and 8-issue template',
  ],
  results: [
    { _key: key(), label: 'Readership growth',      value: '+40% in 3 months'        },
    { _key: key(), label: 'Newsletter open rate',    value: '48% on relaunch — 2× up' },
    { _key: key(), label: 'Publishing cadence',      value: '3× per week, sustained'  },
    { _key: key(), label: 'Avg time on page',        value: '+65%'                    },
    { _key: key(), label: 'Story shares per post',   value: '3× increase'             },
  ],
  impact: [
    block("Three months after launch, Khaas Stories had a measurably more engaged readership and a team that could make editorial decisions without uncertainty."),
    block("The newsletter, dormant for six months, relaunched with the new structure and reached a 48% open rate in its first three issues."),
  ],
  lessons: [
    block("Content strategy for Urdu-language media in Pakistan requires a separate framework from English-language media. Importing a standard strategy without adaptation produces mediocre results."),
    block("The most valuable output was not the calendar. It was the content pillars. A good pillar framework makes every editorial decision faster and more confident."),
  ],
  relatedPortfolio: [aref(ID.portKS)],
})

docs.push({
  _id: ID.caseTT,
  _type: 'caseStudy',
  title: 'Taking a 22-Year-Old Travel Agency Online',
  slug: slug('tariq-travels-case-study'),
  client: 'Tariq Travels',
  industry: 'Travel & Hospitality',
  year: 2024,
  role: 'Digital Strategist & Web Designer',
  scope: 'Full digital presence — website, social, Google Business, inquiry automation',
  duration: '8 weeks',
  tools: ['Astro', 'Sanity', 'Cloudflare Pages', 'Canva', 'Meta Business Suite', 'Google Business'],
  summary: [
    block("Tariq Travels had been running for 22 years on referrals and walk-ins. They were good at what they did. They were losing younger customers to competitors who were easier to find online — and they knew it."),
  ],
  challenge: [
    block("No website. Facebook last updated in 2021. WhatsApp Business — a regular number. Google searches in their area returned competitors consistently."),
    block("The human challenge mattered more than the technical one: the team was non-technical, had no content creation experience, and was sceptical that a website would make any difference."),
  ],
  approach: [
    block("Speed-to-impact was the strategic priority. Google Business went live and fully optimised in week one — generating visible inquiries before the website design was even finalised."),
    block("The website was built to be simple enough for the team to update without help. Sanity CMS was configured with a minimal interface exposing only what they needed."),
  ],
  process: [
    { _key: key(), number: 1, title: 'Google Business',    description: 'Profile created, verified, and fully optimised in week one. Review generation strategy deployed immediately.' },
    { _key: key(), number: 2, title: 'WhatsApp Automation',description: 'Business account configured with automated greeting, away messages, and inquiry capture flow.' },
    { _key: key(), number: 3, title: 'Website Design',     description: 'UX wireframe and UI design — clean, mobile-first, fast. Four pages: home, packages, about, contact.' },
    { _key: key(), number: 4, title: 'Website Build',      description: 'Astro + Sanity + Cloudflare Pages. Load time under 2 seconds. Fully responsive.' },
    { _key: key(), number: 5, title: 'Social Setup',       description: 'Instagram and Facebook with consistent branding. First 30 days of content planned and scheduled.' },
    { _key: key(), number: 6, title: 'Team Training',      description: 'Half-day session for two team members — CMS, social media basics, Google Business management.' },
  ],
  outputs: [
    'Website — 4 pages, Astro + Sanity + Cloudflare',
    'Google Business profile — fully optimised',
    'WhatsApp Business automation setup',
    'Instagram and Facebook with 30-day content',
    'CMS training session',
    'Digital presence management guide',
  ],
  results: [
    { _key: key(), label: 'New bookings from digital',  value: '30% within 2 months'      },
    { _key: key(), label: 'Google Business rating',     value: '4.8 stars — up from 3.1'  },
    { _key: key(), label: 'Website load time — mobile', value: 'Under 2 seconds'           },
    { _key: key(), label: 'WhatsApp inquiries/week',    value: '40+ from month one'        },
    { _key: key(), label: 'Google search position',     value: 'Page 1 for local terms'    },
  ],
  impact: [
    block("Within the first month, Tariq Travels had more digital inquiries than in the previous three years combined."),
    block("The owner was asking about SEO content by the end of the project — which is as good an outcome as you can get from someone who opened the first meeting with 'I'm not sure about this whole website idea'."),
  ],
  lessons: [
    block("For traditional businesses going digital, the first visible result matters more than anything else. Getting Google Business live in week one gave the team something concrete to point to."),
    block("CMS complexity is a real risk for non-technical clients. A CMS a client actually uses is infinitely more valuable than one that is technically impressive but abandoned after a month."),
  ],
  relatedPortfolio: [aref(ID.portTT)],
})

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS × 5
// ─────────────────────────────────────────────────────────────────────────────

docs.push({
  _id: ID.test1,
  _type: 'testimonial',
  quote: "We had been posting on Instagram for two years with nothing to show for it. In three months, Raza completely changed how we think about social media — and the results were impossible to ignore. Our engagement tripled and we actually have a voice now.",
  authorName: 'Zainab Qureshi',
  authorRole: 'CEO, Zara Leather Co.',
  rating: 5,
  relatedService: ref(ID.svcSMM),
  relatedPortfolio: ref(ID.portZLC),
  order: 1,
})

docs.push({
  _id: ID.test2,
  _type: 'testimonial',
  quote: "I was sceptical about the whole personal branding thing — it sounded like vanity with extra steps. What Raza built for me did not feel like that at all. It felt like a professional articulation of what I had been doing for fifteen years. And it opened doors I did not know were available.",
  authorName: 'Saira Hamid',
  authorRole: 'Finance Director, Karachi',
  rating: 5,
  relatedService: ref(ID.svcPB),
  relatedPortfolio: ref(ID.portSH),
  order: 2,
})

docs.push({
  _id: ID.test3,
  _type: 'testimonial',
  quote: "The campaign ran in a genuinely hostile environment and it held together. The disinformation response framework was something we had never thought to build in advance — and it made all the difference when we needed it. 2.4 million people saw our message organically.",
  authorName: 'Campaign Coordinator',
  authorRole: 'Aurat March, Lahore',
  rating: 5,
  relatedService: ref(ID.svcDC),
  relatedPortfolio: ref(ID.portAM),
  order: 3,
})

docs.push({
  _id: ID.test4,
  _type: 'testimonial',
  quote: "We had the ideas. We just had no system. The content strategy Raza built gave our team a framework we could actually use — not a 60-page document nobody reads. Six months later we are still publishing on the calendar, still using the pillars, and still growing.",
  authorName: 'Nida Farrukh',
  authorRole: 'Founder, Khaas Stories',
  rating: 5,
  relatedService: ref(ID.svcCS),
  relatedPortfolio: ref(ID.portKS),
  order: 4,
})

docs.push({
  _id: ID.test5,
  _type: 'testimonial',
  quote: "I opened the first meeting by saying I did not think a website would make any difference for us. Within two months, 30% of our new bookings were coming from digital. I was wrong, and I am very glad I was.",
  authorName: 'Tariq Hussain',
  authorRole: 'Owner, Tariq Travels',
  rating: 5,
  relatedService: ref(ID.svcWD),
  relatedPortfolio: ref(ID.portTT),
  order: 5,
})

// ─────────────────────────────────────────────────────────────────────────────
// BLOG POSTS × 5
// ─────────────────────────────────────────────────────────────────────────────

docs.push({
  _id: ID.blog1,
  _type: 'blogPost',
  title: 'Pakistani Brands on Instagram Are Boring. Here Is Why.',
  slug: slug('pakistani-brands-instagram-boring'),
  excerpt: "Most Pakistani brands treat Instagram like a product catalogue with a logo. The brands that do it well understand something the others don't: nobody woke up this morning wanting to see your pricing slide.",
  author: 'Raza Dotani',
  publishedAt: '2024-02-15T10:00:00.000Z',
  tags: ['social media', 'Instagram', 'Pakistan', 'brands', 'content strategy'],
  content: [
    block("Scroll through the Instagram of almost any Pakistani fashion brand, restaurant, or service business and you will find the same thing: product photos, pricing graphics, discount announcements, and the occasional Eid post. Repeat, indefinitely."),
    block("The brands know it is not working. The engagement numbers tell them every month. But they keep doing it because they do not know what else to do."),
    block("Nobody woke up this morning wanting to see your current stock or your Karachi delivery charges. They went to Instagram because they wanted to feel something — entertained, informed, seen. A pricing slide does none of that."),
    block("The brands doing this well have understood something simple: Instagram is not a catalogue. It is a conversation. A leather bag photographed in Anarkali by a woman who actually wears it will always outperform the same bag photographed on a studio table — because one has a story and the other does not."),
    block("The brands that will own Instagram in Pakistan over the next three years are the ones that start treating their audience as people with interests rather than wallets with preferences."),
  ],
  seo: {
    title: 'Why Pakistani Brands Are Failing on Instagram | Dotani',
    description: "Most Pakistani brands treat Instagram like a product catalogue. Here is why that is not working — and what the brands doing it well understand instead.",
  },
})

docs.push({
  _id: ID.blog2,
  _type: 'blogPost',
  title: 'Personal Branding Is Not Vanity. It Is Survival.',
  slug: slug('personal-branding-not-vanity'),
  excerpt: "The professionals who dismiss personal branding as self-promotion are usually the ones getting passed over for opportunities that go to people who are less qualified but more visible.",
  author: 'Raza Dotani',
  publishedAt: '2024-03-01T10:00:00.000Z',
  tags: ['personal branding', 'LinkedIn', 'Pakistan', 'professionals', 'career'],
  content: [
    block("There is a particular kind of Pakistani professional who is very good at their job and very resistant to the idea of putting themselves forward online. They find it uncomfortable. They believe that good work should speak for itself."),
    block("They are also regularly passed over for speaking invitations and nominations that go to people with less experience but more visibility. And they know it."),
    block("Personal branding is not about performing a version of yourself that is more impressive than the real one. Done well, it is about making the real one discoverable."),
    block("In Pakistan's professional landscape, this matters more than it does in markets with stronger institutional networks. The people who control their digital visibility are building a structural advantage that compounds over time."),
    block("The argument that 'I prefer to let my work speak' is only valid if your work is speaking to the people who need to hear it. Most of the time, it is not."),
  ],
  seo: {
    title: "Personal Branding in Pakistan — Why It Matters | Dotani",
    description: "The professionals who dismiss personal branding as vanity are getting passed over for opportunities they deserve. Here is the case for taking your visibility seriously.",
  },
})

docs.push({
  _id: ID.blog3,
  _type: 'blogPost',
  title: 'What Digital Activism Actually Takes',
  slug: slug('what-digital-activism-actually-takes'),
  excerpt: "A hashtag that trends for six hours and disappears does not change anything. Real digital activism requires preparation, infrastructure, and a theory of change — not just content.",
  author: 'Raza Dotani',
  publishedAt: '2024-03-22T10:00:00.000Z',
  tags: ['digital activism', 'Pakistan', 'campaigns', 'social media', 'civil society'],
  content: [
    block("There is a version of digital activism that is mostly aesthetic. The right hashtag, the right graphics, a trending moment that screenshots well and disappears in six hours."),
    block("Real digital activism requires something closer to what a political campaign or media operation requires. Preparation, infrastructure, and a clear theory of change that connects online activity to offline consequence."),
    block("The most common mistake in Pakistani digital activism is treating virality as a goal rather than a mechanism. A trending hashtag is only valuable if it reaches an audience that was not already convinced."),
    block("Disinformation is the other thing campaigns consistently underestimate. The organisations that navigate this most successfully are the ones that build response frameworks in advance."),
    block("Digital activism in Pakistan has produced genuinely important moments. It has also produced a lot of noise that exhausted its participants and changed nothing. The difference, most of the time, is the infrastructure behind the campaign."),
  ],
  seo: {
    title: "What Digital Activism Actually Takes | Dotani",
    description: "A trending hashtag that disappears in six hours changes nothing. Real digital activism requires infrastructure and a theory of change.",
  },
})

docs.push({
  _id: ID.blog4,
  _type: 'blogPost',
  title: 'The Content Strategy Mistake Almost Every Startup Makes',
  slug: slug('content-strategy-mistake-startups'),
  excerpt: "Most startups treat content strategy as a posting schedule. A posting schedule tells you when. A content strategy tells you why — and that is the part that actually matters.",
  author: 'Raza Dotani',
  publishedAt: '2024-04-10T10:00:00.000Z',
  tags: ['content strategy', 'startups', 'Pakistan', 'marketing', 'brand'],
  content: [
    block("The most common content strategy mistake is treating it as a calendar problem. Teams spend time figuring out how many times to post per week, which day gets the most engagement, what tool to use for scheduling. None of this is strategy. It is logistics."),
    block("A content strategy starts with your audience — specifically, with what your audience already believes and what you want them to believe or do differently after encountering your content."),
    block("The second mistake is producing content for your industry instead of your audience. A fintech startup that posts about fintech innovation is talking to fintech people. Their customers probably care about whether their business survives the next three months."),
    block("The third mistake is measuring the wrong things. Likes and follower counts are easy to track and almost useless as strategic indicators. The metrics that matter are harder to measure, which is why most brands avoid them."),
    block("The brands that build real content traction pick a specific audience, understand that audience in detail, and produce content that is genuinely useful to them on a consistent schedule. It is slow, unglamorous, and it works every time."),
  ],
  seo: {
    title: "The Biggest Content Strategy Mistake Startups Make | Dotani",
    description: "Most startups confuse a posting schedule with a content strategy. Here is the actual mistake — and what real content strategy looks like.",
  },
})

docs.push({
  _id: ID.blog5,
  _type: 'blogPost',
  title: 'Social Media in Pakistan: Where We Are and Where This Goes',
  slug: slug('social-media-pakistan-landscape-2024'),
  excerpt: "Pakistani audiences are more sophisticated than most brands give them credit for. The brands and voices that understand this first will have a significant advantage in the next five years.",
  author: 'Raza Dotani',
  publishedAt: '2024-05-05T10:00:00.000Z',
  tags: ['social media', 'Pakistan', 'digital marketing', 'trends', 'brands'],
  content: [
    block("Pakistan has one of the youngest and fastest-growing social media user bases in the world. It is also a market where most brands are operating as if it were 2018."),
    block("The gap between what Pakistani audiences are ready for and what Pakistani brands are producing is wide enough to be a genuine commercial opportunity for anyone paying attention."),
    block("Short-form video is not a trend — it is the dominant format, and it will be for the foreseeable future. This is not a production budget question. Some of the best-performing content on Pakistani Instagram is produced on a phone by someone who understands their audience."),
    block("The second shift is the rise of niche communities over mass audiences. The Pakistani internet is fragmenting the same way Western markets did five years ago."),
    block("Pakistani audiences have also become significantly more sceptical of branded content. They are better at identifying paid partnerships and more likely to engage with content that feels honest than content that feels polished."),
  ],
  seo: {
    title: "Social Media in Pakistan — 2024 Landscape | Dotani",
    description: "Where Pakistani social media stands in 2024, what audiences are ready for, and why the brands that understand this now will be hard to displace.",
  },
})

// ─────────────────────────────────────────────────────────────────────────────
// PAGES × 5
// Field names matched exactly to actual section schemas
// ─────────────────────────────────────────────────────────────────────────────

docs.push({
  _id: ID.pageHome,
  _type: 'page',
  title: 'Home',
  slug: slug('home'),
  excerpt: 'Digital strategist and creative consultant based in Pakistan — helping brands and professionals find their voice online.',
  customColors: false,
  sections: [
    {
      _type: 'heroSection',
      _key: key(),
      ...common({ sectionId: 'hero', paddingTop: 'py-24', paddingBottom: 'py-24', backgroundColor: '#0f172a' }),
      eyebrow: 'Digital Strategy & Creative Consulting',
      heading: 'I help brands find their voice online.',
      tagline: 'Strategy. Content. Presence.',
      description: [
        block("Whether you need a social media strategy, a personal brand, a content framework, or a digital campaign — I work with organisations and individuals who want to communicate better and reach further."),
      ],
      buttons: [
        btn('See My Work', '/work', 'primary'),
        btn("Let's Talk", '/contact', 'outline'),
      ],
      layout: 'contentLeft',
      verticalAlignment: 'items-center',
    },
    {
      _type: 'statsSection',
      _key: key(),
      ...common({ sectionId: 'stats', backgroundColor: '#1e293b', alignment: 'text-center items-center' }),
      items: [
        { _key: key(), number: '60+',  label: 'Projects Completed'                },
        { _key: key(), number: '8+',   label: 'Years in Digital'                   },
        { _key: key(), number: '30+',  label: 'Clients Across Pakistan'            },
        { _key: key(), number: '2.4M', label: 'Organic Reach — Single Campaign'   },
      ],
      layout: 'inline',
      divider: false,
    },
    {
      _type: 'servicesSection',
      _key: key(),
      ...common({ sectionId: 'services', paddingTop: 'py-24', paddingBottom: 'py-24' }),
      sectionTitle: 'What I Do',
      sectionTagline: 'A focused set of services for brands and professionals who want digital work that actually does something.',
      displayMode: 'auto',
      cardLayout: 'cards-3',
    },
    {
      _type: 'portfolioSection',
      _key: key(),
      ...common({ sectionId: 'work', paddingTop: 'py-24', paddingBottom: 'py-24' }),
      sectionTitle: 'Selected Work',
      sectionTagline: 'A few projects worth looking at.',
      displayMode: 'auto',
      cardLayout: 'cards-3',
      limit: 3,
    },
    {
      _type: 'testimonialsSection',
      _key: key(),
      ...common({ sectionId: 'testimonials', paddingTop: 'py-24', paddingBottom: 'py-24', backgroundColor: '#0f172a', alignment: 'text-center items-center' }),
      sectionTitle: 'What Clients Say',
      sectionTagline: 'From the people who have been through it.',
      displayMode: 'auto',
      cardStyle: 'standard',
      limit: 3,
    },
    {
      _type: 'finalCtaSection',
      _key: key(),
      ...common({ sectionId: 'cta', paddingTop: 'py-24', paddingBottom: 'py-24', backgroundType: 'gradient', alignment: 'text-center items-center',
        backgroundGradient: { from: '#3b82f6', to: '#1e293b', direction: 'bg-gradient-to-r' } }),
      headline: "Got a project in mind? Let's talk.",
      supportingText: "Whether you have a brief ready or just an idea, I'm happy to have a conversation about what you're trying to build.",
      buttons: [btn('Start a Conversation', '/contact', 'primary')],
      layout: 'centered',
      centeredBackground: true,
    },
  ],
  seo: {
    title: 'Dotani — Digital Strategy & Creative Consulting',
    description: 'Digital strategist and creative consultant based in Pakistan. Social media management, personal branding, content strategy, web design, and digital campaigns.',
  },
})

docs.push({
  _id: ID.pageAbout,
  _type: 'page',
  title: 'About',
  slug: slug('about'),
  excerpt: "I'm Raza Dotani — a Pakistani digital media professional, strategist, and independent consultant.",
  customColors: false,
  sections: [
    {
      _type: 'heroSection',
      _key: key(),
      ...common({ sectionId: 'about-hero', paddingTop: 'py-24', paddingBottom: 'py-16', backgroundColor: '#0f172a' }),
      eyebrow: 'About',
      heading: 'I have been building digital things in Pakistan for over eight years.',
      tagline: 'Strategist. Writer. Digital Activist.',
      description: [
        block("My work sits at the intersection of content, brand, and technology — helping organisations and individuals communicate more clearly, reach further, and show up consistently online."),
      ],
      layout: 'contentLeft',
      verticalAlignment: 'items-center',
    },
    {
      _type: 'whyMeSection',
      _key: key(),
      ...common({ sectionId: 'why-me', paddingTop: 'py-24', paddingBottom: 'py-24' }),
      heading: 'Why work with me',
      description: [
        block("I do not produce work that looks good in a deck and falls apart in practice. My focus is always on what actually changes something — for the brand, the campaign, or the person."),
      ],
      features: [
        { _key: key(), title: 'Pakistan-first thinking',  description: 'Most digital frameworks are built for Western markets. I build for Pakistani audiences and cultural context from the ground up.' },
        { _key: key(), title: 'Strategy before execution', description: 'The brief is where most projects go wrong. I spend time getting the strategy right before anything is produced.' },
        { _key: key(), title: 'Honest without the jargon', description: 'No buzzwords, no inflated projections. Clear thinking and practical output.' },
        { _key: key(), title: 'Built to hand off',         description: "Everything I build is designed to be usable by the client after I leave — not to create dependency on me." },
      ],
      layout: 'contentLeft',
    },
    {
      _type: 'statsSection',
      _key: key(),
      ...common({ sectionId: 'about-stats', backgroundColor: '#1e293b', alignment: 'text-center items-center' }),
      items: [
        { _key: key(), number: '8+',  label: 'Years Working in Digital'                  },
        { _key: key(), number: '60+', label: 'Projects Completed'                        },
        { _key: key(), number: '30+', label: 'Clients Across Pakistan'                   },
        { _key: key(), number: '5',   label: 'Platforms Managed Simultaneously — Peak'  },
      ],
      layout: 'inline',
      divider: false,
    },
    {
      _type: 'finalCtaSection',
      _key: key(),
      ...common({ sectionId: 'about-cta', paddingTop: 'py-20', paddingBottom: 'py-20', backgroundColor: '#0f172a', alignment: 'text-center items-center' }),
      headline: 'Want to work together?',
      supportingText: "Send me a note about what you're working on. No forms, no call-booking flows — just an email.",
      buttons: [btn('Get in Touch', '/contact', 'primary')],
      layout: 'centered',
      centeredBackground: false,
    },
  ],
  seo: {
    title: 'About Raza Dotani — Digital Strategist & Consultant',
    description: 'Pakistani digital media professional with 8+ years in social media management, personal branding, content strategy, and digital campaigns.',
  },
})

docs.push({
  _id: ID.pageServices,
  _type: 'page',
  title: 'Services',
  slug: slug('services'),
  excerpt: 'A focused set of services for brands and professionals who want digital work that actually does something.',
  customColors: false,
  sections: [
    {
      _type: 'heroSection',
      _key: key(),
      ...common({ sectionId: 'services-hero', paddingTop: 'py-24', paddingBottom: 'py-16', backgroundColor: '#0f172a', alignment: 'text-center items-center' }),
      eyebrow: 'Services',
      heading: 'Digital work that actually does something.',
      tagline: 'No vanity metrics. No deliverables that exist to fill a deck.',
      description: [
        block("I work on a focused set of services — the ones I do well and can deliver with confidence. If you need something not listed here, ask anyway."),
      ],
      layout: 'centered',
      verticalAlignment: 'items-center',
    },
    {
      _type: 'servicesSection',
      _key: key(),
      ...common({ sectionId: 'services-list', paddingTop: 'py-24', paddingBottom: 'py-24' }),
      sectionTitle: 'What I Offer',
      sectionTagline: '',
      displayMode: 'auto',
      cardLayout: 'cards-3',
    },
    {
      _type: 'finalCtaSection',
      _key: key(),
      ...common({ sectionId: 'services-cta', paddingTop: 'py-20', paddingBottom: 'py-20', backgroundType: 'gradient', alignment: 'text-center items-center',
        backgroundGradient: { from: '#3b82f6', to: '#0f172a', direction: 'bg-gradient-to-r' } }),
      headline: "Not sure which service is right for you?",
      supportingText: "Send me a short note about what you're trying to do. I'll tell you honestly whether I can help, and how.",
      buttons: [btn('Start a Conversation', '/contact', 'primary')],
      layout: 'centered',
      centeredBackground: true,
    },
  ],
  seo: {
    title: 'Services — Dotani Digital Strategy & Consulting',
    description: 'Social media management, personal branding, content strategy, web design, digital campaigns, and training workshops.',
  },
})

docs.push({
  _id: ID.pageWork,
  _type: 'page',
  title: 'Work',
  slug: slug('work'),
  excerpt: 'Selected projects across social media, branding, content strategy, campaigns, and web design.',
  customColors: false,
  sections: [
    {
      _type: 'heroSection',
      _key: key(),
      ...common({ sectionId: 'work-hero', paddingTop: 'py-24', paddingBottom: 'py-16', backgroundColor: '#0f172a', alignment: 'text-center items-center' }),
      eyebrow: 'Selected Work',
      heading: 'Projects worth looking at.',
      tagline: "Each one different. Each one with results that can be named.",
      description: [
        block("A selection of client work across social media management, personal branding, content strategy, digital campaigns, and web design."),
      ],
      layout: 'centered',
      verticalAlignment: 'items-center',
    },
    {
      _type: 'portfolioSection',
      _key: key(),
      ...common({ sectionId: 'portfolio-grid', paddingTop: 'py-24', paddingBottom: 'py-24' }),
      sectionTitle: 'All Projects',
      sectionTagline: '',
      displayMode: 'auto',
      cardLayout: 'cards-3',
      limit: 6,
    },
    {
      _type: 'testimonialsSection',
      _key: key(),
      ...common({ sectionId: 'work-testimonials', paddingTop: 'py-24', paddingBottom: 'py-24', backgroundColor: '#0f172a', alignment: 'text-center items-center' }),
      sectionTitle: 'From the Clients',
      sectionTagline: '',
      displayMode: 'auto',
      cardStyle: 'quote',
      limit: 3,
    },
    {
      _type: 'finalCtaSection',
      _key: key(),
      ...common({ sectionId: 'work-cta', paddingTop: 'py-20', paddingBottom: 'py-20', backgroundType: 'gradient', alignment: 'text-center items-center',
        backgroundGradient: { from: '#3b82f6', to: '#1e293b', direction: 'bg-gradient-to-r' } }),
      headline: 'Want to be on this page?',
      supportingText: "If you have a project that needs this kind of thinking, let's talk.",
      buttons: [btn("Let's Talk", '/contact', 'primary')],
      layout: 'centered',
      centeredBackground: true,
    },
  ],
  seo: {
    title: 'Work — Dotani Digital Strategy',
    description: 'Selected client projects in social media management, personal branding, content strategy, digital campaigns, and web design by Raza Dotani.',
  },
})

docs.push({
  _id: ID.pageContact,
  _type: 'page',
  title: 'Contact',
  slug: slug('contact'),
  excerpt: "Send me a note about what you're working on. I respond to every message.",
  customColors: false,
  sections: [
    {
      _type: 'heroSection',
      _key: key(),
      ...common({ sectionId: 'contact-hero', paddingTop: 'py-24', paddingBottom: 'py-16', backgroundColor: '#0f172a' }),
      eyebrow: 'Get in Touch',
      heading: "Let's talk about what you're working on.",
      tagline: 'No forms. No auto-replies. Just a conversation.',
      description: [
        block("Tell me what you're trying to do — a project brief, a vague idea, a problem you haven't solved yet. I read everything and respond to everything that looks like it could go somewhere."),
      ],
      layout: 'centered',
      verticalAlignment: 'items-center',
    },
    {
      _type: 'contactSection',
      _key: key(),
      ...common({ sectionId: 'contact-form', paddingTop: 'py-24', paddingBottom: 'py-24' }),
      headline: 'Send a message',
      supportingText: "Tell me about the project, the problem, or the idea. I'll get back to you within 48 hours.",
      submitButtonText: 'Send Message',
      successMessage: "Got it. I'll be in touch within 48 hours.",
    },
    {
      _type: 'bookingSection',
      _key: key(),
      ...common({ sectionId: 'contact-booking', paddingTop: 'py-16', paddingBottom: 'py-24', backgroundColor: '#1e293b', alignment: 'text-center items-center' }),
      headline: 'Prefer a call?',
      supportingText: 'Book a 30-minute intro call directly in my calendar. No agenda required.',
      buttonLabel: 'Book a Call',
      layout: 'centered',
    },
  ],
  seo: {
    title: 'Contact — Dotani Digital Strategy',
    description: 'Get in touch with Raza Dotani about digital strategy, social media, branding, content, or web design projects.',
  },
})

// ─────────────────────────────────────────────────────────────────────────────
// SECTIONS DEMO PAGE
// One fully-populated instance of every section schema, in order
// ─────────────────────────────────────────────────────────────────────────────

docs.push({
  _id: ID.pageDemo,
  _type: 'page',
  title: 'Sections Demo',
  slug: slug('_sections-demo'),
  excerpt: 'Internal reference page showing one populated instance of every section type.',
  customColors: false,
  sections: [

    // ── 1. heroSection ────────────────────────────────────────────────────────
    {
      _type: 'heroSection',
      _key: key(),
      // Common fields
      sectionId: 'demo-hero',
      visible: true,
      paddingTop: 'py-24',
      paddingBottom: 'py-24',
      backgroundType: 'solid',
      backgroundColor: '#0f172a',
      backgroundImageOpacity: 100,
      alignment: 'text-left items-start',
      containerWidthOverride: 'max-w-7xl',
      // heroSection-specific
      eyebrow: 'Digital Strategy & Creative Consulting',
      heading: 'I help brands find their voice online.',
      tagline: 'Strategy. Content. Presence.',
      description: [
        block("Whether you need a social media strategy, a personal brand, a content framework, or a digital campaign — I work with organisations and individuals who want to communicate better and reach further."),
        block("Based in Pakistan. Working everywhere."),
      ],
      buttons: [
        btn('See My Work', '/work', 'primary'),
        btn("Let's Talk", '/contact', 'outline'),
      ],
      layout: 'contentLeft',
      verticalAlignment: 'items-center',
    },

    // ── 2. statsSection ───────────────────────────────────────────────────────
    {
      _type: 'statsSection',
      _key: key(),
      sectionId: 'demo-stats',
      visible: true,
      paddingTop: 'py-16',
      paddingBottom: 'py-16',
      backgroundType: 'solid',
      backgroundColor: '#1e293b',
      backgroundImageOpacity: 100,
      alignment: 'text-center items-center',
      containerWidthOverride: 'max-w-7xl',
      // statsSection-specific
      items: [
        { _key: key(), number: '60+',  label: 'Projects Completed',                 note: 'Across 6 service areas'         },
        { _key: key(), number: '8+',   label: 'Years in Digital',                   note: 'Since 2016'                     },
        { _key: key(), number: '30+',  label: 'Clients Across Pakistan',             note: 'From Karachi to Islamabad'      },
        { _key: key(), number: '2.4M', label: 'Organic Reach — Single Campaign',    note: 'Aurat March 2023'               },
      ],
      layout: 'inline',
      divider: true,
    },

    // ── 3. servicesSection ────────────────────────────────────────────────────
    {
      _type: 'servicesSection',
      _key: key(),
      sectionId: 'demo-services',
      visible: true,
      paddingTop: 'py-24',
      paddingBottom: 'py-24',
      backgroundType: 'solid',
      backgroundColor: '',
      backgroundImageOpacity: 100,
      alignment: 'text-left items-start',
      containerWidthOverride: 'max-w-7xl',
      // servicesSection-specific
      sectionTitle: 'What I Do',
      sectionTagline: 'A focused set of services for brands and professionals who want digital work that actually does something.',
      headerButton: { label: 'All Services', url: '/services' },
      displayMode: 'auto',
      cardLayout: 'cards-3',
      // manualServices is empty when displayMode is 'auto'
      manualServices: [],
    },

    // ── 4. portfolioSection ───────────────────────────────────────────────────
    {
      _type: 'portfolioSection',
      _key: key(),
      sectionId: 'demo-portfolio',
      visible: true,
      paddingTop: 'py-24',
      paddingBottom: 'py-24',
      backgroundType: 'solid',
      backgroundColor: '#f8fafc',
      backgroundImageOpacity: 100,
      alignment: 'text-left items-start',
      containerWidthOverride: 'max-w-7xl',
      // portfolioSection-specific
      sectionTitle: 'Selected Work',
      sectionTagline: 'A few projects worth looking at.',
      ctaButton: { label: 'See All Work', url: '/work' },
      displayMode: 'auto',
      cardLayout: 'cards-3',
      limit: 6,
    },

    // ── 5. whyMeSection ───────────────────────────────────────────────────────
    {
      _type: 'whyMeSection',
      _key: key(),
      sectionId: 'demo-why-me',
      visible: true,
      paddingTop: 'py-24',
      paddingBottom: 'py-24',
      backgroundType: 'solid',
      backgroundColor: '',
      backgroundImageOpacity: 100,
      alignment: 'text-left items-start',
      containerWidthOverride: 'max-w-7xl',
      // whyMeSection-specific
      heading: 'Why work with me',
      description: [
        block("I do not produce work that looks good in a deck and falls apart in practice. My focus is always on what actually changes something — for the brand, the campaign, or the person."),
        block("Eight years of working in Pakistani digital media means I understand the cultural context, the platforms, and the audiences in a way that most generic consultants do not."),
      ],
      features: [
        { _key: key(), title: 'Pakistan-first thinking',   description: 'Most frameworks are built for Western markets. I build for Pakistani audiences from the ground up.' },
        { _key: key(), title: 'Strategy before execution', description: 'The brief is where most projects go wrong. I spend time getting it right before anything is produced.' },
        { _key: key(), title: 'Honest without the jargon', description: 'No buzzwords, no inflated projections, no deliverables that exist to fill a deck.' },
        { _key: key(), title: 'Built to hand off',         description: "Everything I build is designed to be usable by the client after I leave — not to create dependency on me." },
      ],
      layout: 'contentLeft',
    },

    // ── 6. testimonialsSection ────────────────────────────────────────────────
    {
      _type: 'testimonialsSection',
      _key: key(),
      sectionId: 'demo-testimonials',
      visible: true,
      paddingTop: 'py-24',
      paddingBottom: 'py-24',
      backgroundType: 'solid',
      backgroundColor: '#0f172a',
      backgroundImageOpacity: 100,
      alignment: 'text-center items-center',
      containerWidthOverride: 'max-w-7xl',
      // testimonialsSection-specific
      sectionTitle: 'What Clients Say',
      sectionTagline: 'From the people who have been through it.',
      displayMode: 'auto',
      cardStyle: 'quote',
      limit: 3,
    },

    // ── 7. finalCtaSection ────────────────────────────────────────────────────
    {
      _type: 'finalCtaSection',
      _key: key(),
      sectionId: 'demo-cta',
      visible: true,
      paddingTop: 'py-24',
      paddingBottom: 'py-24',
      backgroundType: 'gradient',
      backgroundGradient: { from: '#3b82f6', to: '#1e293b', direction: 'bg-gradient-to-r' },
      backgroundImageOpacity: 100,
      alignment: 'text-center items-center',
      containerWidthOverride: 'max-w-7xl',
      // finalCtaSection-specific
      headline: "Got a project in mind? Let's talk.",
      supportingText: "Whether you have a brief ready or just an idea, I'm happy to have a conversation about what you're trying to build.",
      buttons: [
        btn('Start a Conversation', '/contact', 'primary'),
        btn('See My Work', '/work', 'ghost'),
      ],
      layout: 'centered',
      centeredBackground: true,
    },

    // ── 8. contactSection ─────────────────────────────────────────────────────
    {
      _type: 'contactSection',
      _key: key(),
      sectionId: 'demo-contact',
      visible: true,
      paddingTop: 'py-24',
      paddingBottom: 'py-24',
      backgroundType: 'solid',
      backgroundColor: '',
      backgroundImageOpacity: 100,
      alignment: 'text-left items-start',
      containerWidthOverride: 'max-w-6xl',
      // contactSection-specific
      headline: 'Send a message',
      supportingText: "Tell me about the project, the problem, or the idea. I'll get back to you within 48 hours.",
      submitButtonText: 'Send Message',
      successMessage: "Got it. I'll be in touch within 48 hours.",
    },

    // ── 9. bookingSection ─────────────────────────────────────────────────────
    {
      _type: 'bookingSection',
      _key: key(),
      sectionId: 'demo-booking',
      visible: true,
      paddingTop: 'py-16',
      paddingBottom: 'py-24',
      backgroundType: 'solid',
      backgroundColor: '#1e293b',
      backgroundImageOpacity: 100,
      alignment: 'text-center items-center',
      containerWidthOverride: 'max-w-4xl',
      // bookingSection-specific
      headline: 'Prefer a call?',
      supportingText: 'Book a 30-minute intro call directly in my calendar. No agenda required — just a conversation.',
      // calLink left empty — falls back to PUBLIC_CALCOM_USERNAME env var
      buttonLabel: 'Book a Call',
      layout: 'centered',
    },
  ],
  seo: {
    title: 'Sections Demo — Internal Reference',
    description: 'Internal page. One populated instance of every section type.',
  },
})

// ─── OUTPUT ──────────────────────────────────────────────────────────────────

docs.forEach((doc) => process.stdout.write(JSON.stringify(doc) + '\n'))

process.stderr.write([
  '',
  `✓ ${docs.length} documents written to stdout`,
  '',
  '  Document breakdown:',
  '    siteSettings  × 1',
  '    service       × 6',
  '    portfolio     × 5',
  '    caseStudy     × 5',
  '    testimonial   × 5',
  '    blogPost      × 5',
  '    page          × 6  (Home, About, Services, Work, Contact, Sections Demo)',
  '',
  '  Section schemas covered (1 instance each, in Sections Demo page):',
  '    heroSection, statsSection, servicesSection, portfolioSection,',
  '    whyMeSection, testimonialsSection, finalCtaSection,',
  '    contactSection, bookingSection',
  '',
  '  Next steps:',
  '    node seed.js > seed.ndjson',
  '    sanity dataset import seed.ndjson production --replace',
  '',
].join('\n'))
