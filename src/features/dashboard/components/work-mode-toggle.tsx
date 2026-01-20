'use client';

import { useEffect } from 'react';
import { BriefcaseIcon } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Kbd, KbdGroup } from '~/components/ui/kbd';

import { useWorkMode } from '../hooks/use-work-mode';

export function WorkModeToggle() {
  const [isWorkMode, toggleWorkMode] = useWorkMode();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'W') {
        e.preventDefault();
        toggleWorkMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleWorkMode]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <BriefcaseIcon className='size-5' />
          Work Mode
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <Button
          onClick={toggleWorkMode}
          variant={isWorkMode ? 'default' : 'outline'}
          className='w-full'
          size='lg'
        >
          {isWorkMode ? 'Work Mode: ON' : 'Work Mode: OFF'}
        </Button>

        <div className='flex items-center gap-2'>
          <span>Press</span>
          <KbdGroup>
            <Kbd>Shift</Kbd>
            <span>+</span>
            <Kbd>W</Kbd>
          </KbdGroup>
          <span>to toggle</span>
        </div>
      </CardContent>
    </Card>
  );
}
