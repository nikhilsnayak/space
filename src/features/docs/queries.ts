import { redirect } from 'next/navigation';
import { Result } from 'better-result';

import { getSession } from '~/lib/auth';
import { db } from '~/lib/db';

export async function getRecentlyUpdatedDocuments() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const result = await Result.tryPromise(() => {
    return db.query.Document.findMany({
      orderBy: { updatedAt: 'desc' },
      limit: 10,
      columns: {
        id: true,
        name: true,
        updatedAt: true,
      },
    });
  });

  return Result.serialize(result);
}

export async function findDocument(id: string) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const result = await Result.tryPromise(() => {
    return db.query.Document.findFirst({
      where: { id },
    });
  });

  return Result.serialize(result);
}
