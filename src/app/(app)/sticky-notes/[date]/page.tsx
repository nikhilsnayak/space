import { StickyNotesBoard } from '~/features/sticky-notes/components/sticky-notes-board';
import { findStickyNotesBoardForDate } from '~/features/sticky-notes/queries';

export default async function StickyNotesBoardPage({
  params,
}: PageProps<'/sticky-notes/[date]'>) {
  const { date } = await params;
  const notesResult = await findStickyNotesBoardForDate(date);

  if (notesResult.status === 'error') {
    return (
      <p className='text-muted-foreground text-sm'>Failed to load notes.</p>
    );
  }

  const notes = notesResult.value;

  return <StickyNotesBoard date={date} notes={notes} />;
}
