/**
 * Thin server-side client for TMDB (themoviedb.org). Only ever import this
 * from server components, route handlers, or server actions — TMDB_API_KEY
 * must never reach the browser bundle.
 *
 * Get a free key at https://www.themoviedb.org/settings/api
 */

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

export type TmdbMediaType = "movie" | "tv";

export interface TmdbTitleSummary {
  tmdbId: number;
  mediaType: TmdbMediaType;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  voteAverage: number;
}

export interface TmdbTitleDetail extends TmdbTitleSummary {
  originalTitle: string | null;
  runtime: number | null;
  genres: string[];
}

function apiKey(): string {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw new Error(
      "TMDB_API_KEY is not set. Add it to your .env file (see .env.example)."
    );
  }
  return key;
}

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", apiKey());
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  // TMDB catalog data changes rarely; cache aggressively at the fetch layer
  // and let Next.js's data cache handle revalidation.
  const res = await fetch(url.toString(), {
    next: { revalidate: 60 * 60 * 12 }, // 12h
  });

  if (!res.ok) {
    throw new Error(`TMDB request failed (${res.status}): ${path}`);
  }

  return res.json() as Promise<T>;
}

export function tmdbImageUrl(
  path: string | null | undefined,
  size: "w200" | "w342" | "w500" | "w780" | "original" = "w500"
): string | null {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
}

interface TmdbRawResult {
  id: number;
  media_type?: TmdbMediaType;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
}

function normalizeSummary(raw: TmdbRawResult, fallbackType: TmdbMediaType): TmdbTitleSummary {
  return {
    tmdbId: raw.id,
    mediaType: raw.media_type ?? fallbackType,
    title: raw.title ?? raw.name ?? "Untitled",
    overview: raw.overview,
    posterPath: raw.poster_path,
    backdropPath: raw.backdrop_path,
    releaseDate: raw.release_date ?? raw.first_air_date ?? null,
    voteAverage: raw.vote_average,
  };
}

export async function discover(
  mediaType: TmdbMediaType,
  opts: { page?: number; sortBy?: string } = {}
): Promise<TmdbTitleSummary[]> {
  const data = await tmdbFetch<{ results: TmdbRawResult[] }>(`/discover/${mediaType}`, {
    page: String(opts.page ?? 1),
    sort_by: opts.sortBy ?? "popularity.desc",
    include_adult: "false",
  });
  return data.results.map((r) => normalizeSummary(r, mediaType));
}

export async function trending(
  window: "day" | "week" = "week"
): Promise<TmdbTitleSummary[]> {
  const data = await tmdbFetch<{ results: TmdbRawResult[] }>(`/trending/all/${window}`);
  return data.results
    .filter((r) => r.media_type === "movie" || r.media_type === "tv")
    .map((r) => normalizeSummary(r, r.media_type as TmdbMediaType));
}

export async function search(query: string): Promise<TmdbTitleSummary[]> {
  if (!query.trim()) return [];
  const data = await tmdbFetch<{ results: TmdbRawResult[] }>("/search/multi", {
    query,
    include_adult: "false",
  });
  return data.results
    .filter((r) => r.media_type === "movie" || r.media_type === "tv")
    .map((r) => normalizeSummary(r, r.media_type as TmdbMediaType));
}

interface TmdbRawDetail extends TmdbRawResult {
  original_title?: string;
  original_name?: string;
  runtime?: number;
  episode_run_time?: number[];
  genres: { id: number; name: string }[];
}

export async function getDetail(
  mediaType: TmdbMediaType,
  tmdbId: number
): Promise<TmdbTitleDetail> {
  const raw = await tmdbFetch<TmdbRawDetail>(`/${mediaType}/${tmdbId}`);
  return {
    ...normalizeSummary(raw, mediaType),
    originalTitle: raw.original_title ?? raw.original_name ?? null,
    runtime: raw.runtime ?? raw.episode_run_time?.[0] ?? null,
    genres: raw.genres.map((g) => g.name),
  };
}
