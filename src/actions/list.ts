"use server";

import { revalidatePath } from "next/cache";
import { ListStatus } from "@prisma/client";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ensureLocalTitle } from "@/lib/titles";
import type { TmdbMediaType } from "@/lib/tmdb";
import type { ActionResult } from "@/actions/rating";

export interface UpsertListEntryInput {
  tmdbId: number;
  mediaType: TmdbMediaType;
  status: ListStatus;
  progress?: number;
}

export async function upsertListEntry(
  input: UpsertListEntryInput
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "You must be signed in to track titles." };
  }

  const title = await ensureLocalTitle(input.mediaType, input.tmdbId);

  await prisma.listEntry.upsert({
    where: { userId_titleId: { userId: session.user.id, titleId: title.id } },
    update: { status: input.status, progress: input.progress },
    create: {
      userId: session.user.id,
      titleId: title.id,
      status: input.status,
      progress: input.progress,
    },
  });

  revalidatePath(`/title/${input.mediaType}/${input.tmdbId}`);
  revalidatePath(`/profile/${session.user.username}`);

  return { ok: true };
}

export async function toggleFavorite(
  mediaType: TmdbMediaType,
  tmdbId: number
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "You must be signed in to favorite titles." };
  }

  const title = await ensureLocalTitle(mediaType, tmdbId);

  const existing = await prisma.listEntry.findUnique({
    where: { userId_titleId: { userId: session.user.id, titleId: title.id } },
  });

  await prisma.listEntry.upsert({
    where: { userId_titleId: { userId: session.user.id, titleId: title.id } },
    update: { favorite: !existing?.favorite },
    create: {
      userId: session.user.id,
      titleId: title.id,
      status: ListStatus.PLANNING,
      favorite: true,
    },
  });

  revalidatePath(`/title/${mediaType}/${tmdbId}`);
  revalidatePath(`/profile/${session.user.username}`);

  return { ok: true };
}

export async function removeListEntry(
  mediaType: TmdbMediaType,
  tmdbId: number
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "You must be signed in." };
  }

  const title = await ensureLocalTitle(mediaType, tmdbId);

  await prisma.listEntry
    .delete({
      where: { userId_titleId: { userId: session.user.id, titleId: title.id } },
    })
    .catch(() => null);

  revalidatePath(`/title/${mediaType}/${tmdbId}`);
  revalidatePath(`/profile/${session.user.username}`);

  return { ok: true };
}
