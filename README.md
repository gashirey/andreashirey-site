# Andrea Shirey Photography

Editorial photography portfolio — built with Next.js, TypeScript, and Tailwind CSS.

## Local development

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

## Editing content

| What | Where |
|------|--------|
| Site name, tagline, email, nav | `lib/content.ts` |
| Gallery images | `lib/content.ts` → `galleryImages` |
| Homepage copy | `lib/content.ts` → `heroHome`, `homeAbout`, `homeSections` |

Replace placeholder images in `public/images/` with portfolio work (update paths in `lib/content.ts`).

## Contacts (Supabase)

Inquiries from the contact form can write to Supabase. See [supabase/README.md](supabase/README.md) and copy `.env.example` → `.env.local`.

## Deploy to Vercel

1. Push to [github.com/gashirey/andreashirey-site](https://github.com/gashirey/andreashirey-site).
2. Import the project in [Vercel](https://vercel.com).
3. Add environment variables from `.env.example`.
4. Point `andreashirey.com` (or preview domain) when ready to go live.

## Pages

- `/` — Home
- `/gallery` — Work
- `/about` — About
- `/contact` — Contact
