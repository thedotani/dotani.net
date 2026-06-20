# Brand Assets

Drop final production files here before uploading to Sanity Media Library.

## Expected files

| File | Use |
|------|-----|
| `logo-main.svg` or `.png` | Header logo |
| `logo-mobile.svg` | Mobile header |
| `logo-footer.svg` | Footer |
| `favicon.ico` / `favicon.svg` | Site favicon |
| `portrait.jpg` | Hero + profile highlight |
| `portfolio/*.jpg` | Project thumbnails |
| `og-image.jpg` | Default Open Graph image (1200×630) |

## Workflow

1. Place files in this folder during dev.
2. Run `npm run seed:images --workspace apps/studio` (or upload manually in Studio).
3. Reference images in `siteSettings` and content documents.
4. Remove placeholders from `apps/web/public/images/` once Sanity assets are live.

Placeholders in `apps/web/public/images/` remain active until Sanity assets are connected.