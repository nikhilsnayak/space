import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useDocumentId() {
  const pathname = usePathname();
  const id = pathname.split('/').pop();

  useEffect(() => {
    if (id === 'new') {
      window.history.replaceState(null, '', `/docs/${crypto.randomUUID()}`);
    }
  }, [id]);

  if (!id) {
    throw new Error('No ID found. Please refresh the page and try again.');
  }

  return id;
}
