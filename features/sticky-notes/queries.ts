import { cacheTag } from 'next/cache';
import { ResultAsync } from 'neverthrow';

import { db } from '~/lib/db';

import { CACHE_PREFIX } from './constants';

async function CACHED_findStickyNotesBoardForDate(date: string) {
  'use cache';

  cacheTag(`${CACHE_PREFIX}:${date}`);

  return db.query.StickyNotesBoard.findFirst({
    where: { date },
  });
}

export function findStickyNotesBoardForDate(date: string) {
  return ResultAsync.fromPromise(
    CACHED_findStickyNotesBoardForDate(date),
    (err) => {
      console.error(err);
      return {
        message: 'Something went wrong',
      };
    }
  );
}

export function getStickyNotesBoards({
  limit = 10,
  // cursor,
}: { limit?: number; cursor?: string } = {}) {
  return ResultAsync.fromPromise(
    db.query.StickyNotesBoard.findMany({
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
    }),
    (err) => {
      console.error(err);
      return {
        message: 'Something went wrong',
      };
    }
  );
}
