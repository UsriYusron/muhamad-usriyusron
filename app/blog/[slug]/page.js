import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug } from '@/lib/blog/actions';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import Article from '@/lib/models/Article';

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

  const cleanDescription = article.excerpt
    ? article.excerpt.replace(/[#*`_\[\]\(\)\-]/g, '').trim()
    : `${article.title} - Baca artikel selengkapnya di Blog Muhamad Usri Yusron.`;

  return {
    title: `${article.title} | Blog`,
    description: cleanDescription,
    alternates: {
      canonical: `https://muhamad-usriyusron.site/blog/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: cleanDescription,
      type: 'article',
      url: `https://muhamad-usriyusron.site/blog/${slug}`,
      publishedTime: article.publishedAt,
      authors: [article.authorName || 'Muhamad Usri Yusron'],
      images: article.thumbnail ? [{ url: article.thumbnail }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: cleanDescription,
      images: article.thumbnail ? [article.thumbnail] : [],
    },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Ambil foto profil penulis jika ada authorId
  let authorImage = null;
  if (article.authorId) {
    try {
      await connectDB();
      const author = await User.findById(article.authorId).select('image').lean();
      authorImage = author?.image ?? null;
    } catch (err) {
      console.error('[ArticlePage] Failed to fetch author image:', err);
    }
  }

  // Ambil artikel selanjutnya (yang dipublikasikan lebih lama / selanjutnya di feed)
  let nextArticle = null;
  if (article && article.publishedAt) {
    try {
      await connectDB();
      nextArticle = await Article.findOne({
        status: 'published',
        publishedAt: { $lt: article.publishedAt },
        _id: { $ne: article._id }
      })
        .sort({ publishedAt: -1 })
        .select('slug')
        .lean();
    } catch (err) {
      console.error('[ArticlePage] Failed to fetch next article:', err);
    }
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
      {/* Navigation Arrows (Space-between layaknya navbar tanpa background) */}
      <div className="fixed top-4 left-4 right-4  hidden md:flex items-center justify-between px-8 p-4">
        {/* Panah Kiri (Kembali ke Beranda '/') */}
        <Link
          href="/"
          className="flex items-center justify-center p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500"
          aria-label="Kembali ke Beranda"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </Link>

        {/* Panah Kanan (Artikel Selanjutnya) */}
        {nextArticle ? (
          <Link
            href={`/blog/${nextArticle.slug}`}
            className="flex items-center justify-center p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500"
            aria-label="Artikel Selanjutnya"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        ) : (
          // Placeholder kosong untuk menjaga keselarasan tata letak space-between
          <div className="w-10 h-10" aria-hidden="true" />
        )}
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Judul */}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-100 leading-tight">
          {article.title}
        </h1>

        {/* Meta: Author & Tanggal */}
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-neutral-400">
          {article.authorName && (
            <span className="flex items-center gap-2">
              <span>Oleh</span>
              {authorImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={authorImage}
                  alt={article.authorName}
                  className="w-6 h-6 rounded-full object-cover border border-neutral-800 shadow-sm"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-neutral-850 text-neutral-300 flex items-center justify-center font-bold text-[9px]">
                  {article.authorName[0].toUpperCase()}
                </div>
              )}
              <span className="font-medium text-neutral-300">{article.authorName}</span>
            </span>
          )}
          {publishedDate && (
            <span className="text-neutral-700 select-none">•</span>
          )}
          {publishedDate && (
            <time dateTime={article.publishedAt?.toString()} className="text-neutral-500">
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
                      loading="lazy"
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
                      loading="lazy"
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
