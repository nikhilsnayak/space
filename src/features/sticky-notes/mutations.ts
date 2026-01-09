'use server';

import { redirect } from 'next/navigation';
import z from 'zod';

import { getSession } from '~/lib/auth';
import { db } from '~/lib/db';
import { asJsonb } from '~/lib/db/utils';

import { NoteSchema, StickyNotesBoard } from './schema';

const UpsertStickyNotesForDateInputValidator = z.object({
  date: z.string(),
  notes: z.array(NoteSchema),
});

export async function upsertStickyNotesForDate(
  data: z.infer<typeof UpsertStickyNotesForDateInputValidator>
) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const { date, notes } = UpsertStickyNotesForDateInputValidator.parse(data);

  const [returning] = await db
    .insert(StickyNotesBoard)
    .values({
      date,
      notes: asJsonb(notes),
    })
    .onConflictDoUpdate({
      target: StickyNotesBoard.date,
      set: { notes: asJsonb(notes) },
    })
    .returning({ notes: StickyNotesBoard.notes });

  return returning.notes;
}
