'use client';

import { useRef } from 'react';
import * as fabric from 'fabric';

export function ImageEditor() {
  const fabricRef = useRef<fabric.Canvas | null>(null);

  const canvasRef = (canvas: HTMLCanvasElement) => {
    fabricRef.current = new fabric.Canvas(canvas);

    return () => {
      fabricRef.current?.destroy();
      fabricRef.current = null;
    };
  };

  return (
    <div className='grid h-full w-full place-items-center'>
      <canvas
        ref={canvasRef}
        className='border-2 shadow'
        width={800}
        height={800}
      />
    </div>
  );
}
