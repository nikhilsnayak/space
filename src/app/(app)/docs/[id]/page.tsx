import { FileTextIcon } from 'lucide-react';

import { BackButton } from '~/components/ui/back-button';
import { HomeButton } from '~/components/ui/home-button';
import {
  DocEditor,
  DocEditorProvider,
} from '~/features/docs/components/doc-editor';
import { DocName } from '~/features/docs/components/doc-name';
import { findDocument } from '~/features/docs/queries';

export default async function DocPage({ params }: PageProps<'/docs/[id]'>) {
  const { id } = await params;

  const documentResult = id !== 'new' ? await findDocument(id) : null;

  if (documentResult?.status === 'error') {
    return (
      <p className='text-muted-foreground text-sm'>Failed to load document.</p>
    );
  }

  const document =
    documentResult?.status === 'ok' ? documentResult.value : null;
  const docId = id === 'new' ? crypto.randomUUID() : id;

  return (
    <section className='grid min-h-dvh w-full grid-rows-[auto_1fr] gap-4'>
      <header className='bg-background/50 sticky top-0 z-10 flex w-full items-center justify-between border-b p-4 shadow-sm backdrop-blur-sm'>
        <div className='flex items-center gap-4'>
          <BackButton />
          <h1 className='flex items-center gap-2 text-2xl'>
            <FileTextIcon />
            <DocName key={docId} name={document?.name} docId={docId} />
          </h1>
        </div>
        <HomeButton />
      </header>
      <div className='mx-auto flex w-full max-w-(--breakpoint-xl) items-stretch justify-between p-4'>
        <DocEditorProvider content={document?.content}>
          <DocEditor key={docId} docId={docId} />
        </DocEditorProvider>
      </div>
    </section>
  );
}
