import { FileTextIcon } from 'lucide-react';

import { DocEditor } from '~/features/docs/components/doc-editor';
import { DocName } from '~/features/docs/components/doc-name';
import { findDocument } from '~/features/docs/queries';

export default async function DocPage({ params }: PageProps<'/docs/[id]'>) {
  const { id } = await params;

  const document = await findDocument(id);

  return (
    <section className='grid h-full w-full grid-rows-[auto_1fr] gap-4'>
      <header className='border-b p-4 shadow-sm'>
        <h1 className='flex items-center gap-2 text-2xl'>
          <FileTextIcon />
          <DocName id={id} name={document?.name} />
        </h1>
      </header>
      <div className='mx-auto flex w-full max-w-(--breakpoint-xl) items-stretch justify-between p-4'>
        <DocEditor id={id} content={document?.content} />
      </div>
    </section>
  );
}
