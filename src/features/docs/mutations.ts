'use server';

import { redirect } from 'next/navigation';
import z from 'zod';

import { getSession } from '~/lib/auth';
import { db } from '~/lib/db';
import { asJsonb } from '~/lib/db/utils';

import { Document } from './schema';

const UpsertDocumentInputValidator = z.object({
  id: z.uuid(),
  name: z.string().optional(),
  content: z.any().optional(),
});

export async function upsertDocument(
  data: z.infer<typeof UpsertDocumentInputValidator>
) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const { id, name, content } = UpsertDocumentInputValidator.parse(data);

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
}
