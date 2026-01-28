'use client';

import { useEffect } from 'react';
import z from 'zod';

import { storage } from '~/hooks/use-local-storage';

import {
  LAST_NOTIFICATION_TIME_STORAGE_KEY,
  NOTIFICATION_INTERVAL,
  REMINDER_MESSAGES_STORAGE_KEY,
  WORK_MODE_STORAGE_KEY,
} from '../constants';

const DEFAULT_REMINDER_MESSAGE = {
  title: 'Stay hydrated!',
  body: "Don't forget to drink some water and take a walk.",
};

const ReminderMessageResponseSchema = z.object({
  message: z.object({
    title: z.string(),
    body: z.string(),
  }),
});

async function getReminderMessage() {
  try {
    const previous10Messages = storage
      .getItem(REMINDER_MESSAGES_STORAGE_KEY, [])
      .slice(-10);
    const response = await fetch('/api/reminders/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentTime: new Date().toISOString(),
        previousMessages: previous10Messages,
      }),
    });
    const body = await response.json();
    const message = ReminderMessageResponseSchema.parse(body).message;
    const updatedMessages = [...previous10Messages.slice(-9), message.body];
    storage.setItem(REMINDER_MESSAGES_STORAGE_KEY, updatedMessages);
    return message;
  } catch {
    return DEFAULT_REMINDER_MESSAGE;
  }
}

async function checkReminders() {
  const isWorkMode = storage.getItem(WORK_MODE_STORAGE_KEY, false);
  if (!isWorkMode || Notification.permission !== 'granted') return;

  const now = Date.now();

  const lastNotification = storage.getItem(
    LAST_NOTIFICATION_TIME_STORAGE_KEY,
    0
  );
  const timeSinceLastNotification = now - lastNotification;

  if (timeSinceLastNotification >= NOTIFICATION_INTERVAL) {
    const { title, body } = await getReminderMessage();
    new Notification(title, {
      body,
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
