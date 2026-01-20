'use client';

import { useEffect } from 'react';

import { storage } from '~/hooks/use-local-storage';

import {
  LAST_NOTIFICATION_TIME_STORAGE_KEY,
  NOTIFICATION_INTERVAL,
  WORK_MODE_STORAGE_KEY,
} from '../constants';

function checkReminders() {
  const isWorkMode = storage.getItem(WORK_MODE_STORAGE_KEY, false);
  if (!isWorkMode || Notification.permission !== 'granted') return;

  const now = Date.now();

  const lastNotification = storage.getItem(
    LAST_NOTIFICATION_TIME_STORAGE_KEY,
    0
  );
  const timeSinceLastNotification = now - lastNotification;

  if (timeSinceLastNotification >= NOTIFICATION_INTERVAL) {
    new Notification('Stay hydrated!', {
      body: "Don't forget to drink some water and take a walk.",
      icon: '/favicon.ico',
      requireInteraction: true,
    });
    storage.setItem(LAST_NOTIFICATION_TIME_STORAGE_KEY, now);
  }
}

export function NotificationManager() {
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(checkReminders);
    } else {
      checkReminders();
    }

    const checkInterval = setInterval(checkReminders, NOTIFICATION_INTERVAL);
    return () => clearInterval(checkInterval);
  }, []);

  return null;
}
