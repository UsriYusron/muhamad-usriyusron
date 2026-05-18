import Link from 'next/link';

/**
 * ArticlePreview — Component untuk Footer
 *
 * Menampilkan preview artikel terbaru dalam format kartu kolom premium (layaknya gambar referensi).
 * Fitur:
 * - Cover Image di bagian atas.
 * - Banner hijau berisi nama penulis yang meluncur muncul (slide & fade) hanya ketika di-hover.
 * - Judul tebal bertekstur.
 * - Ringkasan artikel dinamis sepanjang 150-200 karakter yang bersih dari markdown.
 * - Footer kartu berisi tanggal berformat bahasa Indonesia & panah geser interaktif.
 */
export default function ArticlePreview({ articles }) {
  if (!articles || articles.length === 0) {
    return (
      <p className="text-sm text-neutral-500 italic text-center py-8">
        Belum ada artikel yang dipublikasikan
      </p>
    );
  }

  return (
    <div
      className="flex md:grid gap-6 w-full md:grid-cols-3 lg:grid-cols-4"
      role="list"
      aria-label="Artikel terbaru"
    >
      {articles.map((article, index) => {
        const { title, slug, excerpt, content, thumbnail, publishedAt, authorName } = article;

        // Ekstrak isi tulisan untuk summary dinamis antara 150 - 200 karakter
        const rawContent = excerpt || content || '';
        const cleanContent = rawContent
          .replace(/[#*`_\[\]\(\)\-]/g, '') // Bersihkan tag markdown sederhana
          .replace(/\s+/g, ' ')             // Rapikan spasi berlebih
          .trim();

        const truncatedSummary =
          cleanContent.length > 180
            ? cleanContent.slice(0, 180).trimEnd() + '...'
            : cleanContent || 'Baca kisah selengkapnya di artikel ini.';

        // Format tanggal ke bahasa Indonesia, misal: "12 November 2025"
        const formattedDate = publishedAt
          ? new Date(publishedAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
          : '';

        return (
          <div
            key={slug}
            className={`group relative flex flex-col h-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden w-full ${
              index === 0
                ? 'flex'
                : index === 1 || index === 2
                ? 'hidden md:flex'
                : 'hidden lg:flex'
            }`}
          >
            <Link
              href={`/blog/${slug}`}
              className="flex flex-col h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label={`Baca artikel: ${title}`}
            >
              {/* 1. Cover Image */}
              <div className="relative w-full aspect-[4/3] bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                {thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbnail}
                    alt={`Cover artikel: ${title}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-12 h-12 stroke-[1.2]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3 3h18M3 9h18"
                      />
                    </svg>
                  </div>
                )}

                {/* 2. Hover Green Author Bar */}
                <div
                  className="absolute bottom-0 inset-x-0 bg-[#00FFFF] text-black text-xs font-semibold px-4 py-0 max-h-0 opacity-0 group-hover:py-3 group-hover:max-h-12 group-hover:opacity-100 transition-all duration-300 ease-in-out flex items-center overflow-hidden"
                >
                  <span>
                    by <span className="underline decoration-emerald-300 underline-offset-2">{authorName || "Penulis"}</span>
                  </span>
                </div>
              </div>

              {/* 3. Info Konten */}
              <div className="flex flex-col flex-1 p-5">
                {/* Judul */}
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 dark:group-hover:text-emerald-400 transition-colors duration-200 line-clamp-2 leading-snug">
                  {title}
                </h3>

                {/* Summary (150-200 Karakter) */}
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2.5 leading-relaxed line-clamp-3 flex-1">
                  {truncatedSummary}
                </p>

                {/* 4. Footer Kartu (Tanggal & Panah Kanan Geser) */}
                <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
                  <time
                    dateTime={publishedAt ? new Date(publishedAt).toISOString() : ''}
                    className="text-xs text-neutral-450 dark:text-neutral-500 font-medium"
                  >
                    {formattedDate}
                  </time>

                  <span className="text-[#00FFFF] dark:text-emerald-400 group-hover:text-[#00FFFF]/80 dark:group-hover:text-emerald-300 transition-all duration-300 transform group-hover:translate-x-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
