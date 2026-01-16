import { FileTextIcon } from 'lucide-react';

import { DocEditor } from '~/features/docs/components/doc-editor';
import { DocName } from '~/features/docs/components/doc-name';
import { findDocument } from '~/features/docs/queries';

export default async function DocPage({ params }: PageProps<'/docs/[id]'>) {
  const { id } = await params;

  const document = id !== 'new' ? await findDocument(id) : null;

  return (
    <section className='grid min-h-dvh w-full grid-rows-[auto_1fr] gap-4'>
      <header className='bg-background/50 sticky top-0 z-10 w-full border-b p-4 shadow-sm backdrop-blur-sm'>
        <h1 className='flex items-center gap-2 text-2xl'>
          <FileTextIcon />
          <DocName name={document?.name} />
        </h1>
      </header>
      <div className='mx-auto flex w-full max-w-(--breakpoint-xl) items-stretch justify-between p-4'>
        <DocEditor content={document?.content} />
      </div>
    </section>
  );
}
