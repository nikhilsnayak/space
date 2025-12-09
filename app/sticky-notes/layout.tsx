import { ViewTransition } from 'react';

export default function StickyNotesLayout({
  children,
}: LayoutProps<'/sticky-notes'>) {
  return (
    <section className='grid h-full grid-cols-[240px_1fr]'>
      <aside className='h-full border-r'>
        <ViewTransition name='sticky-notes'>
          <h1 className='border-b p-4 text-center text-2xl font-bold'>
            Sticky Notes
          </h1>
        </ViewTransition>
      </aside>
      {children}
    </section>
  );
}
