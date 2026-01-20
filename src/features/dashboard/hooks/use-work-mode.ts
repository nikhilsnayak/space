'use client';

import { useEffect } from 'react';

import { storage } from '~/hooks/use-local-storage';

const schedule = {
  startHour: 9,
  endHour: 18,
  weekdays: [false, true, true, true, true, true, false],
} as const;

function checkSchedule(tz: string) {
  const now = new Date().toLocaleString('en-US', { timeZone: tz });
  const currentHour = new Date(now).getHours();
  const currentDay = new Date(now).getDay();

  if (!schedule.weekdays[currentDay]) {
    return false;
  }

  if (currentHour < schedule.startHour || currentHour >= schedule.endHour) {
    return false;
  }

  return true;
}

const defaultEnabled = checkSchedule('Asia/Kolkata');

export function useWorkMode() {
  const isWorkMode = storage.useStorage('work-mode-enabled', defaultEnabled);

  const toggle = () => {
    storage.setItem('work-mode-enabled', !isWorkMode);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const shouldBeEnabled = checkSchedule('Asia/Kolkata');
      storage.setItem('work-mode-enabled', shouldBeEnabled);
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return [isWorkMode, toggle] as const;
}
