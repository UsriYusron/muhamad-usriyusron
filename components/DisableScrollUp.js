// app/components/DisableScrollUp.jsx
"use client";

import { useEffect, useRef } from 'react';

export default function DisableScrollUp({ 
  enabled = true, // Aktif/nonaktifkan fitur
  smooth = true, // Smooth scroll atau langsung
  threshold = 0 // Ambang batas sebelum aktif (dalam px)
}) {
  const lastScrollTopRef = useRef(0);
  const isEnabledRef = useRef(enabled);

  useEffect(() => {
    isEnabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    // Simpan posisi scroll awal
    lastScrollTopRef.current = window.pageYOffset || document.documentElement.scrollTop;

    const handleScroll = () => {
      if (!isEnabledRef.current) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Deteksi scroll ke atas (scrollTop < lastScrollTop)
      if (scrollTop < lastScrollTopRef.current - threshold) {
        // Cegah scroll ke atas dengan mengembalikan ke posisi sebelumnya
        if (smooth) {
          window.scrollTo({
            top: lastScrollTopRef.current,
            behavior: 'smooth'
          });
        } else {
          window.scrollTo(0, lastScrollTopRef.current);
        }
        
        // Opsional: Trigger event kustom
        const event = new CustomEvent('scrollUpPrevented', {
          detail: { attemptedPosition: scrollTop }
        });
        window.dispatchEvent(event);
      } else {
        // Update posisi terakhir hanya jika scroll ke bawah
        lastScrollTopRef.current = scrollTop;
      }
    };

    // Gunakan passive: false agar bisa preventDefault
    window.addEventListener('scroll', handleScroll, { passive: false });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [smooth, threshold]);

  // Opsional: Reset posisi jika needed
  const resetPosition = () => {
    lastScrollTopRef.current = window.pageYOffset || document.documentElement.scrollTop;
  };

  // Expose method melalui ref (opsional)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__disableScrollUpReset = resetPosition;
    }
  }, []);

  return null; // Komponen ini tidak merender apa-apa
}