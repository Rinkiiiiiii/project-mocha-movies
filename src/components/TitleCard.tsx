import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

import { tmdbImageUrl, type TmdbMediaType } from "@/lib/tmdb";
import { formatYear } from "@/lib/utils";

export interface TitleCardData {
  tmdbId: number;
  mediaType: TmdbMediaType;
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
  voteAverage: number;
}

export default function TitleCard({ title }: { title: TitleCardData }) {
  const poster = tmdbImageUrl(title.posterPath, "w342");

  return (
    <Link
      href={`/title/${title.mediaType}/${title.tmdbId}`}
      className="group block w-full"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl2 bg-base-800 shadow-card ring-1 ring-base-700/60 transition duration-200 group-hover:ring-accent/70 group-hover:shadow-lg">
        {poster ? (
          <Image
            src={poster}
            alt={title.title}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 15vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-base-800 p-3 text-center text-xs text-slate-500">
            {title.title}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-base-950/90 via-base-950/10 to-transparent opacity-0 transition group-hover:opacity-100" />

        <div className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-md bg-base-950/80 px-1.5 py-0.5 text-[11px] font-semibold text-accent-soft backdrop-blur">
          <Star size={11} className="fill-accent-soft text-accent-soft" />
          {title.voteAverage.toFixed(1)}
        </div>

        <span className="absolute bottom-1.5 right-1.5 rounded-md bg-base-950/80 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-300 backdrop-blur">
          {title.mediaType === "movie" ? "Movie" : "TV"}
        </span>
      </div>

      <p className="mt-2 line-clamp-2 text-sm font-medium text-slate-100 transition group-hover:text-accent-soft">
        {title.title}
      </p>
      <p className="text-xs text-slate-500">{formatYear(title.releaseDate)}</p>
    </Link>
  );
}
