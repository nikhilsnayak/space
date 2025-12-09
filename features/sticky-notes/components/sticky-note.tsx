'use client';

import { useState } from 'react';
import { Caveat } from 'next/font/google';
import { XIcon } from 'lucide-react';
import { motion, useDragControls } from 'motion/react';

import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';

import type { Note } from '../schema';
import { useStickyNotesBoard } from './sticky-notes-board';

const caveat = Caveat({ subsets: ['latin'], weight: '400' });

interface StickyNoteProps {
  note: Note;
}

export function StickyNote({
  note: { id, text, pos, color, rotate },
}: StickyNoteProps) {
  const [isEditing, setIsEditing] = useState(!text.trim());
  const dragControls = useDragControls();
  const board = useStickyNotesBoard();

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragConstraints={board.ref}
      whileDrag={{
        scale: 1.1,
        boxShadow: '0px 10px 20px rgba(0,0,0,0.2)',
        zIndex: 1,
      }}
      onDragEnd={(e, info) => {
        board.updateNote(id, {
          pos: {
            x: pos.x + info.offset.x,
            y: pos.y + info.offset.y,
          },
        });
      }}
      initial={{
        opacity: 0,
        scale: 0.7,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 0.7,
      }}
      transition={{
        duration: 0.33,
        type: 'spring',
        bounce: 0.35,
      }}
      onDoubleClick={() => setIsEditing(true)}
      onClick={(e) => {
        e.stopPropagation();
      }}
      className='absolute top-0 left-0 h-50 w-50 border text-gray-800'
      style={{
        x: pos.x,
        y: pos.y,
        backgroundColor: color,
        rotate: `${rotate}deg`,
        backgroundImage: `
        linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.05) 100%),
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0,0,0,0.02) 2px,
          rgba(0,0,0,0.02) 4px
        )
      `,
      }}
    >
      <Button
        variant='destructive'
        size='icon'
        className='absolute top-0 right-0 size-5 translate-x-1/2 -translate-y-1/2 rounded-full p-0'
        onClick={() => board.deleteNote(id)}
      >
        <XIcon className='size-4' />
      </Button>
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.7,
          y: -10,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        whileHover={{
          scale: 1.15,
          backgroundColor: 'rgba(31, 41, 55, 0.8)',
          boxShadow: '0px 2px 12px 2px rgba(31,41,55,0.14)',
        }}
        transition={{
          duration: 0.33,
          type: 'spring',
          bounce: 0.35,
        }}
        onPointerDown={(e) => {
          dragControls.start(e);
        }}
        className='mx-auto mt-1 mb-2 h-2.5 w-12 cursor-grab rounded-full bg-gray-700 transition-shadow'
      />
      {isEditing ? (
        <textarea
          autoFocus
          defaultValue={text}
          placeholder='add your note here...'
          onBlur={(e) => {
            const newText = e.target.value.trim();
            if (!newText) return;
            setIsEditing(false);
            board.updateNote(id, { text: newText });
          }}
          className={cn(
            'h-full w-full cursor-text resize-none border-none p-2 text-base outline-none',
            caveat.className
          )}
        />
      ) : (
        <pre
          className={cn(
            'h-full w-full overflow-x-hidden overflow-y-auto p-2 text-base wrap-anywhere whitespace-pre-wrap select-none',
            caveat.className
          )}
        >
          {text}
        </pre>
      )}
    </motion.div>
  );
}
