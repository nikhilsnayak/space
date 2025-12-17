import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import { db } from '~/lib/db';
import { asJsonb } from '~/lib/db/utils';

import { NoteSchema, StickyNotesBoard } from './schema';

export const upsertStickyNotesForDate = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      date: z.string(),
      notes: z.array(NoteSchema),
    })
  )
  .handler(async ({ data }) => {
    const { date } = data;

    const notes = asJsonb(data.notes);

    const [returning] = await db
      .insert(StickyNotesBoard)
      .values({
        date,
        notes,
      })
      .onConflictDoUpdate({
        target: StickyNotesBoard.date,
        set: { notes },
      })
      .returning({ notes: StickyNotesBoard.notes });

    return returning.notes;
  });
