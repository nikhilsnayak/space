import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className='grid min-h-full w-full place-items-center'>
      <Loader2 className='animate-spin text-5xl' />
    </div>
  );
}
