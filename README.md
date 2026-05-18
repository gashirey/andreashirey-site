# Grey Gables Farm

MVP marketing site for [greygablesfarm.com](https://greygablesfarm.com) — brand, story, gallery, and inquiries. Built with Next.js, TypeScript, and Tailwind CSS.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Editing content

| What | Where |
|------|--------|
| Site name, tagline, email, nav | `lib/content.ts` |
| Flower availability listings | `lib/content.ts` → `currentAvailability` |
| Gallery images | `lib/content.ts` → `galleryImages` |
| Rooted Farmers / Shopify URLs | `lib/links.ts` |

Replace placeholder images in `public/images/placeholders/` with real photos (keep filenames or update paths in `lib/content.ts`).

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. When ready, point DNS from WordPress.com to Vercel (see Vercel domain docs).

## Pages

- `/` — Home
- `/about` — About
- `/flowers` — Flowers & availability
- `/gallery` — Gallery
- `/weddings` — Weddings & events
- `/contact` — Contact
