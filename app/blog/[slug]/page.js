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
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

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
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

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

        {/* Cover Images Gallery */}
        {article.coverImages && article.coverImages.length > 0 ? (
          <div className="mt-8 space-y-4">
            {/* Main Cover */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-neutral-800 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.coverImages[0]}
                alt={`Cover utama untuk artikel: ${article.title}`}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Gallery of other covers */}
            {article.coverImages.length > 1 && (
              <div className="grid grid-cols-2 gap-4">
                {article.coverImages.slice(1).map((cover, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-neutral-800 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cover}
                      alt={`Cover pendukung ${idx + 2} untuk artikel: ${article.title}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : article.thumbnail ? (
          // Fallback ke single thumbnail (lama)
          <div className="mt-8 relative w-full aspect-video rounded-xl overflow-hidden border border-neutral-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.thumbnail}
              alt={`Thumbnail untuk artikel: ${article.title}`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : null}

        {/* Konten Artikel */}
        <div className="mt-10 max-w-none text-neutral-300 leading-relaxed space-y-6 text-base">
          {article.paragraphs && article.paragraphs.length > 0 ? (
            article.paragraphs.map((p, idx) => (
              <div key={idx} className="space-y-4">
                <p className="whitespace-pre-wrap">{p.text}</p>
                {p.imageUrl && (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-neutral-800 shadow-md my-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.imageUrl}
                      alt={`Gambar pendukung untuk paragraf ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            // Fallback untuk artikel lama yang menyimpannya sebagai teks mentah 'content'
            <p className="whitespace-pre-wrap">{article.content}</p>
          )}
        </div>
      </article>
    </main>
  );
}
