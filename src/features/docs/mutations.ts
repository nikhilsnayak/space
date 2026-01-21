'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Result } from 'better-result';
import { eq } from 'drizzle-orm';
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

  const result = await Result.gen(async function* () {
    const { id, name, content } = yield* Result.try(() => {
      return UpsertDocumentInputValidator.parse(data);
    });

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

    const [returning] = yield* Result.await(
      Result.tryPromise(() => {
        return db
          .insert(Document)
          .values({ id, ...setFields })
          .onConflictDoUpdate({
            target: Document.id,
            set: setFields,
          })
          .returning({
            name: Document.name,
          });
      })
    );

    return Result.ok(returning);
  });

  if (result.isErr()) {
    console.error(result.error);
  } else {
    revalidatePath('/docs');
  }

  return Result.serialize(result);
}

export async function deleteDocument(id: string) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const result = await Result.tryPromise(() => {
    return db.delete(Document).where(eq(Document.id, id));
  });

  if (result.isErr()) {
    console.error(result.error);
  }

  return Result.serialize(result);
}
