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
    () => ({
      message: 'Something went wrong',
    })
  );
}
