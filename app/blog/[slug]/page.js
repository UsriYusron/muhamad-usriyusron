import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getArticleBySlug } from '@/lib/blog/actions';

/**
 * Halaman Detail Artikel — Server Component
 *
 * Menampilkan konten lengkap artikel berdasarkan slug.
 * Mengembalikan 404 jika artikel tidak ditemukan atau berstatus draft.
 *
 * Requirements: 5.2, 5.3, 5.4
 */

/**
 * Menghasilkan metadata dinamis berdasarkan data artikel.
 */
export async function generateMetadata({ params }) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: 'Artikel Tidak Ditemukan',
    };
  }

  return {
    title: `${article.title} | Blog`,
    description: article.excerpt ?? article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? article.title,
      images: article.thumbnail ? [{ url: article.thumbnail }] : [],
    },
  };
}

export default async function ArticlePage({ params }) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Judul */}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-100 leading-tight">
          {article.title}
        </h1>

        {/* Meta: Author & Tanggal */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-400">
          {article.authorName && (
            <span>
              Oleh{' '}
              <span className="font-medium text-neutral-300">{article.authorName}</span>
            </span>
          )}
          {publishedDate && (
            <time dateTime={article.publishedAt?.toString()}>
              {publishedDate}
            </time>
          )}
        </div>

        {/* Thumbnail */}
        {article.thumbnail && (
          <div className="mt-8 relative w-full aspect-video rounded-xl overflow-hidden border border-neutral-800">
            <Image
              src={article.thumbnail}
              alt={`Thumbnail untuk artikel: ${article.title}`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {/* Konten Artikel */}
        <div className="mt-10 prose prose-invert prose-neutral max-w-none text-neutral-300 leading-relaxed whitespace-pre-wrap">
          {article.content}
        </div>
      </article>
    </main>
  );
}
