"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ensureLocalTitle } from "@/lib/titles";
import type { TmdbMediaType } from "@/lib/tmdb";

export interface RateTitleInput {
  tmdbId: number;
  mediaType: TmdbMediaType;
  score: number; // 1-10
  review?: string;
}

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function rateTitle(input: RateTitleInput): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "You must be signed in to rate titles." };
  }

  if (!Number.isInteger(input.score) || input.score < 1 || input.score > 10) {
    return { ok: false, error: "Score must be an integer from 1 to 10." };
  }

  const title = await ensureLocalTitle(input.mediaType, input.tmdbId);

  await prisma.rating.upsert({
    where: { userId_titleId: { userId: session.user.id, titleId: title.id } },
    update: { score: input.score, review: input.review ?? null },
    create: {
      userId: session.user.id,
      titleId: title.id,
      score: input.score,
      review: input.review ?? null,
    },
  });

  revalidatePath(`/title/${input.mediaType}/${input.tmdbId}`);
  revalidatePath(`/profile/${session.user.username}`);

  return { ok: true };
}

export async function removeRating(
  mediaType: TmdbMediaType,
  tmdbId: number
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "You must be signed in." };
  }

  const title = await ensureLocalTitle(mediaType, tmdbId);

  await prisma.rating
    .delete({
      where: { userId_titleId: { userId: session.user.id, titleId: title.id } },
    })
    .catch(() => null); // no-op if it doesn't exist

  revalidatePath(`/title/${mediaType}/${tmdbId}`);
  revalidatePath(`/profile/${session.user.username}`);

  return { ok: true };
}
