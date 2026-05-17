import { connectDB } from '@/lib/mongodb';
import Article from '@/lib/models/Article';

/**
 * Mengambil daftar artikel yang dipublikasikan dengan pagination.
 * Digunakan oleh komponen Blog_Feed.
 *
 * @param {number} page - Nomor halaman (default: 1)
 * @param {number} limit - Jumlah artikel per halaman (default: 10)
 * @returns {Promise<{ articles: object[], total: number, page: number, totalPages: number } | null>}
 */
export async function getPublishedArticles(page = 1, limit = 10) {
  try {
    await connectDB();

    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      Article.find({ status: 'published' })
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Article.countDocuments({ status: 'published' }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      articles,
      total,
      page,
      totalPages,
    };
  } catch (error) {
    console.error('[getPublishedArticles] Error:', error);
    return { articles: [], total: 0, page, totalPages: 0 };
  }
}

/**
 * Mengambil artikel berdasarkan slug untuk halaman detail artikel.
 * Hanya mengembalikan artikel dengan status 'published'.
 *
 * @param {string} slug - Slug artikel
 * @returns {Promise<object | null>} Artikel yang ditemukan, atau null jika tidak ada / berstatus draft
 */
export async function getArticleBySlug(slug) {
  try {
    await connectDB();

    const article = await Article.findOne({ slug, status: 'published' }).lean();

    return article ?? null;
  } catch (error) {
    console.error('[getArticleBySlug] Error:', error);
    return null;
  }
}

/**
 * Mengambil artikel terbaru untuk ditampilkan di Footer preview.
 * Hanya mengembalikan field yang dibutuhkan untuk efisiensi.
 *
 * @param {number} limit - Jumlah maksimal artikel (default: 3)
 * @returns {Promise<object[]>} Array artikel terbaru (title, slug, excerpt, thumbnail, publishedAt)
 */
export async function getLatestArticlesForFooter(limit = 3) {
  try {
    await connectDB();

    const articles = await Article.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .select('title slug excerpt thumbnail publishedAt')
      .lean();

    return articles;
  } catch (error) {
    console.error('[getLatestArticlesForFooter] Error:', error);
    return [];
  }
}
