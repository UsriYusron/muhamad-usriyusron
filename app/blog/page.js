import { getPublishedArticles } from '@/lib/blog/actions';
import BlogFeed from '@/components/blog/BlogFeed';

/**
 * Blog_Feed Page — Server Component
 *
 * Menampilkan daftar artikel yang dipublikasikan dengan pagination.
 * Membaca nomor halaman dari search params dan memanggil getPublishedArticles.
 *
 * Requirements: 5.1, 5.5, 5.6
 */
export const metadata = {
  title: 'Blog & Insight Teknologi',
  description: 'Kumpulan artikel, tutorial, dan tulisan mendalam tentang pengembangan web, Laravel, Next.js, Machine Learning, dan kecerdasan buatan oleh Muhamad Usri Yusron.',
  openGraph: {
    title: 'Blog & Insight Teknologi | Muhamad Usri Yusron',
    description: 'Kumpulan artikel, tutorial, dan tulisan mendalam tentang pengembangan web, Laravel, Next.js, Machine Learning, dan kecerdasan buatan oleh Muhamad Usri Yusron.',
    type: 'website',
  },
};

export default async function BlogPage({ searchParams }) {
  const rawPage = parseInt(searchParams?.page, 10);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const { articles, totalPages } = await getPublishedArticles(page, 10);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-100">
            Article
          </h1>
          <p className="mt-3 text-neutral-400 text-base">
            Articles and writings about technology, web development, and other interesting things.
          </p>
        </header>

        {/* Feed */}
        <BlogFeed articles={articles} page={page} totalPages={totalPages} />
      </div>
    </main>
  );
}
