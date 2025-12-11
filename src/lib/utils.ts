import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ClassValue } from 'clsx';

export function cn(...classes: Array<ClassValue>) {
  return twMerge(clsx(classes));
}
