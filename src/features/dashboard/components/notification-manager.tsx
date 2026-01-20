'use client';

import { useEffect, useEffectEvent, useSyncExternalStore } from 'react';

import { storage } from '~/hooks/use-local-storage';

import { useWorkMode } from '../hooks/use-work-mode';

function getSnapShot() {
  return Notification.permission;
}

function getServerSnapshot() {
  return null;
}

let cb: (() => void) | null = null;
function subscribe(callback: () => void) {
  cb = callback;
  return () => {
    cb = null;
  };
}

function requestPermission() {
  Notification.requestPermission().then(cb);
}

export function NotificationManager() {
  const [isWorkMode] = useWorkMode();
  const permission = useSyncExternalStore(
    subscribe,
    getSnapShot,
    getServerSnapshot
  );

  const checkReminders = useEffectEvent(() => {
    if (!isWorkMode || permission !== 'granted') return;

    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    const lastNotification = storage.getItem('last-reminder-time', 0);
    const timeSinceLastNotification = now - lastNotification;

    if (timeSinceLastNotification >= oneHour) {
      new Notification('Stay hydrated!', {
        body: "Don't forget to drink some water and take a walk.",
        icon: '/favicon.ico',
        tag: 'water',
      });
      storage.setItem('last-reminder-time', now);
    }
  });

  useEffect(() => {
    // Check reminders every minute
    const checkInterval = setInterval(checkReminders, 60000); // Every minute

    // Initial checks
    checkReminders();

    return () => {
      clearInterval(checkInterval);
    };
  }, []);

  useEffect(() => {
    if (permission === 'default') {
      requestPermission();
    }
  }, [permission]);

  return null;
}
