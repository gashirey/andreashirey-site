# Review / test photos (local)

Drop `.jpg`, `.jpeg`, `.png`, or `.webp` files here for lazy-load testing on `/gallery`.

Then run from the project root:

```bash
npm run gallery:sync-review
```

That regenerates `lib/gallery-review.generated.ts` and picks up new files on refresh.

These files are gitignored so they stay on your machine only.
