import { ResultAsync } from 'neverthrow';

import { db } from '~/lib/db';

export function findStickyNotesBoardForDate(date: string) {
  return ResultAsync.fromPromise(
    db.query.StickyNotesBoard.findFirst({
      where: { date },
    }),
    () => ({
      message: 'Something went wrong',
    })
  );
}
