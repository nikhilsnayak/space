'use server';

import { redirect } from 'next/navigation';
import { Result } from 'better-result';
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

  const result = await Result.gen(async function* () {
    const { date, notes } = yield* Result.try(() => {
      return UpsertStickyNotesForDateInputValidator.parse(data);
    });

    const [returning] = yield* Result.await(
      Result.tryPromise(() => {
        return db
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
      })
    );

    return Result.ok(returning.notes);
  });

  if (result.isErr()) {
    console.error(result.error);
  }

  return Result.serialize(result);
}
