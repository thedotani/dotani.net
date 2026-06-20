/**
 * New CMS page + content set definitions for the content-box page builder.
 */

const block = (text, style = 'normal') => {
  const k = `b${Math.random().toString(36).slice(2, 8)}`
  return {
    _key: k,
    _type: 'block',
    style,
    markDefs: [],
    children: [{ _key: `${k}c`, _type: 'span', marks: [], text }],
  }
}

const btn = (label, url, style = 'primary', openInNewTab = false) => ({
  _key: `btn${Math.random().toString(36).slice(2, 8)}`,
  label,
  url,
  style,
  openInNewTab,
})

const ref = (id) => ({ _type: 'reference', _ref: id })

const styleDefaults = (overrides = {}) => ({
  spacingMode: 'global',
  sectionWidth: overrides.sectionWidth || 'container',
  customColors: overrides.customColors ?? false,
  backgroundType: overrides.backgroundType || 'solid',
  backgroundColor: overrides.backgroundColor || '',
  ...(overrides.backgroundGradient ? { backgroundGradient: overrides.backgroundGradient } : {}),
})

function contentBox(key, opts) {
  return {
    _type: 'contentBoxSection',
    _key: key,
    visible: true,
    sectionId: opts.sectionId || '',
    badge: opts.badge || '',
    eyebrow: opts.eyebrow || '',
    title: opts.title || '',
    tagline: opts.tagline || '',
    headerLink: opts.headerLink,
    contentMode: opts.contentMode || 'dynamic',
    dynamicContentType: opts.dynamicContentType,
    customContent: opts.customContent,
    buttons: opts.buttons,
    imageSide: opts.imageSide || 'right',
    imageWidth: opts.imageWidth ?? 40,
    ...styleDefaults(opts),
  }
}

function contentSet(key, opts) {
  return {
    _type: 'contentSetSection',
    _key: key,
    visible: true,
    sectionId: opts.sectionId || '',
    displayType: opts.displayType,
    statsSet: opts.statsSet,
    marqueeSet: opts.marqueeSet,
    speed: opts.speed,
    skewY: opts.skewY,
    skewX: opts.skewX,
    height: opts.height,
    glass: opts.glass,
    glassBlur: opts.glassBlur,
    ...styleDefaults(opts),
  }
}

function richText(key, opts) {
  return {
    _type: 'richTextSection',
    _key: key,
    visible: true,
    sectionId: opts.sectionId || '',
    body: opts.body,
    ...styleDefaults(opts),
  }
}

export const CONTENT_SETS = [
  {
    _id: 'contentset-home-stats',
    _type: 'contentSet',
    title: 'Home Stats',
    setType: 'stats',
    metrics: [
      { _key: 'm1', name: 'Projects', value: '60+', description: 'Projects Completed' },
      { _key: 'm2', name: 'Experience', value: '8+', description: 'Years in Digital' },
      { _key: 'm3', name: 'Clients', value: '30+', description: 'Clients Across Pakistan' },
      { _key: 'm4', name: 'Reach', value: '2.4M', description: 'Organic Reach — Single Campaign' },
    ],
  },
  {
    _id: 'contentset-profile-stats',
    _type: 'contentSet',
    title: 'Profile Stats',
    setType: 'stats',
    metrics: [
      { _key: 'm1', name: 'Years', value: '8+', description: 'Years Working in Digital' },
      { _key: 'm2', name: 'Projects', value: '60+', description: 'Projects Completed' },
      { _key: 'm3', name: 'Clients', value: '30+', description: 'Clients Across Pakistan' },
      { _key: 'm4', name: 'Platforms', value: '5', description: 'Platforms Managed Simultaneously — Peak' },
    ],
  },
  {
    _id: 'contentset-marquee-brands',
    _type: 'contentSet',
    title: 'Client Marquee',
    setType: 'marquee',
    marqueeItems: [
      { _key: 'i1', name: 'Social Strategy' },
      { _key: 'i2', name: 'Personal Branding' },
      { _key: 'i3', name: 'Content Systems' },
      { _key: 'i4', name: 'Digital Campaigns' },
      { _key: 'i5', name: 'Web Design' },
      { _key: 'i6', name: 'Training & Workshops' },
    ],
  },
]

export const PAGE_SECTIONS = {
  'page-home': [
    contentBox('home-hero', {
      sectionId: 'hero',
      eyebrow: 'Digital Strategy & Creative Consulting',
      title: 'I help brands find their voice online.',
      tagline: 'Strategy. Content. Presence.',
      contentMode: 'custom',
      customContent: [
        block('Whether you need a social media strategy, a personal brand, a content framework, or a digital campaign — I work with organisations and individuals who want to communicate better and reach further.'),
      ],
      buttons: [
        btn('See My Work', '/portfolio', 'primary'),
        btn("Let's Talk", '/contact', 'outline'),
      ],
      customColors: true,
      backgroundColor: '#0f172a',
    }),
    contentSet('home-stats', {
      sectionId: 'stats',
      displayType: 'stats',
      statsSet: ref('contentset-home-stats'),
      customColors: true,
      backgroundColor: '#1e293b',
    }),
    contentBox('home-services', {
      sectionId: 'services',
      title: 'What I Do',
      tagline: 'A focused set of services for brands and professionals who want digital work that actually does something.',
      contentMode: 'dynamic',
      dynamicContentType: 'service',
    }),
    contentBox('home-portfolio', {
      sectionId: 'work',
      title: 'Selected Work',
      tagline: 'A few projects worth looking at.',
      headerLink: { label: 'See All Work', url: '/portfolio' },
      contentMode: 'dynamic',
      dynamicContentType: 'portfolio',
    }),
    contentSet('home-marquee', {
      sectionId: 'marquee',
      displayType: 'marquee',
      marqueeSet: ref('contentset-marquee-brands'),
      speed: 28,
      skewY: -2,
      height: { value: 3.5, unit: 'rem' },
      sectionWidth: 'full',
    }),
    contentBox('home-testimonials', {
      sectionId: 'testimonials',
      title: 'What Clients Say',
      tagline: 'From the people who have been through it.',
      contentMode: 'dynamic',
      dynamicContentType: 'testimonial',
      customColors: true,
      backgroundColor: '#0f172a',
    }),
    contentBox('home-cta', {
      sectionId: 'cta',
      title: "Got a project in mind? Let's talk.",
      tagline: "Whether you have a brief ready or just an idea, I'm happy to have a conversation about what you're trying to build.",
      contentMode: 'custom',
      customContent: [],
      buttons: [btn('Start a Conversation', '/contact', 'primary')],
      customColors: true,
      backgroundType: 'gradient',
      backgroundGradient: { from: '#3b82f6', to: '#1e293b', direction: 'bg-gradient-to-r' },
    }),
    contentBox('home-contact', {
      sectionId: 'contact',
      title: 'Send a message',
      tagline: "Tell me about the project, the problem, or the idea. I'll get back to you within 48 hours.",
      contentMode: 'custom',
      customContent: [],
    }),
    contentBox('home-booking', {
      sectionId: 'booking',
      title: 'Prefer a call?',
      tagline: 'Book a 30-minute intro call directly in my calendar. No agenda required.',
      contentMode: 'custom',
      customContent: [],
      customColors: true,
      backgroundColor: '#1e293b',
    }),
  ],

  'page-about': [
    contentBox('profile-hero', {
      sectionId: 'about-hero',
      eyebrow: 'Profile',
      title: 'I have been building digital things in Pakistan for over eight years.',
      tagline: 'Strategist. Writer. Digital Activist.',
      contentMode: 'custom',
      customContent: [
        block('My work sits at the intersection of content, brand, and technology — helping organisations and individuals communicate more clearly, reach further, and show up consistently online.'),
      ],
      customColors: true,
      backgroundColor: '#0f172a',
    }),
    richText('profile-why', {
      sectionId: 'why-me',
      body: [
        block('Why work with me', 'h2'),
        block('I do not produce work that looks good in a deck and falls apart in practice. My focus is always on what actually changes something — for the brand, the campaign, or the person.'),
        block('Pakistan-first thinking — Most digital frameworks are built for Western markets. I build for Pakistani audiences and cultural context from the ground up.'),
        block('Strategy before execution — The brief is where most projects go wrong. I spend time getting the strategy right before anything is produced.'),
        block('Honest without the jargon — No buzzwords, no inflated projections. Clear thinking and practical output.'),
        block('Built to hand off — Everything I build is designed to be usable by the client after I leave — not to create dependency on me.'),
      ],
    }),
    contentSet('profile-stats', {
      sectionId: 'about-stats',
      displayType: 'stats',
      statsSet: ref('contentset-profile-stats'),
      customColors: true,
      backgroundColor: '#1e293b',
    }),
    contentBox('profile-cta', {
      sectionId: 'about-cta',
      title: 'Want to work together?',
      tagline: "Send me a note about what you're working on.",
      contentMode: 'custom',
      customContent: [],
      buttons: [btn('Get in Touch', '/contact', 'primary')],
      customColors: true,
      backgroundColor: '#0f172a',
    }),
  ],

  'page-services': [
    contentBox('services-hero', {
      sectionId: 'services-hero',
      eyebrow: 'Services',
      title: 'Digital work that actually does something.',
      tagline: 'No vanity metrics. No deliverables that exist to fill a deck.',
      contentMode: 'custom',
      customContent: [
        block('I work on a focused set of services — the ones I do well and can deliver with confidence. If you need something not listed here, ask anyway.'),
      ],
      customColors: true,
      backgroundColor: '#0f172a',
    }),
    contentBox('services-list', {
      sectionId: 'services-list',
      title: 'What I Offer',
      contentMode: 'dynamic',
      dynamicContentType: 'service',
    }),
    contentBox('services-cta', {
      sectionId: 'services-cta',
      title: 'Not sure which service is right for you?',
      tagline: "Send me a short note about what you're trying to do. I'll tell you honestly whether I can help, and how.",
      contentMode: 'custom',
      customContent: [],
      buttons: [btn('Start a Conversation', '/contact', 'primary')],
      customColors: true,
      backgroundType: 'gradient',
      backgroundGradient: { from: '#3b82f6', to: '#0f172a', direction: 'bg-gradient-to-r' },
    }),
  ],

  'page-work': [
    contentBox('work-hero', {
      sectionId: 'work-hero',
      eyebrow: 'Selected Work',
      title: 'Projects worth looking at.',
      tagline: 'Each one different. Each one with results that can be named.',
      contentMode: 'custom',
      customContent: [
        block('A selection of client work across social media management, personal branding, content strategy, digital campaigns, and web design.'),
      ],
      customColors: true,
      backgroundColor: '#0f172a',
    }),
    contentBox('work-grid', {
      sectionId: 'portfolio-grid',
      title: 'All Projects',
      contentMode: 'dynamic',
      dynamicContentType: 'portfolio',
    }),
    contentBox('work-testimonials', {
      sectionId: 'work-testimonials',
      title: 'From the Clients',
      contentMode: 'dynamic',
      dynamicContentType: 'testimonial',
      customColors: true,
      backgroundColor: '#0f172a',
    }),
    contentBox('work-cta', {
      sectionId: 'work-cta',
      title: 'Want to be on this page?',
      tagline: "If you have a project that needs this kind of thinking, let's talk.",
      contentMode: 'custom',
      customContent: [],
      buttons: [btn("Let's Talk", '/contact', 'primary')],
      customColors: true,
      backgroundType: 'gradient',
      backgroundGradient: { from: '#3b82f6', to: '#1e293b', direction: 'bg-gradient-to-r' },
    }),
  ],

  'page-contact': [
    contentBox('contact-hero', {
      sectionId: 'contact-hero',
      eyebrow: 'Get in Touch',
      title: "Let's talk about what you're working on.",
      tagline: 'No forms. No auto-replies. Just a conversation.',
      contentMode: 'custom',
      customContent: [
        block("Tell me what you're trying to do — a project brief, a vague idea, a problem you haven't solved yet. I read everything and respond to everything that looks like it could go somewhere."),
      ],
      customColors: true,
      backgroundColor: '#0f172a',
    }),
    contentBox('contact-form', {
      sectionId: 'contact',
      title: 'Send a message',
      tagline: "Tell me about the project, the problem, or the idea. I'll get back to you within 48 hours.",
      contentMode: 'custom',
      customContent: [],
    }),
    contentBox('contact-booking', {
      sectionId: 'booking',
      title: 'Prefer a call?',
      tagline: 'Book a 30-minute intro call directly in my calendar. No agenda required.',
      contentMode: 'custom',
      customContent: [],
      customColors: true,
      backgroundColor: '#1e293b',
    }),
  ],

  'page-booking': [
    contentBox('booking-hero', {
      sectionId: 'booking-hero',
      eyebrow: 'Booking',
      title: 'Book a call when you are ready to move.',
      tagline: 'A short conversation to understand the problem and the fit.',
      contentMode: 'custom',
      customContent: [
        block('Use the calendar link below for a 30-minute intro call. Bring a rough brief, a question, or simply the problem you have not solved yet.'),
      ],
      customColors: true,
      backgroundColor: '#0f172a',
    }),
    contentBox('booking-cta', {
      sectionId: 'booking',
      title: 'Schedule your intro call',
      tagline: 'Pick a time that works for you. You will get a calendar confirmation immediately.',
      contentMode: 'custom',
      customContent: [],
      customColors: true,
      backgroundColor: '#1e293b',
    }),
    contentBox('booking-fallback', {
      sectionId: 'booking-contact-fallback',
      title: 'Prefer email first?',
      tagline: 'Send a note through the contact page and we can schedule from there.',
      contentMode: 'custom',
      customContent: [],
      buttons: [btn('Go to Contact', '/contact', 'outline')],
    }),
  ],
}