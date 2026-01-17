'use client';

import { useActionState, useRef, ViewTransition } from 'react';

import { useDocumentId } from '../hooks/use-document-id';
import { upsertDocument } from '../mutations';

export function DocName(props: { name?: string | null }) {
  const id = useDocumentId();
  const formRef = useRef<HTMLFormElement>(null);
  const [name, formAction] = useActionState(
    async (prev: string | null, formData: FormData) => {
      try {
        const name = formData.get('name')?.toString().trim();
        const result = await upsertDocument({ id, name });
        return result.name;
      } catch {
        return prev;
      }
    },
    props.name || null
  );

  return (
    <ViewTransition name={`doc-name-${id}`}>
      <form ref={formRef} action={formAction}>
        <input
          name='name'
          defaultValue={name || 'Untitled Doc'}
          className='field-sizing-content max-w-3xl rounded-none px-2 py-1 text-ellipsis'
          spellCheck={false}
          autoComplete='off'
          onBlur={() => {
            formRef.current?.requestSubmit();
          }}
        />
      </form>
    </ViewTransition>
  );
}
