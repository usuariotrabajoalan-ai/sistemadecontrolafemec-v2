'use client';

import { useEffect } from 'react';

export default function PwaRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => {
          console.log('SW de Extras registrado exitosamente');
        })
        .catch((err) => {
          console.error('Error registrando SW de Extras:', err);
        });
    }
  }, []);

  return null;
}
