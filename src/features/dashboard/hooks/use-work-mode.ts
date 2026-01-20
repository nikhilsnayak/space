'use client';

import { useEffect, useRef } from 'react';

import { storage } from '~/hooks/use-local-storage';

import { WORK_MODE_STORAGE_KEY } from '../constants';

const SCHEDULE = {
  START_HOUR: 9,
  END_HOUR: 18,
  WEEKDAYS: [false, true, true, true, true, true, false],
} as const;

function checkSchedule() {
  const currentHour = new Date().getHours();
  const currentDay = new Date().getDay();

  if (!SCHEDULE.WEEKDAYS[currentDay]) {
    return false;
  }

  if (currentHour < SCHEDULE.START_HOUR || currentHour >= SCHEDULE.END_HOUR) {
    return false;
  }

  return true;
}

export function useWorkMode() {
  const isWorkMode = storage.useStorage(WORK_MODE_STORAGE_KEY, false);
  const intervaleRef = useRef<NodeJS.Timeout | null>(null);

  const toggle = () => {
    if (intervaleRef.current) {
      clearInterval(intervaleRef.current);
    }
    storage.setItem(WORK_MODE_STORAGE_KEY, !isWorkMode);
  };

  useEffect(() => {
    intervaleRef.current = setInterval(() => {
      const shouldBeEnabled = checkSchedule();
      storage.setItem(WORK_MODE_STORAGE_KEY, shouldBeEnabled);
    }, 60000);

    return () => {
      if (intervaleRef.current) {
        clearInterval(intervaleRef.current);
      }
    };
  }, []);

  return [isWorkMode, toggle] as const;
}
