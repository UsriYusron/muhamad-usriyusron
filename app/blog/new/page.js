import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import BlogEditor from '@/components/blog/BlogEditor';

/**
 * Halaman Buat Artikel Baru — Server Component (Protected)
 *
 * Memeriksa sesi pengguna. Jika tidak ada sesi, redirect ke /login.
 * Jika sesi valid, menampilkan BlogEditor dalam mode buat baru.
 *
 * Requirements: 2.1, 2.3
 */
export const metadata = {
  title: 'Tulis Artikel Baru | Blog',
};

export default async function NewArticlePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?callbackUrl=/blog/new');
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-100">
            Tulis Artikel Baru
          </h1>
          <p className="mt-2 text-neutral-400 text-sm">
            Isi form di bawah untuk membuat artikel baru.
          </p>
        </header>

        {/* Editor */}
        <BlogEditor />
      </div>
    </main>
  );
}
