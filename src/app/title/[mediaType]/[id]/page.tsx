import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getDetail, type TmdbMediaType } from "@/lib/tmdb";
import { ensureLocalTitle } from "@/lib/titles";
import BannerHeader from "@/components/BannerHeader";
import RatingWidget from "@/components/RatingWidget";
import ListStatusMenu from "@/components/ListStatusMenu";
import type { ListStatusValue } from "@/lib/constants";

interface PageProps {
  params: { mediaType: string; id: string };
}

function parseMediaType(value: string): TmdbMediaType | null {
  return value === "movie" || value === "tv" ? value : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const mediaType = parseMediaType(params.mediaType);
  const tmdbId = Number(params.id);
  if (!mediaType || Number.isNaN(tmdbId)) return {};

  try {
    const detail = await getDetail(mediaType, tmdbId);
    return { title: detail.title };
  } catch {
    return {};
  }
}

export default async function TitleDetailPage({ params }: PageProps) {
  const mediaType = parseMediaType(params.mediaType);
  const tmdbId = Number(params.id);
  if (!mediaType || Number.isNaN(tmdbId)) notFound();

  let detail;
  try {
    detail = await getDetail(mediaType, tmdbId);
  } catch {
    notFound();
  }

  const session = await auth();

  // Warm the local cache so rating/list widgets have a stable local id to
  // read/write against, and so we can look up the current user's state.
  const localTitle = await ensureLocalTitle(mediaType, tmdbId);

  let userRatingScore: number | null = null;
  let userListStatus: ListStatusValue | null = null;
  let userFavorite = false;

  if (session?.user) {
    const [rating, listEntry] = await Promise.all([
      prisma.rating.findUnique({
        where: { userId_titleId: { userId: session.user.id, titleId: localTitle.id } },
      }),
      prisma.listEntry.findUnique({
        where: { userId_titleId: { userId: session.user.id, titleId: localTitle.id } },
      }),
    ]);
    userRatingScore = rating?.score ?? null;
    userListStatus = (listEntry?.status as ListStatusValue) ?? null;
    userFavorite = listEntry?.favorite ?? false;
  }

  return (
    <div>
      <BannerHeader
        title={detail.title}
        overview={detail.overview}
        posterPath={detail.posterPath}
        backdropPath={detail.backdropPath}
        releaseDate={detail.releaseDate}
        runtime={detail.runtime}
        genres={detail.genres}
        voteAverage={detail.voteAverage}
        mediaTypeLabel={mediaType === "movie" ? "Movie" : "TV Series"}
      />

      <div className="container-page mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-md">
        <RatingWidget
          tmdbId={tmdbId}
          mediaType={mediaType}
          initialScore={userRatingScore}
          isSignedIn={!!session?.user}
        />
        <ListStatusMenu
          tmdbId={tmdbId}
          mediaType={mediaType}
          initialStatus={userListStatus}
          initialFavorite={userFavorite}
          isSignedIn={!!session?.user}
        />
      </div>
    </div>
  );
}
