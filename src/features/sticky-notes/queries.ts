import { createServerFn } from '@tanstack/react-start';
import { sql } from 'drizzle-orm';
import z from 'zod';

import { db } from '~/lib/db';

export const findStickyNotesBoardForDate = createServerFn()
  .inputValidator(z.object({ date: z.string() }))
  .handler(async ({ data }) => {
    const { date } = data;
    const row = await db.query.StickyNotesBoard.findFirst({
      where: { date },
    });
    return row?.notes ?? [];
  });

export const getStickyNotesBoards = createServerFn().handler(async () => {
  const rows = await db.query.StickyNotesBoard.findMany({
    columns: {
      date: true,
    },
    where: {
      AND: [
        {
          notes: {
            isNotNull: true,
          },
        },
        {
          RAW: (table_1) =>
            sql`jsonb_array_length((${table_1.notes})::jsonb) > 0`,
        },
      ],
    },
    orderBy: {
      date: 'desc',
    },
  });

  const boards = rows.map((row) => row.date);
  return { boards };
});
