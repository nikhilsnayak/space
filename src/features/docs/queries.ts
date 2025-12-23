import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import { db } from '~/lib/db';

export const getRecentlyUpdatedDocuments = createServerFn().handler(
  async () => {
    return await db.query.Document.findMany({
      orderBy: { updatedAt: 'desc' },
      limit: 10,
    });
  }
);

export const findDocument = createServerFn()
  .inputValidator(z.object({ id: z.uuid() }))
  .handler(({ data }) => {
    const { id } = data;
    return db.query.Document.findFirst({
      where: { id },
    });
  });
