import {mkdirSync, writeFileSync} from 'node:fs'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'
import {getCliClient} from 'sanity/cli'

const dataset = process.env.SANITY_DATASET || 'staging'
const client = getCliClient({apiVersion: '2024-01-01'}).withConfig({dataset})

const assetsDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../../scripts/seed-assets')
mkdirSync(assetsDir, {recursive: true})

function svg({width, height, label, from, to}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/>
  </linearGradient></defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Georgia, serif" font-size="${Math.round(Math.min(width, height) / 14)}" font-weight="600">${label}</text>
</svg>`
}

function imageRef(asset) {
  return {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: asset._id,
    },
  }
}

async function uploadSvg({filename, label, width, height, from, to}) {
  const filePath = resolve(assetsDir, filename)
  const content = svg({width, height, label, from, to})
  writeFileSync(filePath, content)

  console.log(`Uploading ${filename}...`)
  return client.assets.upload('image', Buffer.from(content), {
    filename,
    contentType: 'image/svg+xml',
  })
}

const portfolioTargets = [
  {id: 'portfolio-zlc', label: 'Zara Leather Co.', from: '#be185d', to: '#831843'},
  {id: 'portfolio-sh', label: 'Saira Hamid', from: '#7c3aed', to: '#4c1d95'},
  {id: 'portfolio-am', label: 'Aurat March', from: '#db2777', to: '#9d174d'},
  {id: 'portfolio-ks', label: 'Khaas Stories', from: '#059669', to: '#065f46'},
  {id: 'portfolio-tt', label: 'Tariq Travels', from: '#0284c7', to: '#075985'},
]

async function main() {
  console.log(`Seeding images into dataset "${dataset}"...`)

  const [logoAsset, heroAsset] = await Promise.all([
    uploadSvg({
      filename: 'dotani-logo.svg',
      label: 'Dotani',
      width: 320,
      height: 80,
      from: '#3b82f6',
      to: '#1d4ed8',
    }),
    uploadSvg({
      filename: 'dotani-hero.svg',
      label: 'Digital Strategy',
      width: 1200,
      height: 900,
      from: '#3b82f6',
      to: '#1e3a8a',
    }),
  ])

  await client
    .patch('site-settings-main')
    .set({'header.logo': imageRef(logoAsset)})
    .commit()
  console.log('Updated siteSettings logo.')

  const homePage = await client.fetch(`*[_id == "page-home"][0]{sections[]{_key, _type}}`)
  const heroKey =
    homePage?.sections?.find((section) => section._type === 'heroSection')?._key || 'ky4'

  await client
    .patch('page-home')
    .set({[`sections[_key=="${heroKey}"].heroImage`]: imageRef(heroAsset)})
    .commit()
  console.log(`Updated home hero image (section key: ${heroKey}).`)

  for (const item of portfolioTargets) {
    const asset = await uploadSvg({
      filename: `${item.id}.svg`,
      label: item.label,
      width: 1200,
      height: 675,
      from: item.from,
      to: item.to,
    })

    await client.patch(item.id).set({thumbnail: imageRef(asset)}).commit()
    console.log(`Updated ${item.id} thumbnail.`)
  }

  console.log('Image seeding complete.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})