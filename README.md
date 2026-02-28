# Gabriel Greier Portfolio

Next.js + Supabase app currently being adapted toward a dealership photo-to-listing workflow portal MVP.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn-style UI primitives
- Supabase Auth + Postgres + Storage
- Vercel deployment ready

## Features

- Public pages: `/`, `/projects`, `/projects/[slug]`, `/visuals`, `/about`, `/contact`
- Auth pages: `/login`, `/admin`
- Protected app pages (MVP bootstrap): `/dashboard`, `/vehicles/*`, `/admin/dealers`
- Middleware session refresh + auth/role/dealer route guards
- First-login profile bootstrap (`profiles` row auto-created when missing)
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
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
SUPABASE_DB_URL=postgresql://postgres:<PASSWORD>@db.<PROJECT-REF>.supabase.co:5432/postgres
ADMIN_EMAILS=gabriel@example.com
```

`ADMIN_EMAILS` is a comma-separated allowlist used by portfolio admin route protection.
`SUPABASE_SERVICE_ROLE_KEY` is used server-side only for profile bootstrap and upcoming tokenized upload flows.

## 2) Supabase setup

1. Create a Supabase project.
2. Run all migration SQL in `supabase/migrations/`.
3. Optional: run `supabase/seed.sql` for starter placeholder entries (portfolio + dealership demo rows).
4. In `public.admin_emails`, replace `your-email@example.com` with your real admin email.
5. In Supabase Auth, create user(s) for your admin email(s) and set passwords.

If using Supabase CLI:

```bash
npx supabase db reset
psql "$SUPABASE_DB_URL" -f supabase/verify_read_isolation.sql
```

`supabase db reset` requires Docker Desktop running locally.

## 3) Security model

- Admin pages are protected server-side with Supabase session checks.
- Admin action handlers validate auth on the server before mutations.
- RLS enabled on all portfolio tables.
- Write access is restricted to emails in `public.admin_emails` via `public.is_admin_email()`.
- Storage policies restrict upload/update/delete to admin users.
- No service-role key is used client-side.
- Portal route access is enforced by both middleware and server-side guards.

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
- Admin upload forms enforce image mime types and a 15MB file limit.
- For best results, upload pre-optimized display and thumbnail assets.

## Project structure

```text
src/app                # Routes (public + admin)
src/components         # UI and site/admin components
src/lib                # Supabase/auth/data helpers
supabase/migrations    # Schema + RLS + storage policies
supabase/seed.sql      # Starter content
```
