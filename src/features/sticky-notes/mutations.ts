import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import { NoteSchema, StickyNotesBoard } from './schema';
import { db } from '~/lib/db';

export const upsertStickyNotesForDate = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      date: z.string(),
      notes: z.array(NoteSchema),
    })
  )
  .handler(async ({ data }) => {
    const { date, notes } = data;

    return db
      .insert(StickyNotesBoard)
      .values({
        date,
        notes,
      })
      .onConflictDoUpdate({
        target: StickyNotesBoard.date,
        set: { notes },
      })
      .returning({ notes: StickyNotesBoard.notes })
      .then((rows) => rows[0].notes);
  });
