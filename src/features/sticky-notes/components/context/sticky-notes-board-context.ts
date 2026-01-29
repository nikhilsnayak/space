import { createContext, use } from 'react';

import type { Note } from '../../schema';

export const StickyNotesBoardContext = createContext<{
  notes: Note[];
  addNote: (pos: { x: number; y: number }) => void;
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
