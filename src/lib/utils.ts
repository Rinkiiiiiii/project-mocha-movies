import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes, letting later classes win over earlier conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const STATUS_LABELS: Record<string, string> = {
  PLANNING: "Plan to Watch",
  WATCHING: "Watching",
  COMPLETED: "Completed",
  DROPPED: "Dropped",
  ON_HOLD: "On Hold",
};

export function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

export function formatYear(date: Date | string | null | undefined): string {
  if (!date) return "TBA";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "TBA";
  return String(d.getFullYear());
}

export function formatScore(score: number | null | undefined): string {
  if (score == null) return "—";
  return score.toFixed(score % 1 === 0 ? 0 : 1);
}
