import Link from 'next/link';
import Image from 'next/image';

/**
 * ArticleCard — Server Component
 *
 * Menampilkan kartu artikel sebagai link ke /blog/[slug].
 * Menampilkan: judul, excerpt (maks 160 karakter), thumbnail atau placeholder,
 * nama Author, dan tanggal publikasi dalam format bahasa Indonesia.
 *
 * @param {{ article: {
 *   title: string,
 *   slug: string,
 *   excerpt: string,
 *   thumbnail?: string,
 *   authorName: string,
 *   publishedAt: Date
 * }}} props
 */
export default function ArticleCard({ article }) {
  const { title, slug, excerpt, thumbnail, authorName, publishedAt } = article;

  // Potong excerpt ke maks 160 karakter
  const truncatedExcerpt =
    excerpt && excerpt.length > 160
      ? excerpt.slice(0, 160).trimEnd() + '…'
      : excerpt || '';

  // Format tanggal ke bahasa Indonesia, misal: "17 Mei 2026"
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <Link
      href={`/blog/${slug}`}
      className="group block rounded-2xl overflow-hidden bg-neutral-800 border border-neutral-700 hover:border-neutral-500 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
      aria-label={`Baca artikel: ${title}`}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video bg-neutral-700 overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={`Thumbnail artikel: ${title}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className="w-full h-full bg-neutral-700 flex items-center justify-center"
            aria-hidden="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-neutral-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3 3h18M3 9h18"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Konten kartu */}
      <div className="p-5 flex flex-col gap-3">
        {/* Judul */}
        <h2 className="text-lg font-semibold text-neutral-100 group-hover:text-white leading-snug line-clamp-2">
          {title}
        </h2>

        {/* Excerpt */}
        {truncatedExcerpt && (
          <p className="text-sm text-neutral-400 leading-relaxed line-clamp-3">
            {truncatedExcerpt}
          </p>
        )}

        {/* Meta: Author & Tanggal */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-neutral-700">
          <span className="text-xs text-neutral-400 truncate">
            {authorName}
          </span>
          {formattedDate && (
            <time
              dateTime={new Date(publishedAt).toISOString()}
              className="text-xs text-neutral-500 shrink-0"
            >
              {formattedDate}
            </time>
          )}
        </div>
      </div>
    </Link>
  );
}
