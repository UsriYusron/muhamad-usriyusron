import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import Article from '@/lib/models/Article';

/**
 * PUT /api/blog/[id]
 * Memperbarui artikel yang sudah ada. Memerlukan sesi autentikasi dan ownership.
 *
 * Body: { title?, content?, excerpt?, thumbnail?, status? }
 * - Hanya field yang disediakan yang akan diperbarui
 * - updatedAt diisi otomatis oleh Mongoose timestamps
 * - Jika status berubah ke 'published' dan publishedAt masih null, publishedAt diisi sekarang
 *
 * Requirements: 4.2, 4.3, 4.4, 4.5
 */
export async function PUT(request, { params }) {
  const { id } = await params;

  // Validasi sesi
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Koneksi MongoDB
  try {
    await connectDB();
  } catch (error) {
    console.error('[PUT /api/blog/[id]] MongoDB connection error:', error);
    return NextResponse.json(
      { error: 'Service tidak tersedia' },
      { status: 503 }
    );
  }

  try {
    // Cari artikel berdasarkan _id
    const article = await Article.findById(id);
    if (!article) {
      return NextResponse.json(
        { error: 'Artikel tidak ditemukan' },
        { status: 404 }
      );
    }

    // Cek ownership
    if (session.user.id !== article.authorId.toString()) {
      return NextResponse.json(
        { error: 'Anda tidak memiliki izin untuk mengedit artikel ini' },
        { status: 403 }
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

    const { title, content, excerpt, thumbnail, status } = body;

    // Bangun objek update hanya dari field yang disediakan
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (status !== undefined) updateData.status = status;

    // Jika status berubah ke 'published' dan publishedAt masih null, set publishedAt sekarang
    if (status === 'published' && !article.publishedAt) {
      updateData.publishedAt = new Date();
    }

    // Update artikel dan kembalikan dokumen terbaru
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({ article: updatedArticle });
  } catch (error) {
    console.error('[PUT /api/blog/[id]] Update error:', error);
    return NextResponse.json(
      { error: 'Service tidak tersedia' },
      { status: 503 }
    );
  }
}

/**
 * DELETE /api/blog/[id]
 * Menghapus artikel secara permanen. Memerlukan sesi autentikasi dan ownership.
 *
 * Requirements: 4.4, 4.5
 */
export async function DELETE(request, { params }) {
  const { id } = await params;

  // Validasi sesi
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Koneksi MongoDB
  try {
    await connectDB();
  } catch (error) {
    console.error('[DELETE /api/blog/[id]] MongoDB connection error:', error);
    return NextResponse.json(
      { error: 'Service tidak tersedia' },
      { status: 503 }
    );
  }

  try {
    // Cari artikel berdasarkan _id
    const article = await Article.findById(id);
    if (!article) {
      return NextResponse.json(
        { error: 'Artikel tidak ditemukan' },
        { status: 404 }
      );
    }

    // Cek ownership
    if (session.user.id !== article.authorId.toString()) {
      return NextResponse.json(
        { error: 'Anda tidak memiliki izin untuk menghapus artikel ini' },
        { status: 403 }
      );
    }

    // Hapus artikel
    await Article.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/blog/[id]] Delete error:', error);
    return NextResponse.json(
      { error: 'Service tidak tersedia' },
      { status: 503 }
    );
  }
}
