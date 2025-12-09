import { NOTE_COLORS } from './constants';

export function getRandomNoteColor() {
  const color = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
  return color;
}

export function getRandomNoteRotate(): number {
  return Math.floor(Math.random() * 7) - 3; // Random rotation between -3 and 3 degrees
}
