import { StickyNotesBoard } from '~/features/sticky-notes/components/sticky-notes-board';
import { findStickyNotesBoardForDate } from '~/features/sticky-notes/queries';

export default async function StickyNotesBoardPage({
  params,
}: PageProps<'/sticky-notes/[date]'>) {
  const { date } = await params;
  const notes = await findStickyNotesBoardForDate(date);

  return <StickyNotesBoard date={date} notes={notes} />;
}
