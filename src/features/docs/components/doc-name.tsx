import { useActionState, useRef } from 'react';

import { upsertDocument } from '../mutations';

export function DocName(props: { id: string; name?: string | null }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [name, formAction] = useActionState(
    async (prev: string, formData: FormData) => {
      try {
        const name = formData.get('name')?.toString().trim() as string;
        const result = await upsertDocument({ data: { id: props.id, name } });

        return result.name;
      } catch {
        return prev;
      }
    },
    props.name
  );

  return (
    <form ref={formRef} action={formAction}>
      <input
        name='name'
        defaultValue={name || 'Untitled Doc'}
        className='px-2 py-1 rounded-none'
        spellCheck={false}
        autoComplete='off'
        onBlur={() => {
          formRef.current?.requestSubmit();
        }}
      />
    </form>
  );
}
