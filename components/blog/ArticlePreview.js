import Link from 'next/link';
import Image from 'next/image';

/**
 * ArticlePreview — Server Component
 *
 * Menampilkan preview artikel terbaru di dalam Footer.
 * Menampilkan: judul, excerpt (maks 100 karakter), thumbnail atau placeholder,
 * dan tanggal publikasi dalam format bahasa Indonesia.
 *
 * @param {{ articles: Array<{
 *   title: string,
 *   slug: string,
 *   excerpt: string,
 *   thumbnail?: string,
 *   publishedAt: Date
 * }> }} props
 */
export default function ArticlePreview({ articles }) {
  // Tampilkan pesan jika tidak ada artikel
  if (!articles || articles.length === 0) {
    return (
      <p className="text-sm text-neutral-500 italic">
        Belum ada artikel yang dipublikasikan
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3" role="list" aria-label="Artikel terbaru">
      {articles.map((article) => {
        const { title, slug, excerpt, thumbnail, publishedAt } = article;

        // Potong excerpt ke maks 100 karakter
        const truncatedExcerpt =
          excerpt && excerpt.length > 100
            ? excerpt.slice(0, 100).trimEnd() + '…'
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
          <li key={slug}>
            <Link
              href={`/blog/${slug}`}
              className="group flex items-start gap-3 rounded-xl p-2 -mx-2 hover:bg-neutral-700/50 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              aria-label={`Baca artikel: ${title}`}
            >
              {/* Thumbnail kecil */}
              <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-neutral-700">
                {thumbnail ? (
                  <Image
                    src={thumbnail}
                    alt={`Thumbnail artikel: ${title}`}
                    fill
                    sizes="56px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-neutral-500"
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

              {/* Teks konten */}
              <div className="flex flex-col gap-1 min-w-0">
                {/* Judul */}
                <h3 className="text-sm font-medium text-neutral-200 group-hover:text-white leading-snug line-clamp-2">
                  {title}
                </h3>

                {/* Excerpt */}
                {truncatedExcerpt && (
                  <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">
                    {truncatedExcerpt}
                  </p>
                )}

                {/* Tanggal publikasi */}
                {formattedDate && (
                  <time
                    dateTime={new Date(publishedAt).toISOString()}
                    className="text-xs text-neutral-600"
                  >
                    {formattedDate}
                  </time>
                )}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
