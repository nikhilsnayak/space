'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { format, isToday, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { TODAY } from '~/lib/constants';
import { cn } from '~/lib/utils';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar';

export function StickyNotesBoardsList({ boards }: { boards: Array<string> }) {
  const { date } = useParams<{ date: string }>();

  const allBoards = boards[0] === TODAY ? boards : [TODAY, ...boards];

  return (
    <SidebarMenu>
      {allBoards.map((board) => {
        const isActive = date === board;
        const isTodayBoard = isToday(parseISO(board));

        return (
          <SidebarMenuItem key={board}>
            <SidebarMenuButton
              render={<Link href={`/sticky-notes/${board}`} />}
              isActive={isActive}
              className={cn(
                'h-auto gap-3 border py-2 transition-all duration-200',
                isActive
                  ? 'border-primary/30 bg-primary/10 hover:bg-primary/15'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              )}
            >
              <div
                className={cn(
                  'size-1.5 shrink-0 rounded-full',
                  isActive
                    ? 'bg-primary shadow-[0_0_6px_rgba(34,197,94,0.6)]'
                    : 'bg-muted-foreground/40'
                )}
              />
              <CalendarIcon className='text-muted-foreground size-3.5 shrink-0' />
              <div className='flex flex-1 flex-col'>
                <span
                  className={cn(
                    'text-xs font-medium tracking-wider uppercase',
                    isActive ? 'text-primary' : 'text-foreground'
                  )}
                >
                  {isTodayBoard ? 'Today' : format(parseISO(board), 'EEE')}
                </span>
                <span className='text-muted-foreground font-mono text-[10px]'>
                  {format(parseISO(board), 'yyyy-MM-dd')}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
