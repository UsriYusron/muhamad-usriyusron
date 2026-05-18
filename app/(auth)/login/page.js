'use client';

import { useSearchParams } from 'next/navigation';
import { signIn, signOut } from 'next-auth/react';
import { Suspense } from 'react';

/**
 * Peta pesan error dari NextAuth.js ke teks yang lebih deskriptif.
 * Requirement 1.4: menampilkan pesan error yang deskriptif.
 */
const ERROR_MESSAGES = {
  OAuthSignin: 'Terjadi kesalahan saat memulai proses login. Silakan coba lagi.',
  OAuthCallback: 'Terjadi kesalahan saat memproses respons dari provider OAuth.',
  OAuthCreateAccount: 'Tidak dapat membuat akun baru. Silakan coba dengan akun lain.',
  EmailCreateAccount: 'Tidak dapat membuat akun dengan email ini.',
  Callback: 'Terjadi kesalahan pada proses callback autentikasi.',
  OAuthAccountNotLinked:
    'Email ini sudah terdaftar dengan metode login lain. Gunakan metode login yang sama.',
  SessionRequired: 'Anda harus login untuk mengakses halaman tersebut.',
  Default: 'Terjadi kesalahan saat login. Silakan coba lagi.',
};

function LoginContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('error');
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';
  const errorMessage = errorCode
    ? (ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.Default)
    : null;

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-background px-4"
      aria-label="Halaman Login"
    >
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-border bg-card text-card-foreground shadow-lg p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Selamat Datang</h1>
            <p className="text-sm text-muted-foreground">
              Login untuk mengakses fitur penulisan blog
            </p>
          </div>

          {/* Error message — Requirement 1.4 */}
          {errorMessage && (
            <div
              role="alert"
              aria-live="assertive"
              className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="mt-0.5 h-4 w-4 shrink-0"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login buttons */}
          <div className="space-y-3">
            {/* Login dengan Google — Requirement 1.1 */}
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl })}
              aria-label="Login dengan Google"
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {/* Google icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-5 w-5 shrink-0"
                aria-hidden="true"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Login dengan Google
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground"></span>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

/**
 * Halaman Login
 *
 * - Tombol "Login dengan Google" memanggil signIn('google') — Requirement 1.1
 * - Tombol "Login dengan GitHub" memanggil signIn('github') — Requirement 1.2
 * - Menampilkan pesan error deskriptif dari query param ?error= — Requirement 1.4
 * - Tombol "Logout" memanggil signOut({ callbackUrl: '/' }) — Requirement 1.5
 *
 * Dibungkus Suspense karena useSearchParams() memerlukan Suspense boundary
 * di Next.js App Router.
 */
export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" aria-label="Memuat..." />
      </main>
    }>
      <LoginContent />
    </Suspense>
  );
}
