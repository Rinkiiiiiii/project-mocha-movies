import Image from "next/image";
import { Star } from "lucide-react";

import { tmdbImageUrl } from "@/lib/tmdb";
import { formatYear } from "@/lib/utils";

export default function BannerHeader({
  title,
  overview,
  posterPath,
  backdropPath,
  releaseDate,
  runtime,
  genres,
  voteAverage,
  mediaTypeLabel,
}: {
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  runtime: number | null;
  genres: string[];
  voteAverage: number;
  mediaTypeLabel: string;
}) {
  const backdrop = tmdbImageUrl(backdropPath, "original");
  const poster = tmdbImageUrl(posterPath, "w500");

  return (
    <div className="relative">
      <div className="relative h-[280px] w-full overflow-hidden sm:h-[360px]">
        {backdrop ? (
          <Image src={backdrop} alt="" fill priority className="object-cover" />
        ) : (
          <div className="h-full w-full bg-base-900" />
        )}
        <div className="absolute inset-0 bg-banner-fade" />
      </div>

      <div className="container-page -mt-28 flex flex-col gap-6 pb-4 sm:-mt-36 sm:flex-row sm:items-end">
        <div className="relative aspect-[2/3] w-32 shrink-0 overflow-hidden rounded-xl2 shadow-card ring-1 ring-base-700/60 sm:w-48">
          {poster ? (
            <Image src={poster} alt={title} fill sizes="192px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-base-800 text-xs text-slate-500">
              {title}
            </div>
          )}
        </div>

        <div className="flex-1 pb-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-accent-soft">
            {mediaTypeLabel}
          </span>
          <h1 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">{title}</h1>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-300">
            <span className="flex items-center gap-1 font-semibold text-accent-soft">
              <Star size={14} className="fill-accent-soft text-accent-soft" />
              {voteAverage.toFixed(1)}
            </span>
            <span>{formatYear(releaseDate)}</span>
            {runtime && <span>{runtime} min</span>}
            {genres.length > 0 && <span className="text-slate-400">{genres.join(", ")}</span>}
          </div>

          {overview && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              {overview}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
