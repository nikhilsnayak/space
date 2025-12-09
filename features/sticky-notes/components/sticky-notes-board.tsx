'use client';

import {
  createContext,
  startTransition,
  use,
  useActionState,
  useOptimistic,
  useRef,
} from 'react';
import { AnimatePresence } from 'motion/react';

import blackBoardImage from '../assets/black-board.jpg';
import { upsertStickyNotesForDate } from '../mutations';
import type { Note } from '../schema';
import { getRandomNoteColor, getRandomNoteRotate } from '../utils';
import { StickyNote } from './sticky-note';

const StickyNotesBoardContext = createContext<{
  ref: React.RefObject<HTMLDivElement | null>;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
} | null>(null);

export function useStickyNotesBoard() {
  const board = use(StickyNotesBoardContext);
  if (!board) {
    throw new Error('Board not found');
  }
  return board;
}

interface StickyNotesBoardProps {
  date: string;
  notes: Note[];
}

async function stickyNotesBoardReducer(
  prev: Note[],
  payload: {
    date: string;
    notes: Note[];
  }
) {
  const result = await upsertStickyNotesForDate(payload.date, payload.notes);

  if (result.type === 'error') {
    return prev;
  }

  return result.updatedNotes;
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

  const performUpsert = (updatedNotes: Note[]) => {
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

  return (
    <div
      className='relative isolate overflow-hidden p-4'
      ref={boardRef}
      style={{
        backgroundImage: `url(${blackBoardImage.src})`,
      }}
      onClick={(e) => {
        if (!e.altKey) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        addNote({ x, y });
      }}
    >
      <StickyNotesBoardContext
        value={{ ref: boardRef, updateNote, deleteNote }}
      >
        <AnimatePresence>
          {optimisticNotes.map((note) => (
            <StickyNote key={note.id} note={note} />
          ))}
        </AnimatePresence>
      </StickyNotesBoardContext>
    </div>
  );
}
