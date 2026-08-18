# MochaMovies

A full-stack movie & TV tracker (anilist.co-inspired) built with Next.js 14
(App Router), TypeScript, Tailwind CSS, PostgreSQL + Prisma, and Auth.js.
Users can browse/search titles (via TMDB), rate them 1–10, and organize
watched/watching/planned titles into lists on their profile.

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
