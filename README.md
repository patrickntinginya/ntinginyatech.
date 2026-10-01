# Ntinginya Tech website

Next.js (App Router) + React + TypeScript + Tailwind CSS 3 + Lucide icons.
V3 adds Supabase (auth, database, storage), a News & Insights CMS, an admin area and Resend email.
**Start with `docs/V3_SETUP.md`.**

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
```

Production check:

```bash
npm run typecheck
npm run lint
npm run build && npm run start
```

## Structure

```
src/
  app/            Routes: / /about /solutions /products /products/[slug] /agriculture
                  /innovation /masterclass /r-and-d /news /contact /privacy /terms
                  + api/contact, sitemap.ts, robots.ts, opengraph-image.tsx, icon.svg
  components/
    layout/       Header (sticky, mobile menu), Footer, Logo, SocialLinks
    sections/     Page sections (Hero, CoreAreas, Products, Innovation, Masterclass, ...)
    ui/           Button, Container, Section, SectionHeading, StatusBadge, ProcessRail
    visuals/      HeroVisual, ContourBackdrop (SVG)
  content/        All copy and data (products, countries, core areas, research steps)
  config/site.ts  Company name, tagline, contact details, nav
  lib/            metadata helper, contour math, cn()
```

## Before launch

- Social links and contact details can now be edited in `/admin/settings` (defaults live in `src/config/site.ts`).
- `src/app/privacy/page.tsx` and `terms/page.tsx`: describe what the code actually does; have a lawyer review them.
- `src/components/layout/Logo.tsx` and `src/app/icon.svg`: text/mark placeholder until an official logo exists.
- Status labels: edit `src/content/*.ts` (LIVE, MVP, IN DEVELOPMENT, PROPOSED, FUTURE). Never mark something LIVE before it is.

## V3: CMS, admin and contact

- `/news`, `/news/[slug]`: published posts only (RLS plus an explicit filter). SEO metadata, canonical URL, Article JSON-LD.
- `/login`, `/admin/*`: owner/admin only. Checked in middleware, in the admin layout, on every page and in every server action.
- `/api/contact`: validates on the server, stores the message in Supabase first, then sends a Resend notification.
  If Resend is not configured the message is still stored and the site never claims an email was sent.
- `/api/admin/media`: staff-only image upload (JPEG/PNG/WebP, 5 MB, magic-byte check).
- `supabase/migrations/`: two additive, idempotent SQL files, run in order (tables, RLS, storage bucket, starter categories; then post tags and author name).
- Secrets (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`) are server-only and must never use the `NEXT_PUBLIC_` prefix.

## Deploy (Netlify)

Netlify builds Next.js natively (`netlify.toml`). Add the variables from `.env.example` in
Site configuration > Environment variables, then deploy. Full steps: `docs/V3_SETUP.md`.

Google Fonts are downloaded at build time, so the build machine needs internet access.
