/**
 * Flattens brand.logos.* into brand.logo* fields for the updated schema.
 * Run: sanity exec scripts/migrate-brand-logos.mjs --with-user-token
 */

import {getCliClient} from 'sanity/cli'

const SITE_SETTINGS_ID = 'site-settings-main'

const client = getCliClient()

async function migrate() {
  const doc = await client.fetch(`*[_id == $id][0]{_id, brand}`, {id: SITE_SETTINGS_ID})
  if (!doc?.brand) {
    console.log('No brand data found.')
    return
  }

  const {logos, logoMain, logoMobile, logoFooter, logoFavicon, ...rest} = doc.brand
  if (!logos) {
    console.log('Legacy logos object not found — skipping.')
    return
  }

  await client
    .patch(doc._id)
    .set({
      brand: {
        ...rest,
        logoMain: logoMain || logos.main,
        logoMobile: logoMobile || logos.mobile,
        logoFooter: logoFooter || logos.footer,
        logoFavicon: logoFavicon || logos.favicon,
      },
    })
    .unset(['brand.logos'])
    .commit()

  console.log('Brand logos migrated to flat fields.')
}

migrate().catch((error) => {
  console.error(error)
  process.exit(1)
})