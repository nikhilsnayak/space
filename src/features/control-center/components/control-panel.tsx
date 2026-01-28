import * as React from 'react';

import { cn } from '~/lib/utils';

type StatusType = 'online' | 'loading' | 'error' | 'offline';

interface ControlPanelProps extends React.ComponentProps<'div'> {
  title: string;
  status?: StatusType;
  headerAction?: React.ReactNode;
}

const statusConfig = {
  online: {
    color: 'bg-primary',
    glow: 'shadow-[0_0_8px_rgba(34,197,94,0.6)]',
  },
  loading: {
    color: 'bg-yellow-500',
    glow: 'shadow-[0_0_8px_rgba(245,158,11,0.6)]',
  },
  error: {
    color: 'bg-red-500',
    glow: 'shadow-[0_0_8px_rgba(239,68,68,0.6)]',
  },
  offline: {
    color: 'bg-muted-foreground/40',
    glow: '',
  },
};

export function ControlPanel({
  title,
  status = 'online',
  headerAction,
  className,
  children,
  ...props
}: ControlPanelProps) {
  const statusStyle = statusConfig[status];

  return (
    <div
      className={cn(
        'bg-card/80 relative overflow-hidden border border-white/10 backdrop-blur-sm',
        className
      )}
      {...props}
    >
      <div className='absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 border-white/20' />
      <div className='absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 border-white/20' />
      <div className='absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-white/20' />
      <div className='absolute right-0 bottom-0 h-3 w-3 border-r-2 border-b-2 border-white/20' />

      <div className='flex items-center justify-between border-b border-white/10 px-4 py-3'>
        <div className='flex items-center gap-3'>
          <div
            className={cn(
              'size-2 rounded-full transition-all',
              statusStyle.color,
              statusStyle.glow
            )}
          />
          <span className='text-foreground text-xs font-semibold tracking-[0.15em] uppercase'>
            {title}
          </span>
        </div>
        <div className='flex items-center gap-3'>{headerAction}</div>
      </div>

      <div className='p-4'>{children}</div>
    </div>
  );
}
