import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe config shared between the full Auth.js instance (src/auth.ts,
 * which needs Prisma + bcrypt and can't run on the edge) and middleware.ts
 * (which runs on the edge and only needs the `authorized` callback).
 *
 * Keep this file free of Node-only imports (no @prisma/client, no bcryptjs).
 */
export const authConfig = {
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  providers: [], // populated in src/auth.ts
  callbacks: {
    // Profile pages are public (readable by anyone, anilist-style);
    // ownership checks for mutations happen in the server actions
    // themselves. Middleware here just keeps the session cookie fresh.
    authorized() {
      return true;
    },
  },
} satisfies NextAuthConfig;
