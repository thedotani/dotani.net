/**
 * Aligns legacy site-settings-main data with the current Site Settings schema.
 * Run: sanity exec scripts/migrate-site-settings.mjs --with-user-token
 */

import {getCliClient} from 'sanity/cli'

const SITE_SETTINGS_ID = 'site-settings-main'

const client = getCliClient()

function toUniversalItem(item, showIn) {
  if (!item?.label || !item?.url) return null
  return {
    _key: item._key || `m-${Math.random().toString(36).slice(2, 9)}`,
    label: item.label,
    url: item.url,
    showIn,
  }
}

function buildMenuItems(doc) {
  if (doc.menus?.items?.length) {
    return null
  }

  const items = []

  const add = (item, showIn) => {
    const next = toUniversalItem(item, showIn)
    if (!next) return
    const key = `${next.label}|${next.url}`
    const existing = items.find((entry) => `${entry.label}|${entry.url}` === key)
    if (existing) {
      existing.showIn = {...existing.showIn, ...showIn}
      return
    }
    items.push(next)
  }

  for (const item of doc.header?.menuItems || []) {
    add(item, {header: true, mobileMenu: true})
  }

  for (const item of doc.mobileMenu?.menuItems || []) {
    add(item, {mobileMenu: true})
  }

  return items.length ? items : null
}

function buildSocialLinks(doc) {
  if (doc.socials?.links?.length) {
    return null
  }

  const legacyLinks = doc.footer?.socialLinks || []
  if (!legacyLinks.length) {
    return null
  }

  return legacyLinks.map((link) => ({
    _key: link._key || `s-${Math.random().toString(36).slice(2, 9)}`,
    platform: link.platform,
    url: link.url,
    label: link.label,
    hideOn: link.hideOn,
  }))
}

function buildBrand(doc) {
  const existing = doc.brand || {}
  const hasFlatLogos =
    existing.logoMain || existing.logoMobile || existing.logoFooter || existing.logoFavicon
  const hasIdentity = existing.siteTitle || existing.logoAlt || existing.tagline

  if (hasFlatLogos && hasIdentity) {
    return null
  }

  const brand = {...existing}

  if (!brand.logoMain && doc.header?.logo) {
    brand.logoMain = doc.header.logo
  }
  if (!brand.siteTitle && doc.header?.title) {
    brand.siteTitle = doc.header.title
  }
  if (!brand.logoAlt && doc.header?.logoAlt) {
    brand.logoAlt = doc.header.logoAlt
  }

  if (!brand.logoMain && !brand.siteTitle && !brand.logoAlt && !brand.tagline) {
    return null
  }

  return brand
}

function normalizeDarkModeDefault(value) {
  if (value === true) return 'dark'
  if (value === false) return 'system'
  if (value === 'light' || value === 'dark' || value === 'system') return value
  return 'system'
}

function buildFooter(doc) {
  const footer = doc.footer || {}
  if (!footer.columns?.length) {
    return null
  }

  const [branding, col2, col3, col4] = footer.columns
  const brandingText =
    footer.description ||
    branding?.links?.find((link) => typeof link === 'string' && !link.startsWith('/') && !link.includes('://'))

  const nextFooter = {
    ...footer,
    description: brandingText || footer.description,
    col2Heading: footer.col2Heading || col2?.heading,
    col3Heading: footer.col3Heading || col3?.heading,
    col4Heading: footer.col4Heading || col4?.heading,
    copyrightText: footer.copyrightText,
  }

  delete nextFooter.columns
  delete nextFooter.widthMode
  delete nextFooter.showSocials
  delete nextFooter.socialLinks

  return nextFooter
}

async function migrate() {
  const doc = await client.fetch(
    `*[_id == $id][0]{
      _id,
      brand,
      menus,
      socials,
      header,
      mobileMenu,
      footer,
      theme
    }`,
    {id: SITE_SETTINGS_ID},
  )

  if (!doc) {
    console.log(`No site settings document found at "${SITE_SETTINGS_ID}".`)
    return
  }

  const brand = buildBrand(doc)
  const menuItems = buildMenuItems(doc)
  const socialLinks = buildSocialLinks(doc)
  const footer = buildFooter(doc)
  const darkModeDefault = doc.theme?.darkModeDefault
  const shouldNormalizeTheme = darkModeDefault === true || darkModeDefault === false

  const setPatch = client.patch(SITE_SETTINGS_ID)
  let changed = false

  if (brand) {
    setPatch.set({brand})
    changed = true
    console.log('Migrating brand fields from legacy header.')
  }

  if (menuItems) {
    setPatch.set({menus: {items: menuItems}})
    changed = true
    console.log(`Migrating ${menuItems.length} menu items into universal menus.`)
  }

  if (socialLinks) {
    setPatch.set({socials: {links: socialLinks}})
    changed = true
    console.log(`Migrating ${socialLinks.length} social links into socials.links.`)
  }

  if (footer) {
    setPatch.set({footer})
    changed = true
    console.log('Migrating footer columns into flat heading fields.')
  }

  if (shouldNormalizeTheme) {
    setPatch.set({
      theme: {
        ...doc.theme,
        darkModeDefault: normalizeDarkModeDefault(darkModeDefault),
      },
    })
    changed = true
    console.log('Normalizing theme.darkModeDefault to string value.')
  }

  if (changed) {
    await setPatch.commit()
  }

  const legacyPaths = [
    ...(brand ? ['header.logo', 'header.logoAlt', 'header.title'] : []),
    ...(menuItems ? ['header.menuItems', 'mobileMenu.menuItems'] : []),
    ...(socialLinks ? ['footer.socialLinks'] : []),
    ...(footer ? ['footer.columns', 'footer.widthMode', 'footer.showSocials'] : []),
  ]

  if (legacyPaths.length) {
    await client.patch(SITE_SETTINGS_ID).unset(legacyPaths).commit()
    console.log(`Removed ${legacyPaths.length} legacy field paths.`)
    changed = true
  }

  if (!changed) {
    console.log('Site settings already aligned — nothing to migrate.')
    return
  }

  console.log(`Migration complete for "${SITE_SETTINGS_ID}". Publish in Studio to make changes live.`)
}

migrate().catch((error) => {
  console.error(error)
  process.exit(1)
})