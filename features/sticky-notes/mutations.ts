'use server';

import { revalidateTag } from 'next/cache';
import { ResultAsync } from 'neverthrow';
import z from 'zod';

import { db } from '~/lib/db';

import { CACHE_PREFIX } from './constants';
import { NoteSchema, StickyNotesBoard, type Note } from './schema';

export async function upsertStickyNotesForDate(date: string, notes: Note[]) {
  const parsed = z.array(NoteSchema).safeParse(notes);

  if (!parsed.success) {
    return { type: 'error', message: 'Invalid notes' } as const;
  }

  const result = await ResultAsync.fromPromise(
    db
      .insert(StickyNotesBoard)
      .values({
        date,
        notes: parsed.data,
      })
      .onConflictDoUpdate({
        target: StickyNotesBoard.date,
        set: { notes: parsed.data },
      })
      .returning({ notes: StickyNotesBoard.notes })
      .then((rows) => rows[0].notes),
    () => ({ message: 'Error updating notes' })
  );

  if (result.isErr()) {
    return { type: 'error', message: result.error.message } as const;
  }

  revalidateTag(`${CACHE_PREFIX}:${date}`, 'max');

  return {
    type: 'success',
    message: 'Notes updated successfully',
    updatedNotes: result.value,
  } as const;
}
