'use client';

import { useEffect, useEffectEvent } from 'react';
import { RocketIcon } from 'lucide-react';

import { cn } from '~/lib/utils';
import { Kbd, KbdGroup } from '~/components/ui/kbd';
import { Switch } from '~/components/ui/switch';
import { ControlPanel } from '~/features/control-center/components/control-panel';

import { useWorkMode } from '../hooks/use-work-mode';

export function WorkModeToggle() {
  const [isWorkMode, toggleWorkMode] = useWorkMode();

  const handleKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (e.shiftKey && e.key === 'W') {
      e.preventDefault();
      toggleWorkMode();
    }
  });

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ControlPanel
      title='Work Mode'
      status={isWorkMode ? 'online' : 'offline'}
      headerAction={
        <Switch checked={isWorkMode} onCheckedChange={toggleWorkMode} />
      }
    >
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <RocketIcon
              className={cn(
                'size-8 transition-all duration-300',
                isWorkMode
                  ? 'text-primary rotate-0'
                  : 'text-muted-foreground -rotate-45'
              )}
            />
            <div>
              <div
                className={cn(
                  'text-lg font-bold tracking-wider uppercase transition-colors',
                  isWorkMode ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {isWorkMode ? 'Active' : 'Standby'}
              </div>
              <div className='text-muted-foreground text-xs'>
                {isWorkMode ? 'Work mode active' : 'Ready for activation'}
              </div>
            </div>
          </div>
        </div>

        <div className='text-muted-foreground flex items-center gap-2 text-xs'>
          <span>Press</span>
          <KbdGroup>
            <Kbd>Shift</Kbd>
            <span>+</span>
            <Kbd>W</Kbd>
          </KbdGroup>
          <span>to toggle</span>
        </div>
      </div>
    </ControlPanel>
  );
}
