import { redirect } from 'next/navigation';

import { getSession } from '~/lib/auth';
import { db } from '~/lib/db';

export async function getRecentlyUpdatedDocuments() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return db.query.Document.findMany({
    orderBy: { updatedAt: 'desc' },
    limit: 10,
    columns: {
      id: true,
      name: true,
      updatedAt: true,
    },
  });
}

export async function findDocument(id: string) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return db.query.Document.findFirst({
    where: { id },
  });
}
