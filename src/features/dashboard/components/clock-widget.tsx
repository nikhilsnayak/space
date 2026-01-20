'use client';

import { useEffect, useState } from 'react';
import { ClockIcon, LoaderIcon } from 'lucide-react';

import { useIsClient } from '~/hooks/use-is-client';
import { storage } from '~/hooks/use-local-storage';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

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
    'clock-display',
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
    storage.setItem('clock-display', newDisplay);
  };

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = (hours * 30 + minutes * 0.5) % 360;
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <ClockIcon className='size-5' />
            Clock
          </CardTitle>

          <Button size='sm' variant='outline' onClick={handleDisplayToggle}>
            {display === 'analog' ? 'Digital' : 'Analog'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isClient ? (
          display === 'digital' ? (
            <div className='space-y-2'>
              <div className='font-mono text-5xl font-bold tabular-nums'>
                {formatTime(time)}
              </div>
              <div className='text-muted-foreground text-sm'>
                {formatDate(time)}
              </div>
            </div>
          ) : (
            <div>
              <div className='text-muted-foreground text-sm'>
                {formatDate(time)}
              </div>
              <div className='flex items-center justify-center py-4'>
                <svg
                  width='200'
                  height='200'
                  viewBox='0 0 200 200'
                  className='size-full max-w-[200px]'
                >
                  {/* Clock face */}
                  <circle
                    cx='100'
                    cy='100'
                    r='95'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    className='text-border'
                  />
                  {/* Hour markers */}
                  {Array.from({ length: 12 }).map((_, i) => {
                    const angle = (i * 30 - 90) * (Math.PI / 180);
                    const x1 = 100 + 85 * Math.cos(angle);
                    const y1 = 100 + 85 * Math.sin(angle);
                    const x2 = 100 + 95 * Math.cos(angle);
                    const y2 = 100 + 95 * Math.sin(angle);
                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke='currentColor'
                        strokeWidth='2'
                        className='text-foreground'
                      />
                    );
                  })}
                  {/* Hour hand */}
                  <line
                    x1='100'
                    y1='100'
                    x2={100 + 50 * Math.cos(((hourAngle - 90) * Math.PI) / 180)}
                    y2={100 + 50 * Math.sin(((hourAngle - 90) * Math.PI) / 180)}
                    stroke='currentColor'
                    strokeWidth='4'
                    strokeLinecap='round'
                    className='text-foreground'
                  />
                  {/* Minute hand */}
                  <line
                    x1='100'
                    y1='100'
                    x2={
                      100 + 70 * Math.cos(((minuteAngle - 90) * Math.PI) / 180)
                    }
                    y2={
                      100 + 70 * Math.sin(((minuteAngle - 90) * Math.PI) / 180)
                    }
                    stroke='currentColor'
                    strokeWidth='3'
                    strokeLinecap='round'
                    className='text-foreground'
                  />
                  {/* Second hand */}
                  <line
                    x1='100'
                    y1='100'
                    x2={
                      100 + 75 * Math.cos(((secondAngle - 90) * Math.PI) / 180)
                    }
                    y2={
                      100 + 75 * Math.sin(((secondAngle - 90) * Math.PI) / 180)
                    }
                    stroke='currentColor'
                    strokeWidth='1'
                    strokeLinecap='round'
                    className='text-destructive'
                  />
                  {/* Center dot */}
                  <circle cx='100' cy='100' r='5' fill='currentColor' />
                </svg>
              </div>
            </div>
          )
        ) : (
          <div className='flex items-center justify-center py-4'>
            <LoaderIcon className='text-muted-foreground size-8 animate-spin' />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
