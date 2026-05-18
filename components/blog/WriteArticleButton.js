'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

/**
 * WriteArticleButton — Client Component
 *
 * Tombol untuk mengarahkan pengguna ke halaman pembuatan artikel baru.
 * - Jika user sudah login (session tersedia), tampilkan link ke /blog/new
 * - Jika user belum login, tampilkan disabled button dengan tooltip
 *
 * Menggunakan useSession() untuk memastikan sesi client-side sudah loaded
 * sebelum navigasi, menghindari 401 errors.
 */
export default function WriteArticleButton() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated' && session?.user;
  const isLoading = status === 'loading';

  if (isLoading) {
    return (
      <button
        disabled
        aria-label="Memuat status login..."
        className="inline-flex items-center gap-2 rounded-lg bg-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-300 transition-colors duration-150 cursor-not-allowed"
      >
        <svg
          className="w-4 h-4 animate-spin"
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
        Memuat...
      </button>
    );
  }

  if (isAuthenticated) {
    return (
      <Link
        href="/blog/new"
        className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 transition-colors duration-150 hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Tulis artikel baru"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Tulis Artikel
      </Link>
    );
  }

  return (
    <button
      disabled
      title="Anda harus login terlebih dahulu untuk menulis artikel"
      className="inline-flex items-center gap-2 rounded-lg bg-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-400 cursor-not-allowed transition-colors duration-150"
      aria-label="Login diperlukan untuk menulis artikel"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4v16m8-8H4"
        />
      </svg>
      Tulis Artikel
    </button>
  );
}
