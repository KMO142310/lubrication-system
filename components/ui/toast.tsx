'use client';

import { Toaster as Sonner } from 'sonner';

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        style: {
          background: '#2D3748',
          color: '#fff',
          border: '1px solid #1B2A4A',
        },
        className: 'rounded-sm',
      }}
    />
  );
}
