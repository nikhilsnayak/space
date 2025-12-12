import { startTransition, useActionState, useOptimistic, useRef } from 'react';
import { AnimatePresence } from 'motion/react';

import { TODAY } from '~/lib/constants';
import { cn } from '~/lib/utils';

import blackBoardImage from '../assets/black-board.jpg';
import { upsertStickyNotesForDate } from '../mutations';
import { Note } from '../schema';
import { getRandomNoteColor, getRandomNoteRotate } from '../utils';
import { StickyNotesBoardContext } from './context/sticky-notes-board-context';
import { StickyNote } from './sticky-note';

interface StickyNotesBoardProps {
  date: string;
  notes: Array<Note>;
}

async function stickyNotesBoardReducer(
  prev: Array<Note>,
  payload: {
    date: string;
    notes: Array<Note>;
  }
) {
  try {
    return upsertStickyNotesForDate({ data: payload });
  } catch {
    return prev;
  }
}

export function StickyNotesBoard({
  date,
  notes: initialNotes,
}: StickyNotesBoardProps) {
  const [notes, upsertStickyNotesForDateAction] = useActionState(
    stickyNotesBoardReducer,
    initialNotes
  );
  const [optimisticNotes, setOptimisticNotes] = useOptimistic(notes);
  const boardRef = useRef<HTMLDivElement>(null);

  const performUpsert = (updatedNotes: Array<Note>) => {
    startTransition(() => {
      setOptimisticNotes(updatedNotes);
      upsertStickyNotesForDateAction({
        date,
        notes: updatedNotes,
      });
    });
  };

  const addNote = (pos: { x: number; y: number }) => {
    const color = getRandomNoteColor();
    const rotate = getRandomNoteRotate();
    const id = crypto.randomUUID();

    const newNote: Note = {
      id,
      pos,
      color,
      rotate,
      text: '',
    };

    performUpsert([...optimisticNotes, newNote]);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    const updatedNotes = optimisticNotes.map((note) =>
      note.id === id ? { ...note, ...updates } : note
    );

    performUpsert(updatedNotes);
  };

  const deleteNote = (id: string) => {
    performUpsert(optimisticNotes.filter((note) => note.id !== id));
  };

  const editable = date === TODAY;

  const board = {
    ref: boardRef,
    editable,
    updateNote,
    deleteNote,
  };

  return (
    <div
      ref={boardRef}
      className={cn(
        'relative isolate overflow-hidden bg-cover bg-center bg-no-repeat',
        !editable && 'pointer-events-none'
      )}
      style={{
        backgroundImage: `url(${blackBoardImage})`,
      }}
      onClick={(e) => {
        if (!e.altKey) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        addNote({ x, y });
      }}
    >
      <StickyNotesBoardContext value={board}>
        <AnimatePresence>
          {optimisticNotes.map((note) => (
            <StickyNote key={note.id} note={note} />
          ))}
        </AnimatePresence>
      </StickyNotesBoardContext>
    </div>
  );
}
