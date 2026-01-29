import { Suspense, ViewTransition } from 'react';
import { StickyNoteIcon } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from '~/components/ui/sidebar';
import { StickyNotesBoardsList } from '~/features/sticky-notes/components/sticky-notes-boards-list';
import { getStickyNotesBoards } from '~/features/sticky-notes/queries';

export default function StickyNotesLayout({
  children,
}: LayoutProps<'/sticky-notes'>) {
  return (
    <SidebarProvider>
      <Sidebar className='border-r border-white/10'>
        <SidebarHeader className='border-b border-white/10 p-5'>
          <ViewTransition name='sticky-notes'>
            <div className='flex items-center justify-center gap-2'>
              <StickyNoteIcon
                className='text-foreground size-5'
                strokeWidth={1.5}
              />
              <h1 className='text-lg font-bold tracking-[0.15em] uppercase'>
                Sticky Notes
              </h1>
            </div>
          </ViewTransition>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className='text-muted-foreground text-[10px] font-semibold tracking-[0.15em] uppercase'>
              Boards
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <Suspense fallback={<BoardsListSkeleton />}>
                <ViewTransition>
                  <BoardsList />
                </ViewTransition>
              </Suspense>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}

function BoardsListSkeleton() {
  return (
    <SidebarMenu>
      {Array.from({ length: 6 }).map((_, i) => (
        <SidebarMenuItem key={i}>
          <div className='h-9 w-full animate-pulse border border-white/10 bg-white/5' />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

async function BoardsList() {
  const boardsResult = await getStickyNotesBoards();

  if (boardsResult.status === 'error') {
    return (
      <div className='flex items-center gap-2 px-2'>
        <div className='size-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' />
        <span className='text-xs tracking-wider text-red-500 uppercase'>
          Failed to load
        </span>
      </div>
    );
  }

  const boards = boardsResult.value;

  return <StickyNotesBoardsList boards={boards} />;
}
