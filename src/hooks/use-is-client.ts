import { useSyncExternalStore } from 'react';

const noopSubscribe = () => () => {};
const onClient = () => true;
const onServer = () => false;

export function useIsClient() {
  return useSyncExternalStore(noopSubscribe, onClient, onServer);
}
