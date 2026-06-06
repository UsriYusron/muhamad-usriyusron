import { connectDB } from '@/lib/mongodb';
import Article from '@/lib/models/Article';

/**
 * Next.js Dynamic Sitemap Generator
 * Menghasilkan sitemap.xml secara dinamis untuk crawler Google & search engine lainnya.
 */
export default async function sitemap() {
  const baseUrl = 'https://muhamad-usriyusron.site';

  // Daftar rute statis utama
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // Ambil semua artikel aktif dari MongoDB untuk disertakan di sitemap
  try {
    await connectDB();
    const articles = await Article.find({ status: 'published' })
      .select('slug updatedAt')
      .lean();

    const articleRoutes = articles.map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: article.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    return [...routes, ...articleRoutes];
  } catch (error) {
    console.error('[Sitemap] Failed to fetch articles for sitemap:', error);
    return routes;
  }
}
