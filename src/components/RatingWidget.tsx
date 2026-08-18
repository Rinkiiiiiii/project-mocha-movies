"use client";

import { useState, useTransition } from "react";
import { Star, X } from "lucide-react";

import { rateTitle, removeRating } from "@/actions/rating";
import type { TmdbMediaType } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

export default function RatingWidget({
  tmdbId,
  mediaType,
  initialScore,
  isSignedIn,
}: {
  tmdbId: number;
  mediaType: TmdbMediaType;
  initialScore: number | null;
  isSignedIn: boolean;
}) {
  const [score, setScore] = useState(initialScore);
  const [hovered, setHovered] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick(value: number) {
    if (!isSignedIn) {
      setError("Sign in to rate titles.");
      return;
    }
    const next = score === value ? null : value;
    setScore(next);
    setError(null);

    startTransition(async () => {
      const result =
        next === null
          ? await removeRating(mediaType, tmdbId)
          : await rateTitle({ tmdbId, mediaType, score: next });
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        setScore(initialScore);
      }
    });
  }

  const display = hovered ?? score ?? 0;

  return (
    <div className="card-surface p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Your Score</h3>
        {score != null && (
          <button
            onClick={() => handleClick(score)}
            className="flex items-center gap-1 text-xs text-slate-500 transition hover:text-red-400"
            disabled={isPending}
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      <div
        className="flex flex-wrap gap-1"
        onMouseLeave={() => setHovered(null)}
      >
        {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
          <button
            key={value}
            type="button"
            disabled={isPending}
            onMouseEnter={() => setHovered(value)}
            onClick={() => handleClick(value)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md text-xs font-semibold transition",
              value <= display
                ? "bg-accent text-base-950"
                : "bg-base-800 text-slate-400 hover:bg-base-700"
            )}
          >
            {value}
          </button>
        ))}
      </div>

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
