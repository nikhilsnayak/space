import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import { db } from '~/lib/db';

export const findStickyNotesBoardForDate = createServerFn()
  .inputValidator(z.object({ date: z.string() }))
  .handler(async ({ data }) => {
    const { date } = data;
    return db.query.StickyNotesBoard.findFirst({
      where: { date },
    }).then((row) => row?.notes ?? []);
  });

export const getStickyNotesBoards = createServerFn()
  .inputValidator(
    z
      .object({ limit: z.number().optional(), cursor: z.string().optional() })
      .optional()
  )
  .handler(async ({ data }) => {
    const { limit = 10 } = data ?? {};
    return db.query.StickyNotesBoard.findMany({
      columns: {
        date: true,
      },
      orderBy: {
        date: 'desc',
      },
      // limit: limit + 1,
      // where: cursor
      //   ? {
      //       date: {
      //         lt: cursor,
      //       },
      //     }
      //   : undefined,
    }).then((rows) => {
      const boards = rows.slice(0, limit).map((row) => row.date);
      // const hasNextPage = rows.length > limit;
      // const nextCursor = hasNextPage ? boards.at(-1) : null;
      return {
        boards,
        // nextCursor,
        // hasNextPage,
      };
    });
  });
