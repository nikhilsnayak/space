'use client';

import { useEffect, useState } from 'react';
import { GaugeIcon, LoaderIcon } from 'lucide-react';

import { useIsClient } from '~/hooks/use-is-client';
import { storage } from '~/hooks/use-local-storage';
import { Button } from '~/components/ui/button';
import { ControlPanel } from '~/features/control-center/components/control-panel';

import { CLOCK_DISPLAY_STORAGE_KEY } from '../constants';

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export function ClockWidget() {
  const isClient = useIsClient();
  const [time, setTime] = useState(new Date());
  const display = storage.useStorage<'analog' | 'digital'>(
    CLOCK_DISPLAY_STORAGE_KEY,
    'analog'
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDisplayToggle = () => {
    const newDisplay = display === 'analog' ? 'digital' : 'analog';
    storage.setItem(CLOCK_DISPLAY_STORAGE_KEY, newDisplay);
  };

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = (hours * 30 + minutes * 0.5) % 360;
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  return (
    <ControlPanel
      title='Clock'
      status='online'
      headerAction={
        <Button
          size='sm'
          variant='ghost'
          onClick={handleDisplayToggle}
          className='h-6 px-2 text-[10px] tracking-wider uppercase'
        >
          {display === 'analog' ? 'Digital' : 'Analog'}
        </Button>
      }
    >
      {isClient ? (
        display === 'digital' ? (
          <div className='space-y-3'>
            <div className='font-mono text-5xl font-bold tracking-wider tabular-nums'>
              {formatTime(time)}
            </div>
            <div className='text-muted-foreground text-sm'>
              {formatDate(time)}
            </div>
            <div className='flex items-center gap-2 text-xs'>
              <GaugeIcon className='text-muted-foreground size-3' />
              <span className='text-muted-foreground tracking-wider uppercase'>
                Asia/Kolkata
              </span>
            </div>
          </div>
        ) : (
          <div className='grid place-items-center gap-4'>
            <svg
              width='180'
              height='180'
              viewBox='0 0 200 200'
              className='drop-shadow-lg'
            >
              {/* Outer glow ring */}
              <circle
                cx='100'
                cy='100'
                r='98'
                fill='none'
                stroke='currentColor'
                strokeWidth='0.5'
                className='text-primary/20'
              />
              {/* Clock face */}
              <circle
                cx='100'
                cy='100'
                r='95'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.5'
                className='text-white/30'
              />
              {/* Inner ring */}
              <circle
                cx='100'
                cy='100'
                r='88'
                fill='none'
                stroke='currentColor'
                strokeWidth='0.5'
                className='text-white/10'
              />
              {/* Hour markers */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const x1 = 100 + 76 * Math.cos(angle);
                const y1 = 100 + 76 * Math.sin(angle);
                const x2 = 100 + 88 * Math.cos(angle);
                const y2 = 100 + 88 * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke='currentColor'
                    strokeWidth={i % 3 === 0 ? '3' : '2'}
                    strokeLinecap='round'
                    className={
                      i % 3 === 0 ? 'text-foreground' : 'text-foreground/70'
                    }
                  />
                );
              })}
              {/* Minute markers */}
              {Array.from({ length: 60 }).map((_, i) => {
                if (i % 5 === 0) return null;
                const angle = (i * 6 - 90) * (Math.PI / 180);
                const x1 = 100 + 84 * Math.cos(angle);
                const y1 = 100 + 84 * Math.sin(angle);
                const x2 = 100 + 88 * Math.cos(angle);
                const y2 = 100 + 88 * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke='currentColor'
                    strokeWidth='1'
                    strokeLinecap='round'
                    className='text-white/20'
                  />
                );
              })}
              {/* Hour hand */}
              <line
                x1='100'
                y1='100'
                x2={100 + 42 * Math.cos(((hourAngle - 90) * Math.PI) / 180)}
                y2={100 + 42 * Math.sin(((hourAngle - 90) * Math.PI) / 180)}
                stroke='currentColor'
                strokeWidth='5'
                strokeLinecap='round'
                className='text-foreground'
              />
              {/* Minute hand */}
              <line
                x1='100'
                y1='100'
                x2={100 + 60 * Math.cos(((minuteAngle - 90) * Math.PI) / 180)}
                y2={100 + 60 * Math.sin(((minuteAngle - 90) * Math.PI) / 180)}
                stroke='currentColor'
                strokeWidth='3'
                strokeLinecap='round'
                className='text-foreground'
              />
              {/* Second hand with tail */}
              <line
                x1={100 - 15 * Math.cos(((secondAngle - 90) * Math.PI) / 180)}
                y1={100 - 15 * Math.sin(((secondAngle - 90) * Math.PI) / 180)}
                x2={100 + 70 * Math.cos(((secondAngle - 90) * Math.PI) / 180)}
                y2={100 + 70 * Math.sin(((secondAngle - 90) * Math.PI) / 180)}
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                className='text-primary'
              />
              {/* Center dot */}
              <circle
                cx='100'
                cy='100'
                r='5'
                fill='currentColor'
                className='text-foreground'
              />
              <circle
                cx='100'
                cy='100'
                r='3'
                fill='currentColor'
                className='text-primary'
              />
            </svg>
            <div className='grid place-items-center gap-1'>
              <div className='text-muted-foreground text-sm'>
                {formatDate(time)}
              </div>
              <div className='flex items-center gap-1.5 text-xs'>
                <GaugeIcon className='text-muted-foreground size-3' />
                <span className='text-muted-foreground/70 tracking-wider uppercase'>
                  Asia/Kolkata
                </span>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className='flex items-center justify-center py-4'>
          <LoaderIcon className='text-muted-foreground size-8 animate-spin' />
        </div>
      )}
    </ControlPanel>
  );
}
