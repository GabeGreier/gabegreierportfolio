# Gabriel Greier Portfolio

Production-ready Next.js portfolio that unifies engineering/software case studies and cinematic automotive photography in one brand.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn-style UI primitives
- Supabase Auth + Postgres + Storage
- Vercel deployment ready

## Features

- Public pages: `/`, `/projects`, `/projects/[slug]`, `/visuals`, `/about`, `/contact`
- Admin pages: `/admin`, `/admin/dashboard`, `/admin/projects`, `/admin/visuals`
- Server-side admin route protection (`requireAdmin` checks auth and email allowlist)
- Projects CRUD with publish/feature controls
- Visuals CRUD with upload-to-storage flow and publish/feature controls
- Subtle paper-tone premium visual system (off-white base, charcoal text, orange accent)
- SEO metadata, Open Graph image, robots/sitemap

## 1) Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Required `.env.local` values:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
ADMIN_EMAILS=gabriel@example.com
```

`ADMIN_EMAILS` is a comma-separated allowlist used by server route protection.

## 2) Supabase setup

1. Create a Supabase project.
2. Run migration SQL in `supabase/migrations/20260224170000_init_portfolio.sql`.
3. Optional: run `supabase/seed.sql` for starter placeholder entries.
4. In `public.admin_emails`, replace `your-email@example.com` with your real admin email.
5. In Supabase Auth, create user(s) for your admin email(s) and set passwords.

If using Supabase CLI:

```bash
supabase db push
psql "$SUPABASE_DB_URL" -f supabase/seed.sql
```

## 3) Security model

- Admin pages are protected server-side with Supabase session checks.
- Admin action handlers validate auth on the server before mutations.
- RLS enabled on all portfolio tables.
- Write access is restricted to emails in `public.admin_emails` via `public.is_admin_email()`.
- Storage policies restrict upload/update/delete to admin users.
- No service-role key is used client-side.

## 4) Deployment to Vercel

1. Push repository to GitHub.
2. Import project into Vercel.
3. Add environment variables:
   - `NEXT_PUBLIC_SITE_URL` (production domain)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_EMAILS`
4. Deploy.

## 5) Content management notes

- Public pages pull from Supabase when configured.
- If Supabase is not configured, pages fall back to local sample content so the UI still renders.
- Included sample placeholders:
  - FPGA Distortion Pedal
  - Ring & Rink
  - multiple automotive visual entries

## 6) Image/performance notes

- Uses `next/image` with lazy loading defaults.
- Admin upload forms enforce image mime types and an 8MB file limit.
- For best results, upload pre-optimized display and thumbnail assets.

## Project structure

```text
src/app                # Routes (public + admin)
src/components         # UI and site/admin components
src/lib                # Supabase/auth/data helpers
supabase/migrations    # Schema + RLS + storage policies
supabase/seed.sql      # Starter content
```
