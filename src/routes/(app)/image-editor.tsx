import { createFileRoute } from '@tanstack/react-router';
import { HomeIcon } from 'lucide-react';

import { LinkButton } from '~/components/ui/link-button';
import { ImageEditor } from '~/features/image-editor/components/image-editor';

export const Route = createFileRoute('/(app)/image-editor')({
  component: ImageEditorPage,
});

function ImageEditorPage() {
  return (
    <section className='grid h-full grid-cols-[240px_1fr]'>
      <aside className='h-full border-r'>
        <h1 className='border-b p-4 text-center text-2xl font-bold'>
          Image Editor
        </h1>
      </aside>
      <div className='grid h-full grid-rows-[auto_1fr]'>
        <div className='flex w-full items-center justify-between border-b p-4 backdrop-blur-sm'>
          <h2 className='text-2xl font-medium'>todo file name</h2>
          <LinkButton to='/image-editor' size='icon-sm' variant='outline'>
            <HomeIcon />
          </LinkButton>
        </div>
        <ImageEditor />
      </div>
    </section>
  );
}
