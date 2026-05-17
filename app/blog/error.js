'use client';

import Link from 'next/link';
import { useEffect } from 'react';

/**
 * Error Boundary untuk halaman Blog — Client Component
 *
 * Ditampilkan secara otomatis oleh Next.js App Router ketika terjadi
 * error rendering di dalam segmen /blog. Menyediakan UI fallback yang
 * ramah pengguna beserta tombol "Coba Lagi" dan tautan kembali ke /blog.
 *
 * @param {{ error: Error & { digest?: string }, reset: () => void }} props
 *
 * Requirements: 7.5
 */
export default function BlogError({ error, reset }) {
  useEffect(() => {
    // Catat error ke console untuk keperluan debugging
    console.error('[BlogError]', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Ikon error */}
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
        </div>

        {/* Pesan error */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-neutral-100">
            Terjadi Kesalahan
          </h1>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Maaf, terjadi kesalahan saat memuat halaman ini. Silakan coba lagi
            atau kembali ke halaman blog.
          </p>
        </div>

        {/* Tombol aksi */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* Tombol Coba Lagi */}
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 transition-colors duration-150 hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Coba Lagi
          </button>

          {/* Tautan kembali ke /blog */}
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 px-5 py-2.5 text-sm font-medium text-neutral-200 transition-colors duration-150 hover:bg-neutral-700 hover:border-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Kembali ke Blog
          </Link>
        </div>
      </div>
    </main>
  );
}
