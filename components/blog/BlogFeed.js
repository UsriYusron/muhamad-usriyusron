import Link from 'next/link';
import ArticleCard from './ArticleCard';
import WriteArticleButton from './WriteArticleButton';

/**
 * BlogFeed — Server Component
 *
 * Menampilkan daftar artikel dalam grid responsif beserta navigasi pagination.
 * Jika tidak ada artikel, menampilkan pesan kosong.
 *
 * @param {{
 *   articles: Array<{
 *     title: string,
 *     slug: string,
 *     excerpt: string,
 *     thumbnail?: string,
 *     authorName: string,
 *     publishedAt: Date
 *   }>,
 *   page: number,
 *   totalPages: number
 * }} props
 */
export default function BlogFeed({ articles, page, totalPages }) {
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <section aria-label="Daftar artikel blog">
      {/* Tombol Tulis Artikel */}
      <div className="mb-8 flex justify-end">
        <WriteArticleButton />
      </div>

      {/* Grid artikel */}
      {articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-20">
          <p className="text-neutral-400 text-base">
            Belum ada artikel yang dipublikasikan
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          aria-label="Navigasi halaman"
          className="mt-10 flex items-center justify-between gap-4"
        >
          {/* Tombol Prev */}
          {hasPrev ? (
            <Link
              href={`?page=${page - 1}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200 text-sm font-medium hover:bg-neutral-700 hover:border-neutral-500 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              aria-label="Halaman sebelumnya"
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Prev
            </Link>
          ) : (
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-600 text-sm font-medium cursor-not-allowed select-none"
              aria-disabled="true"
              aria-label="Tidak ada halaman sebelumnya"
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Prev
            </span>
          )}

          {/* Info halaman */}
          <span className="text-sm text-neutral-400" aria-live="polite">
            Halaman{' '}
            <span className="font-semibold text-neutral-200">{page}</span>
            {' '}dari{' '}
            <span className="font-semibold text-neutral-200">{totalPages}</span>
          </span>

          {/* Tombol Next */}
          {hasNext ? (
            <Link
              href={`?page=${page + 1}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200 text-sm font-medium hover:bg-neutral-700 hover:border-neutral-500 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              aria-label="Halaman berikutnya"
            >
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-600 text-sm font-medium cursor-not-allowed select-none"
              aria-disabled="true"
              aria-label="Tidak ada halaman berikutnya"
            >
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          )}
        </nav>
      )}
    </section>
  );
}
