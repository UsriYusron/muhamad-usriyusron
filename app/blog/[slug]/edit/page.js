import { redirect, notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getArticleBySlug } from '@/lib/blog/actions';
import BlogEditor from '@/components/blog/BlogEditor';

/**
 * Halaman Edit Artikel — Server Component (Protected)
 *
 * Memeriksa sesi pengguna. Jika tidak ada sesi, redirect ke /login.
 * Mengambil data artikel berdasarkan slug. Jika tidak ditemukan, tampilkan 404.
 * Menampilkan BlogEditor dalam mode edit dengan data artikel yang sudah ada.
 *
 * Requirements: 2.2, 4.1
 */
export const metadata = {
  title: 'Edit Artikel | Blog',
};

export default async function EditArticlePage({ params }) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/login?callbackUrl=/blog/${slug}/edit`);
  }

  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Konversi ObjectId MongoDB ke string agar dapat di-serialize ke Client Component
  const serializedArticle = {
    ...article,
    _id: article._id.toString(),
    authorId: article.authorId?.toString() ?? null,
    createdAt: article.createdAt?.toISOString() ?? null,
    updatedAt: article.updatedAt?.toISOString() ?? null,
    publishedAt: article.publishedAt?.toISOString() ?? null,
    paragraphs: article.paragraphs?.map(p => ({
      text: p.text,
      imageUrl: p.imageUrl ?? '',
      _id: p._id?.toString() ?? null,
    })) ?? []
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-100">
            Edit Artikel
          </h1>
          <p className="mt-2 text-neutral-400 text-sm">
            Perbarui konten artikel di bawah ini.
          </p>
        </header>

        {/* Editor dengan data artikel yang sudah ada */}
        <BlogEditor article={serializedArticle} />
      </div>
    </main>
  );
}
