import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import { db } from '~/lib/db';
import { asJsonb } from '~/lib/db/utils';

import { Document } from './schema';

export const upsertDocument = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      id: z.uuid(),
      name: z.string().optional(),
      content: z.any().optional(),
    })
  )
  .handler(async ({ data }) => {
    const { id, name, content } = data;

    const setFields: {
      name?: string | null;
      content?: ReturnType<typeof asJsonb>;
    } = {};

    if (name !== undefined) {
      setFields.name = name;
    }

    if (content !== undefined) {
      setFields.content = asJsonb(content);
    }

    const [returning] = await db
      .insert(Document)
      .values({ id, ...setFields })
      .onConflictDoUpdate({
        target: Document.id,
        set: setFields,
      })
      .returning();

    return returning;
  });
