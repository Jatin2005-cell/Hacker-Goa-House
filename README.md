# Hacker House Goa 2026 — Builder ID Generator

Format B submission for the HH Goa 2026 shortlisting task: upload a photo,
fill in name + role, get a colourful "Builder ID" card, download it, or
share straight to X with the card image attached.

## Design

- **Theme**: Goa scrapbook × terminal culture — cream "grid paper" background,
  a dashed-circle photo frame like a boarding-pass photo slot, a postage-stamp
  sticker, a mango dates-chip, and a teal wave footer instead of a generic
  logo-stamped badge.
- **Type**: Anton (poster headline) + Baloo Bhai 2 for the Devanagari "गोवा"
  (keeps the playful rounded feel in both scripts) + Poppins for everything else.
- **One fun field, on purpose**: instead of a wall of stats, the card has a
  single auto-generated "Builder Class" (e.g. *Terminal Wizard*, *Async
  Custodian*) derived from name + role, with a shuffle button. Keeps text light
  per the brief.
- Everything is drawn on an HTML5 `<canvas>` at 1080×1350, so download and
  share both export the exact same real PNG, not a screenshot.

## Architecture

```
Browser (client)
 ├─ Upload photo → loadPhoto() → HEIC→JPEG via heic2any if needed →
 │  createImageBitmap (EXIF-safe)
 ├─ drawBuilderCard() paints the card onto <canvas> — background, stickers,
 │  circular photo crop (cover-fit for any aspect ratio), name/role/title,
 │  footer + QR — entirely client-side, near-instant, no server round trip
 ├─ Download → canvas.toBlob → local file save
 └─ Share to X
     ├─ Mobile w/ Web Share API (files) → navigator.share() with the PNG
     │  attached directly + caption — this is the "image attached" path
     └─ Fallback (desktop / unsupported) →
         POST canvas PNG to /api/upload → returns {id}
         → open twitter.com/intent/tweet?url=/share/{id}
         → /share/[id] renders Open Graph + Twitter Card meta tags pointing
           at the uploaded image, so the link preview shows the real card

Server (Next.js route handlers, serverless)
 ├─ POST /api/upload — rate-limited, validates PNG, stores it via
 │  lib/storage.ts (Vercel Blob in prod, /public/generated in dev)
 └─ GET /share/[id] — generateMetadata() builds the OG/Twitter tags from a
    deterministic image URL (lib/imageUrl.ts), no database needed
```

Nothing requires a login or signup — the whole "upload → result → share"
flow happens in one pass, and the heavy lifting (image compositing) runs in
the visitor's browser, so it's fast regardless of server load.

## Stack

Next.js 14 (App Router) + TypeScript + Tailwind CSS + Canvas 2D API.
`heic2any` for iPhone HEIC/HEIF photos, `qrcode` for the footer QR,
`@vercel/blob` (optional) for durable share-image storage, `nanoid` for
share ids.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Share links will work locally too — they just
save into `public/generated/` instead of Blob storage.

## Deploy (Vercel)

1. Push this repo to GitHub and import it into Vercel.
2. In the project's **Storage** tab, create a **Blob** store and connect it —
   Vercel injects `BLOB_READ_WRITE_TOKEN` automatically.
3. Copy the store's public base URL (shown in the Blob store settings) into
   the project's env vars as `NEXT_PUBLIC_BLOB_BASE_URL`.
4. (Optional) set `NEXT_PUBLIC_SITE_URL` to your production domain.
5. Deploy. Without step 2–3 the app still works end-to-end, but share-link
   previews won't persist across deployments — fine for local testing, not
   for the live submission link.

## Where things live

| Concern | File |
|---|---|
| Card visual design | `lib/drawCard.ts` |
| Fun title generator | `lib/builderTitles.ts` |
| HEIC/EXIF-safe photo loading | `lib/loadPhoto.ts` |
| Upload form + canvas + share logic | `components/BuilderCard.tsx` |
| Share-link OG tags | `app/share/[id]/page.tsx` |
| Upload endpoint | `app/api/upload/route.ts` |
| Storage (Blob vs local) | `lib/storage.ts` |

## Notes / next steps if you keep iterating

- Swap the in-memory rate limiter in `app/api/upload/route.ts` for
  something durable (e.g. Upstash) if you expect real traffic.
- The QR in the footer currently points at `hhgoa.com` — point it at the
  live share URL once you have one if you want it to double as a
  "scan to see this person's card" link.
- Card size is fixed at 1080×1350 (4:5) — good for both an X image
  attachment and an OG preview. Adjust `CARD_WIDTH`/`CARD_HEIGHT` in
  `lib/drawCard.ts` if you want a square (1:1) variant instead.
