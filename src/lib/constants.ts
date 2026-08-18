/**
 * Mirrors the `ListStatus` enum in prisma/schema.prisma. Kept as a plain
 * string union (instead of importing from @prisma/client) so client
 * components don't pull the Prisma client into the browser bundle.
 */
export const LIST_STATUSES = [
  "PLANNING",
  "WATCHING",
  "COMPLETED",
  "DROPPED",
  "ON_HOLD",
] as const;

export type ListStatusValue = (typeof LIST_STATUSES)[number];

export const LIST_STATUS_LABELS: Record<ListStatusValue, string> = {
  PLANNING: "Plan to Watch",
  WATCHING: "Watching",
  COMPLETED: "Completed",
  DROPPED: "Dropped",
  ON_HOLD: "On Hold",
};
