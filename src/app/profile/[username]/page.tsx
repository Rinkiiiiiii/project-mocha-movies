import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Heart, Star } from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import TitleGrid from "@/components/TitleGrid";
import SectionHeading from "@/components/SectionHeading";
import { LIST_STATUSES, LIST_STATUS_LABELS, type ListStatusValue } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { TitleCardData } from "@/components/TitleCard";
import type { Title } from "@prisma/client";

interface PageProps {
  params: { username: string };
  searchParams: { tab?: string };
}

function toCardData(title: Title): TitleCardData {
  return {
    tmdbId: title.tmdbId,
    mediaType: title.mediaType.toLowerCase() as "movie" | "tv",
    title: title.title,
    posterPath: title.posterPath,
    releaseDate: title.releaseDate ? title.releaseDate.toISOString() : null,
    voteAverage: title.tmdbVoteAvg ?? 0,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return { title: `${params.username}'s Profile` };
}

export default async function ProfilePage({ params, searchParams }: PageProps) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
  });
  if (!user) notFound();

  const session = await auth();
  const isOwnProfile = session?.user?.id === user.id;

  const tab = (searchParams.tab ?? "ALL") as ListStatusValue | "ALL" | "FAVORITES" | "RATED";

  const [listEntries, ratings] = await Promise.all([
    prisma.listEntry.findMany({
      where: { userId: user.id },
      include: { title: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.rating.findMany({
      where: { userId: user.id },
      include: { title: true },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const favorites = listEntries.filter((e) => e.favorite);

  let visibleTitles: TitleCardData[];
  if (tab === "FAVORITES") {
    visibleTitles = favorites.map((e) => toCardData(e.title));
  } else if (tab === "RATED") {
    visibleTitles = ratings.map((r) => toCardData(r.title));
  } else if (tab === "ALL") {
    visibleTitles = listEntries.map((e) => toCardData(e.title));
  } else {
    visibleTitles = listEntries
      .filter((e) => e.status === tab)
      .map((e) => toCardData(e.title));
  }

  const tabs: { key: string; label: string; count: number }[] = [
    { key: "ALL", label: "All", count: listEntries.length },
    ...LIST_STATUSES.map((s) => ({
      key: s,
      label: LIST_STATUS_LABELS[s],
      count: listEntries.filter((e) => e.status === s).length,
    })),
    { key: "FAVORITES", label: "Favorites", count: favorites.length },
    { key: "RATED", label: "Rated", count: ratings.length },
  ];

  return (
    <div className="container-page pt-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-xl font-bold text-base-950">
          {user.username.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">
            {user.name || user.username}
            {isOwnProfile && (
              <span className="ml-2 text-xs font-normal text-slate-500">(you)</span>
            )}
          </h1>
          <p className="text-sm text-slate-500">@{user.username}</p>
          {user.bio && <p className="mt-1 max-w-md text-sm text-slate-400">{user.bio}</p>}
        </div>
        <div className="ml-auto hidden gap-6 text-center sm:flex">
          <Stat label="Ratings" value={ratings.length} icon={<Star size={14} />} />
          <Stat label="Favorites" value={favorites.length} icon={<Heart size={14} />} />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-base-700/50 pb-4">
        {tabs.map((t) => (
          <a
            key={t.key}
            href={`?tab=${t.key}`}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition",
              tab === t.key || (tab === undefined && t.key === "ALL")
                ? "bg-accent text-base-950"
                : "bg-base-800 text-slate-300 hover:bg-base-700"
            )}
          >
            {t.label} <span className="opacity-70">({t.count})</span>
          </a>
        ))}
      </div>

      <SectionHeading title={tabs.find((t) => t.key === tab)?.label ?? "All"} />
      <TitleGrid
        titles={visibleTitles}
        emptyMessage={
          isOwnProfile
            ? "Nothing here yet — go rate or track something!"
            : "Nothing here yet."
        }
      />
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-center gap-1 text-lg font-bold text-white">
        {icon}
        {value}
      </div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}
