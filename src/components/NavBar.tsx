import Link from "next/link";
import { Suspense } from "react";
import { Clapperboard } from "lucide-react";

import { auth } from "@/auth";
import SearchBar from "@/components/SearchBar";
import SignOutButton from "@/components/SignOutButton";

export default async function NavBar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-base-700/60 bg-base-950/90 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-6">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-bold text-white">
          <Clapperboard size={22} className="text-accent" />
          <span className="hidden sm:inline">MochaMovies</span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-300 md:flex">
          <Link href="/?type=movie" className="transition hover:text-white">
            Movies
          </Link>
          <Link href="/?type=tv" className="transition hover:text-white">
            TV Shows
          </Link>
          {session?.user && (
            <Link href={`/profile/${session.user.username}`} className="transition hover:text-white">
              My Lists
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Suspense fallback={<div className="h-9 w-64" />}>
            <SearchBar />
          </Suspense>

          {session?.user ? (
            <div className="flex items-center gap-2">
              <Link
                href={`/profile/${session.user.username}`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-base-950"
                title={session.user.username}
              >
                {session.user.username.slice(0, 2).toUpperCase()}
              </Link>
              <SignOutButton />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/sign-in" className="btn-secondary">
                Sign in
              </Link>
              <Link href="/sign-up" className="btn-primary">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
