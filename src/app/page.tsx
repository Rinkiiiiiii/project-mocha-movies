import { discover, trending } from "@/lib/tmdb";
import TitleGrid from "@/components/TitleGrid";
import SectionHeading from "@/components/SectionHeading";

export const revalidate = 3600; // 1 hour

export default async function HomePage({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  const type = searchParams.type;

  if (type === "movie") {
    const movies = await discover("movie");
    return (
      <div className="container-page pt-8">
        <SectionHeading title="Popular Movies" />
        <TitleGrid titles={movies} />
      </div>
    );
  }

  if (type === "tv") {
    const shows = await discover("tv");
    return (
      <div className="container-page pt-8">
        <SectionHeading title="Popular TV Shows" />
        <TitleGrid titles={shows} />
      </div>
    );
  }

  const [trendingTitles, popularMovies, popularShows] = await Promise.all([
    trending("week"),
    discover("movie"),
    discover("tv"),
  ]);

  return (
    <div>
      <div className="border-b border-base-700/40 bg-gradient-to-b from-base-900 to-base-950 pb-10 pt-12">
        <div className="container-page">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Track everything you watch.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-400 sm:text-base">
            Rate movies and shows, mark what you&apos;ve completed, and build
            lists for what&apos;s next — all in one place.
          </p>
        </div>
      </div>

      <div className="container-page space-y-12 pt-10">
        <section>
          <SectionHeading title="Trending This Week" />
          <TitleGrid titles={trendingTitles} />
        </section>

        <section>
          <SectionHeading title="Popular Movies" subtitle="See all →" />
          <TitleGrid titles={popularMovies.slice(0, 12)} />
        </section>

        <section>
          <SectionHeading title="Popular TV Shows" subtitle="See all →" />
          <TitleGrid titles={popularShows.slice(0, 12)} />
        </section>
      </div>
    </div>
  );
}
