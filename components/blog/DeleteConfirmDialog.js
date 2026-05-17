'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

/**
 * DeleteConfirmDialog — Client Component
 *
 * Dialog konfirmasi sebelum menghapus artikel. Menampilkan modal dengan judul
 * artikel yang akan dihapus, tombol "Hapus" untuk mengeksekusi penghapusan,
 * dan tombol "Batal" untuk menutup dialog tanpa aksi.
 *
 * Fitur:
 *   - Memanggil DELETE /api/blog/[articleId] saat konfirmasi
 *   - Menampilkan loading state saat request berlangsung
 *   - Redirect ke /blog setelah penghapusan berhasil (Requirement 4.6)
 *   - Menampilkan pesan error jika penghapusan gagal
 *   - Accessible: role="dialog", focus trap, Escape untuk menutup
 *
 * @param {{
 *   articleId: string,
 *   articleTitle: string,
 *   isOpen: boolean,
 *   onClose: () => void
 * }} props
 *
 * Requirements: 4.4, 4.6
 */
export default function DeleteConfirmDialog({
  articleId,
  articleTitle,
  isOpen,
  onClose,
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  // Refs untuk focus management
  const dialogRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const deleteButtonRef = useRef(null);

  /**
   * Tutup dialog dan reset state error.
   * Dipanggil oleh tombol "Batal" atau saat Escape ditekan.
   */
  const handleClose = useCallback(() => {
    if (isDeleting) return; // Jangan tutup saat sedang menghapus
    setError('');
    onClose();
  }, [isDeleting, onClose]);

  /**
   * Tangani penekanan tombol keyboard di dalam dialog.
   * Escape menutup dialog; Tab dikelola untuk focus trap.
   */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        handleClose();
        return;
      }

      // Focus trap: pastikan Tab tetap di dalam dialog
      if (e.key === 'Tab') {
        const focusableElements = dialogRef.current?.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift+Tab: jika fokus di elemen pertama, pindah ke terakhir
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: jika fokus di elemen terakhir, pindah ke pertama
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [handleClose]
  );

  // Kelola fokus dan scroll lock saat dialog dibuka/ditutup
  useEffect(() => {
    if (isOpen) {
      // Simpan elemen yang sedang fokus sebelum dialog dibuka
      const previouslyFocused = document.activeElement;

      // Fokus ke tombol "Batal" saat dialog terbuka (lebih aman dari "Hapus")
      const timer = setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 50);

      // Cegah scroll body saat dialog terbuka
      document.body.style.overflow = 'hidden';

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
        // Kembalikan fokus ke elemen sebelumnya saat dialog ditutup
        if (previouslyFocused && previouslyFocused.focus) {
          previouslyFocused.focus();
        }
      };
    }
  }, [isOpen]);

  /**
   * Eksekusi penghapusan artikel.
   * Memanggil DELETE /api/blog/[articleId] dan redirect ke /blog jika berhasil.
   */
  async function handleDelete() {
    setIsDeleting(true);
    setError('');

    try {
      const res = await fetch(`/api/blog/${articleId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(
          data.error ?? 'Terjadi kesalahan saat menghapus artikel. Silakan coba lagi.'
        );
        return;
      }

      // Penghapusan berhasil — redirect ke halaman Blog_Feed (Requirement 4.6)
      router.push('/blog');
    } catch (err) {
      console.error('[DeleteConfirmDialog] Network error:', err);
      setError('Gagal terhubung ke server. Periksa koneksi internet Anda.');
    } finally {
      setIsDeleting(false);
    }
  }

  // Jangan render apapun jika dialog tidak terbuka
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop / Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onKeyDown={handleKeyDown}
      >
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
          className="relative w-full max-w-md rounded-2xl border border-neutral-700 bg-neutral-900 p-6 shadow-2xl"
        >
          {/* Ikon peringatan */}
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>

          {/* Judul dialog */}
          <h2
            id="delete-dialog-title"
            className="text-lg font-semibold text-neutral-100 text-center mb-2"
          >
            Hapus Artikel?
          </h2>

          {/* Deskripsi konfirmasi */}
          <p
            id="delete-dialog-description"
            className="text-sm text-neutral-400 text-center leading-relaxed mb-6"
          >
            Anda akan menghapus artikel{' '}
            <span className="font-medium text-neutral-200">
              &ldquo;{articleTitle}&rdquo;
            </span>{' '}
            secara permanen. Tindakan ini tidak dapat dibatalkan.
          </p>

          {/* Pesan error */}
          {error && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
            >
              {error}
            </div>
          )}

          {/* Tombol aksi */}
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            {/* Tombol Batal */}
            <button
              ref={cancelButtonRef}
              type="button"
              onClick={handleClose}
              disabled={isDeleting}
              className="flex-1 inline-flex items-center justify-center rounded-lg border border-neutral-600 bg-neutral-800 px-5 py-2.5 text-sm font-medium text-neutral-200 transition-colors duration-150 hover:bg-neutral-700 hover:border-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>

            {/* Tombol Hapus */}
            <button
              ref={deleteButtonRef}
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              aria-busy={isDeleting}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <LoadingSpinner />
                  Menghapus...
                </>
              ) : (
                'Hapus'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Spinner kecil untuk indikator loading di dalam tombol.
 */
function LoadingSpinner() {
  return (
    <svg
      className="w-4 h-4 animate-spin text-white/70"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
