# MochaMovies

A full-stack movie & TV tracker (anilist.co-inspired) built with Next.js 14
(App Router), TypeScript, Tailwind CSS, PostgreSQL + Prisma, and Auth.js.
Users can browse/search titles (via TMDB), rate them 1–10, and organize
watched/watching/planned titles into lists on their profile.

This is phase 1 of the project: **architecture, server/frontend wiring,
authentication, and data storage.** Recommendation engine, social features,
episode-level tracking, etc. are intentionally out of scope for now.

## Stack

- **Framework:** Next.js 14 (App Router), TypeScript, React 18
- **Styling:** Tailwind CSS, dark anilist-style UI
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** Auth.js (NextAuth v5) — email/password (Credentials provider),
  Prisma adapter, JWT sessions
- **Movie/TV data:** [TMDB API](https://www.themoviedb.org/documentation/api)
  — fetched on demand and cached into Postgres (`Title` table) the first
  time a title is viewed, rated, or listed

## Project structure

```
prisma/
  schema.prisma        # User/Account/Session (auth) + Title/Rating/ListEntry (app)
  seed.ts               # optional demo user seed
src/
  auth.ts               # Auth.js config (Credentials provider, Prisma adapter)
  auth.config.ts         # edge-safe subset used by middleware.ts
  middleware.ts
  lib/
    prisma.ts            # singleton Prisma client
    tmdb.ts               # server-only TMDB API client
    titles.ts             # upserts TMDB titles into local Postgres cache
    validation.ts          # zod schemas
    constants.ts            # ListStatus values shared with client components
  actions/                 # server actions (rate, list, auth)
  components/               # NavBar, TitleCard/Grid, RatingWidget, ListStatusMenu, forms...
  app/
    page.tsx                 # home (trending / popular)
    search/page.tsx
    (auth)/sign-in, sign-up
    title/[mediaType]/[id]/page.tsx   # detail page with rating + list widgets
    profile/[username]/page.tsx        # public profile with tabs (lists/favorites/rated)
    api/auth/[...nextauth]/route.ts
    api/auth/register/route.ts
```

## Getting started

### 1. Prerequisites

- Node.js 20+
- A PostgreSQL database — any of these work:
  - Local Postgres (`brew install postgresql` / Docker: `docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres`)
  - A free hosted instance ([Neon](https://neon.tech), [Supabase](https://supabase.com), [Railway](https://railway.app))
- A free [TMDB API key](https://www.themoviedb.org/settings/api) (v3 auth key)

### 2. Install dependencies

```bash
npm install
```

(`postinstall` runs `prisma generate` automatically.)

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in:

- `DATABASE_URL` — your Postgres connection string
- `AUTH_SECRET` — generate with `npx auth secret` (or `openssl rand -base64 33`)
- `TMDB_API_KEY` — from your TMDB account settings

### 4. Set up the database

```bash
npm run prisma:migrate   # creates tables from prisma/schema.prisma
npm run db:seed          # optional: creates demo@mochamovies.tv / password123
```

### 5. Run the dev server

```bash
npm run dev
```

Visit http://localhost:3000.

## How the data model fits together

- **`User`** — auth identity (username, email, hashed password). `Account`/
  `Session`/`VerificationToken` are Auth.js's required tables (ready for
  OAuth providers later, even though only Credentials is wired up now).
- **`Title`** — a local cache of a TMDB movie or TV show, keyed by
  `(tmdbId, mediaType)`. Created lazily the first time a user views, rates,
  or lists it, and refreshed if the cached copy is >12h old.
- **`Rating`** — one row per `(user, title)`, a 1–10 score plus optional
  review text.
- **`ListEntry`** — one row per `(user, title)`, tracking watch `status`
  (`PLANNING` / `WATCHING` / `COMPLETED` / `DROPPED` / `ON_HOLD`) and a
  `favorite` flag, independent of whether it's been rated.

## Notes / things to revisit next

- Only Credentials auth is implemented. The schema already supports OAuth
  providers (Google, GitHub, etc.) via Auth.js's Prisma adapter — add a
  provider in `src/auth.ts` when ready.
- No image upload for avatars yet — profile avatars are letter initials.
- No rate limiting on `/api/auth/register` or the Credentials authorize
  callback — add before going to production.
- `mochamovies.tv` domain/deployment (Vercel + hosted Postgres) isn't wired
  up yet — this repo is runnable locally only for now.
