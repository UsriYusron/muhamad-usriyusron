import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Article from '@/lib/models/Article';
import { generateSlug, ensureUniqueSlug } from '@/lib/blog/slugify';

/**
 * GET /api/blog
 * Mengembalikan daftar artikel dengan status 'published', diurutkan berdasarkan publishedAt terbaru.
 * Support pagination via query params: page (default: 1), limit (default: 10).
 *
 * Requirements: 5.1, 5.5, 5.6, 7.4, 7.5
 */
export async function GET(request) {
  try {
    await connectDB();
  } catch (error) {
    console.error('[GET /api/blog] MongoDB connection error:', error);
    return NextResponse.json(
      { error: 'Service tidak tersedia' },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
  const limit = Math.max(1, parseInt(searchParams.get('limit') ?? '10', 10) || 10);
  const skip = (page - 1) * limit;

  try {
    const query = { status: 'published' };

    const [articles, total] = await Promise.all([
      Article.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Article.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ articles, total, page, totalPages });
  } catch (error) {
    console.error('[GET /api/blog] Query error:', error);
    return NextResponse.json(
      { error: 'Service tidak tersedia' },
      { status: 503 }
    );
  }
}

/**
 * POST /api/blog
 * Membuat artikel baru. Memerlukan sesi autentikasi yang valid.
 *
 * Body: { title, content, excerpt?, thumbnail?, status? }
 * - title dan content wajib diisi (tidak boleh kosong/whitespace)
 * - slug di-generate otomatis dari title
 * - excerpt di-generate otomatis dari 160 karakter pertama content jika tidak disediakan
 * - status default: 'draft'; jika 'published', publishedAt diisi dengan waktu sekarang
 *
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 5.1, 5.6, 7.5
 */
export async function POST(request) {
  // Validasi sesi
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Parse body
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Request body tidak valid' },
      { status: 400 }
    );
  }

  const { title, coverImages, paragraphs, excerpt, status } = body;

  // Validasi field wajib
  const missingFields = [];
  if (!title || !title.trim()) missingFields.push('title');
  
  const validCoverImages = Array.isArray(coverImages) ? coverImages.filter(img => img && img.trim() !== '') : [];
  if (validCoverImages.length < 1) {
    missingFields.push('coverImages (minimal 1 gambar cover wajib)');
  }
  
  const validParagraphs = Array.isArray(paragraphs) ? paragraphs : [];
  if (validParagraphs.length === 0 || validParagraphs.some(p => !p.text || !p.text.trim())) {
    missingFields.push('paragraphs (minimal 1 paragraf, dan isi teks wajib diisi)');
  }

  if (missingFields.length > 0) {
    return NextResponse.json(
      {
        error: 'Field wajib tidak boleh kosong atau kurang lengkap',
        fields: missingFields,
      },
      { status: 400 }
    );
  }

  // Koneksi MongoDB
  try {
    await connectDB();
  } catch (error) {
    console.error('[POST /api/blog] MongoDB connection error:', error);
    return NextResponse.json(
      { error: 'Service tidak tersedia' },
      { status: 503 }
    );
  }

  try {
    // Generate slug unik dari title
    const baseSlug = generateSlug(title.trim());
    const uniqueSlug = await ensureUniqueSlug(baseSlug);

    // Auto-generate content dari gabungan paragraf
    const concatenatedContent = validParagraphs.map(p => p.text.trim()).join('\n\n');

    // Auto-generate excerpt dari 160 karakter pertama paragraf pertama jika tidak disediakan
    const firstParagraphText = validParagraphs[0].text.trim();
    const finalExcerpt =
      excerpt && excerpt.trim()
        ? excerpt.trim().slice(0, 160)
        : firstParagraphText.slice(0, 160);

    // Tentukan status dan publishedAt
    const validStatuses = ['draft', 'pending', 'published'];
    let articleStatus = validStatuses.includes(status) ? status : 'draft';
    // Memaksa status menjadi 'pending' (menunggu persetujuan admin) ketika user mencoba mempublikasikan
    if (articleStatus === 'published') articleStatus = 'pending';
    const publishedAt = null;

    // Simpan artikel ke MongoDB
    const article = await Article.create({
      title: title.trim(),
      slug: uniqueSlug,
      content: concatenatedContent,
      paragraphs: validParagraphs.map(p => ({
        text: p.text.trim(),
        imageUrl: p.imageUrl ? p.imageUrl.trim() : '',
      })),
      excerpt: finalExcerpt,
      coverImages: validCoverImages.map(img => img.trim()),
      thumbnail: validCoverImages[0].trim(),
      authorId: session.user.id,
      authorName: session.user.name,
      status: articleStatus,
      publishedAt,
    });

    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/blog] Save error:', error);
    return NextResponse.json(
      { error: 'Service tidak tersedia' },
      { status: 503 }
    );
  }
}
