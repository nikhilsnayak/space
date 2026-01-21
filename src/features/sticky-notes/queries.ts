import { redirect } from 'next/navigation';
import { Result } from 'better-result';
import { sql } from 'drizzle-orm';

import { getSession } from '~/lib/auth';
import { db } from '~/lib/db';

export async function findStickyNotesBoardForDate(date: string) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const row = await Result.tryPromise(() => {
    return db.query.StickyNotesBoard.findFirst({
      where: { date },
    });
  });

  return Result.serialize(row.map((row) => row?.notes ?? []));
}

export async function getStickyNotesBoards() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const rows = await Result.tryPromise(() => {
    return db.query.StickyNotesBoard.findMany({
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
            RAW: (table) =>
              sql`jsonb_array_length((${table.notes})::jsonb) > 0`,
          },
        ],
      },
      orderBy: {
        date: 'desc',
      },
    });
  });

  return Result.serialize(rows.map((row) => row.map((row) => row.date)));
}
