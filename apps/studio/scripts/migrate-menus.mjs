/**
 * Migrates legacy header/mobile/footer menu data into universal menus.
 * Run: sanity exec scripts/migrate-menus.mjs --with-user-token
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

async function migrate() {
  const doc = await client.fetch(`*[_id == $id][0]`, {id: SITE_SETTINGS_ID})
  if (!doc) {
    console.log('No siteSettings document found.')
    return
  }

  if (doc.menus?.items?.length) {
    console.log('Universal menus already populated — skipping.')
    return
  }

  const items = []
  const seen = new Set()

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
    seen.add(key)
  }

  for (const item of doc.header?.menuItems || []) {
    add(item, {header: true, mobileMenu: true})
  }

  for (const item of doc.mobileMenu?.menuItems || []) {
    add(item, {mobileMenu: true})
  }

  for (const column of doc.footer?.columns || []) {
    const links = column?.links || []
    links.forEach((link, index) => {
      if (typeof link !== 'string' || !link.trim()) return
      const placement =
        index === 0
          ? {footerCol2: true}
          : index === 1
            ? {footerCol3: true}
            : {footerCol4: true}
      add({label: link, url: link.startsWith('/') || link.includes('://') ? link : `/${link.toLowerCase().replace(/\s+/g, '-')}`}, placement)
    })
  }

  if (items.length === 0) {
    console.log('No legacy menu items to migrate.')
    return
  }

  await client.patch(doc._id).set({menus: {items}}).commit()
  console.log(`Migrated ${items.length} menu items into universal menus.`)
}

migrate().catch((error) => {
  console.error(error)
  process.exit(1)
})