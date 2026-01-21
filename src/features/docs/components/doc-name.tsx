'use client';

import { useActionState, useRef, ViewTransition } from 'react';

import { toast } from '~/components/ui/toast';

import { upsertDocument } from '../mutations';

export function DocName(props: { name?: string | null; docId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [name, formAction] = useActionState(
    async (prev: string | null, formData: FormData) => {
      const name = formData.get('name')?.toString().trim();
      const result = await upsertDocument({ id: props.docId, name });
      if (result.status === 'error') {
        toast.add({
          title: 'Error',
          description: 'Failed to update document name',
        });
        return prev;
      }
      return result.value.name;
    },
    props.name || null
  );

  return (
    <ViewTransition name={`doc-name-${props.docId}`}>
      <form ref={formRef} action={formAction}>
        <input
          name='name'
          defaultValue={name || 'Untitled Doc'}
          aria-label='Document name'
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
