/**
 * Converts @sanity/color-input object values to plain hex strings.
 * Run: sanity exec scripts/migrate-hex-colors.mjs --with-user-token
 */

import {getCliClient} from 'sanity/cli'

const client = getCliClient()

const COLOR_PATHS = [
  'theme.primaryColor',
  'theme.secondaryColor',
  'theme.accentColor',
  'theme.themeColor',
  'sections[].backgroundColor',
  'sections[].backgroundGradient.from',
  'sections[].backgroundGradient.to',
  'customColorScheme.bodyText',
  'customColorScheme.headings',
  'customColorScheme.buttons',
  'customColorScheme.accent',
  'customColorScheme.background',
  'customGradient.from',
  'customGradient.to',
  'accentColor',
]

function toHex(value) {
  if (!value) return undefined
  if (typeof value === 'string') return value
  if (typeof value === 'object' && typeof value.hex === 'string') return value.hex
  return undefined
}

function patchObject(obj, pathParts) {
  if (!obj || pathParts.length === 0) return false

  const [head, ...tail] = pathParts

  if (head.endsWith('[]')) {
    const key = head.slice(0, -2)
    const items = obj[key]
    if (!Array.isArray(items)) return false
    let changed = false
    for (const item of items) {
      if (patchObject(item, tail)) changed = true
    }
    return changed
  }

  if (tail.length === 0) {
    const hex = toHex(obj[head])
    if (!hex) return false
    if (obj[head] === hex) return false
    obj[head] = hex
    return true
  }

  return patchObject(obj[head], tail)
}

async function migrate() {
  const types = ['siteSettings', 'page', 'portfolio']
  const docs = await client.fetch(`*[_type in $types]{_id,_type,...}`, {types})

  for (const doc of docs) {
    const next = structuredClone(doc)
    let changed = false

    for (const path of COLOR_PATHS) {
      if (patchObject(next, path.split('.'))) changed = true
    }

    if (changed) {
      const {_id, _type, ...patch} = next
      await client.patch(_id).set(patch).commit()
      console.log(`Migrated ${_type} (${_id})`)
    }
  }

  console.log('Done.')
}

migrate().catch((error) => {
  console.error(error)
  process.exit(1)
})