import { FileTextIcon } from 'lucide-react';

import { BackButton } from '~/components/back-button';
import { HomeButton } from '~/components/home-button';
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
      <div className='flex min-h-dvh items-center justify-center'>
        <div className='relative overflow-hidden border border-red-500/30 bg-red-500/10 p-4'>
          <div className='flex items-center gap-2'>
            <div className='size-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' />
            <span className='text-xs tracking-wider text-red-500 uppercase'>
              Failed to load document
            </span>
          </div>
        </div>
      </div>
    );
  }

  const document =
    documentResult?.status === 'ok' ? documentResult.value : null;
  const docId = id === 'new' ? crypto.randomUUID() : id;

  return (
    <section className='relative z-10 grid min-h-dvh w-full grid-rows-[auto_1fr]'>
      <header className='bg-background/80 sticky top-0 z-10 border-b border-white/10 backdrop-blur-sm'>
        <div className='flex w-full items-center gap-4 p-4'>
          <div className='flex items-center gap-4'>
            <BackButton className='border-white/10 hover:border-white/20 hover:bg-white/5' />
            <HomeButton className='border-white/10 hover:border-white/20 hover:bg-white/5' />
          </div>

          <div className='flex flex-1 items-center justify-center gap-3'>
            <FileTextIcon className='text-muted-foreground size-4' />
            <DocName key={docId} name={document?.name} docId={docId} />
          </div>
        </div>
      </header>

      <div className='relative overflow-hidden'>
        <div className='mx-auto flex h-full w-full max-w-(--breakpoint-xl) flex-col p-4'>
          <div className='bg-card/80 relative flex-1 overflow-hidden border border-white/10 backdrop-blur-sm'>
            <div className='absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 border-white/20' />
            <div className='absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 border-white/20' />
            <div className='absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-white/20' />
            <div className='absolute right-0 bottom-0 h-3 w-3 border-r-2 border-b-2 border-white/20' />

            <DocEditorProvider content={document?.content}>
              <DocEditor key={docId} docId={docId} />
            </DocEditorProvider>
          </div>
        </div>
      </div>
    </section>
  );
}
