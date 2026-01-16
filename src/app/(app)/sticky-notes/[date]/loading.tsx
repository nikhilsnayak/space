import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className='grid min-h-[max(100dvh,100%)] w-full place-items-center'>
      <Loader2 className='animate-spin text-5xl' />
    </div>
  );
}
