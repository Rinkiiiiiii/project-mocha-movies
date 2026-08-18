"use client";

import { useState, useTransition } from "react";
import { Heart, ListPlus, Trash2 } from "lucide-react";

import { upsertListEntry, removeListEntry, toggleFavorite } from "@/actions/list";
import { LIST_STATUSES, LIST_STATUS_LABELS, type ListStatusValue } from "@/lib/constants";
import type { TmdbMediaType } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

export default function ListStatusMenu({
  tmdbId,
  mediaType,
  initialStatus,
  initialFavorite,
  isSignedIn,
}: {
  tmdbId: number;
  mediaType: TmdbMediaType;
  initialStatus: ListStatusValue | null;
  initialFavorite: boolean;
  isSignedIn: boolean;
}) {
  const [status, setStatus] = useState<ListStatusValue | null>(initialStatus);
  const [favorite, setFavorite] = useState(initialFavorite);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function requireAuth(): boolean {
    if (!isSignedIn) {
      setError("Sign in to track this title.");
      return false;
    }
    setError(null);
    return true;
  }

  function handleStatusChange(value: string) {
    if (!requireAuth()) return;

    if (value === "") {
      const prev = status;
      setStatus(null);
      startTransition(async () => {
        const result = await removeListEntry(mediaType, tmdbId);
        if (!result.ok) setStatus(prev);
      });
      return;
    }

    const next = value as ListStatusValue;
    setStatus(next);
    startTransition(async () => {
      const result = await upsertListEntry({ tmdbId, mediaType, status: next });
      if (!result.ok) setError(result.error ?? "Something went wrong.");
    });
  }

  function handleFavoriteToggle() {
    if (!requireAuth()) return;
    setFavorite((f) => !f);
    startTransition(async () => {
      const result = await toggleFavorite(mediaType, tmdbId);
      if (!result.ok) {
        setFavorite((f) => !f);
        setError(result.error ?? "Something went wrong.");
      }
    });
  }

  return (
    <div className="card-surface p-4">
      <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-200">
        <ListPlus size={15} /> Your List
      </h3>

      <div className="flex items-center gap-2">
        <select
          value={status ?? ""}
          disabled={isPending}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="input-field flex-1"
        >
          <option value="">Not tracked</option>
          {LIST_STATUSES.map((s) => (
            <option key={s} value={s}>
              {LIST_STATUS_LABELS[s]}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleFavoriteToggle}
          disabled={isPending}
          title={favorite ? "Remove from favorites" : "Add to favorites"}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition",
            favorite
              ? "border-favorite bg-favorite/15 text-favorite"
              : "border-base-600 bg-base-900 text-slate-400 hover:text-favorite"
          )}
        >
          <Heart size={16} className={favorite ? "fill-favorite" : ""} />
        </button>

        {status && (
          <button
            type="button"
            onClick={() => handleStatusChange("")}
            disabled={isPending}
            title="Remove from list"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-base-600 bg-base-900 text-slate-400 transition hover:text-red-400"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
