import { useRef } from 'react';
import * as fabric from 'fabric';

export function ImageEditor() {
  const fabricRef = useRef<fabric.Canvas | null>(null);

  const canvasRef = (canvas: HTMLCanvasElement) => {
    const fabricCanvas = new fabric.Canvas(canvas);
    fabricRef.current = fabricCanvas;
    return () => {
      fabricCanvas.dispose();
      fabricRef.current = null;
    };
  };

  return (
    <div className='grid h-full w-full place-items-center'>
      <canvas
        ref={canvasRef}
        className='border-2 shadow'
        width={1600}
        height={800}
      />
    </div>
  );
}
