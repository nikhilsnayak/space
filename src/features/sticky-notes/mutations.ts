import { createServerFn } from '@tanstack/react-start';
import { Param, sql } from 'drizzle-orm';
import z from 'zod';

import { db } from '~/lib/db';

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

    // https://github.com/drizzle-team/drizzle-orm/issues/724#issuecomment-2679491232
    const notes = sql`${new Param(data.notes)}::jsonb`;

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
