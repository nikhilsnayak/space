import { createFileRoute, Link } from '@tanstack/react-router';
import { FileTextIcon, ImageIcon, StickyNoteIcon } from 'lucide-react';

export const Route = createFileRoute('/(app)/')({
  component: HomePage,
});

function HomePage() {
  return (
    <section className='mx-auto flex max-w-(--breakpoint-xl) items-center gap-4 p-8'>
      <Link
        to='/sticky-notes'
        className='bg-card text-card-foreground grid aspect-square w-40 place-items-center border p-4 shadow-sm'
      >
        <StickyNoteIcon />
        <h2>Sticky Notes</h2>
      </Link>
      <Link
        to='/image-editor'
        className='bg-card text-card-foreground grid aspect-square w-40 place-items-center border p-4 shadow-sm'
      >
        <ImageIcon />
        <h2>Image Editor</h2>
      </Link>
      <Link
        to='/docs'
        className='bg-card text-card-foreground grid aspect-square w-40 place-items-center border p-4 shadow-sm'
      >
        <FileTextIcon />
        <h2>Docs</h2>
      </Link>
    </section>
  );
}
