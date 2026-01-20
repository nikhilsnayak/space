import { useSyncExternalStore } from 'react';

const listeners = new Map<string, Set<() => void>>();

function getItem<T>(key: string, defaultValue: T): T {
  const stored = localStorage.getItem(key);
  if (!stored) return defaultValue;
  try {
    return JSON.parse(stored) as T;
  } catch {
    return defaultValue;
  }
}

function createGetSnapshot<T>(key: string, defaultValue: T): () => T {
  return () => getItem(key, defaultValue);
}

function createGetServerSnapshot<T>(defaultValue: T): () => T {
  return () => defaultValue;
}

function subscribe(key: string) {
  return (callback: () => void) => {
    if (!listeners.has(key)) {
      listeners.set(key, new Set());
    }

    const listenersForKey = listeners.get(key)!;

    listenersForKey.add(callback);
    return () => {
      listenersForKey.delete(callback);
    };
  };
}

function notifyListeners(key: string) {
  const listenersForKey = listeners.get(key);
  if (!listenersForKey) return;
  listenersForKey.forEach((listener) => listener());
}

function setItem<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
  notifyListeners(key);
}

function useStorage<T>(key: string, defaultValue: T) {
  return useSyncExternalStore(
    subscribe(key),
    createGetSnapshot(key, defaultValue),
    createGetServerSnapshot(defaultValue)
  );
}

export const storage = {
  getItem,
  setItem,
  useStorage,
};
