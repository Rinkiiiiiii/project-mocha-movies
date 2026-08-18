import { MediaType, type Title } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getDetail, type TmdbMediaType } from "@/lib/tmdb";

function toMediaType(mediaType: TmdbMediaType): MediaType {
  return mediaType === "movie" ? MediaType.MOVIE : MediaType.TV;
}

/**
 * Ensures a TMDB title exists in our local Postgres cache and returns the
 * local row. Ratings and list entries store a foreign key to Title.id
 * (not the raw TMDB id) so we have a stable local identity even if TMDB
 * data changes shape.
 */
export async function ensureLocalTitle(
  mediaType: TmdbMediaType,
  tmdbId: number
): Promise<Title> {
  const existing = await prisma.title.findUnique({
    where: { tmdbId_mediaType: { tmdbId, mediaType: toMediaType(mediaType) } },
  });

  // Refresh cache if we've never seen it, or it's more than 12h stale.
  const isStale =
    !existing || Date.now() - existing.updatedAt.getTime() > 12 * 60 * 60 * 1000;

  if (!isStale && existing) {
    return existing;
  }

  const detail = await getDetail(mediaType, tmdbId);

  return prisma.title.upsert({
    where: { tmdbId_mediaType: { tmdbId, mediaType: toMediaType(mediaType) } },
    update: {
      title: detail.title,
      originalTitle: detail.originalTitle,
      overview: detail.overview,
      posterPath: detail.posterPath,
      backdropPath: detail.backdropPath,
      releaseDate: detail.releaseDate ? new Date(detail.releaseDate) : null,
      runtime: detail.runtime,
      genres: detail.genres,
      tmdbVoteAvg: detail.voteAverage,
    },
    create: {
      tmdbId,
      mediaType: toMediaType(mediaType),
      title: detail.title,
      originalTitle: detail.originalTitle,
      overview: detail.overview,
      posterPath: detail.posterPath,
      backdropPath: detail.backdropPath,
      releaseDate: detail.releaseDate ? new Date(detail.releaseDate) : null,
      runtime: detail.runtime,
      genres: detail.genres,
      tmdbVoteAvg: detail.voteAverage,
    },
  });
}
