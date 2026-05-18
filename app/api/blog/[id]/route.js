import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
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

    // Cek ownership atau admin
    const isAdmin = session.user.role === 'admin';
    const isOwner = session.user.id === article.authorId.toString();

    if (!isOwner && !isAdmin) {
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

    const { title, coverImages, paragraphs, excerpt, status } = body;

    // Bangun objek update hanya dari field yang disediakan
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    
    if (coverImages !== undefined) {
      const validCoverImages = Array.isArray(coverImages) ? coverImages.filter(img => img && img.trim() !== '') : [];
      if (validCoverImages.length < 1) {
        return NextResponse.json(
          { error: 'Cover blog wajib memiliki minimal 1 gambar.' },
          { status: 400 }
        );
      }
      updateData.coverImages = validCoverImages.map(img => img.trim());
      updateData.thumbnail = validCoverImages[0].trim();
    }

    if (paragraphs !== undefined) {
      const validParagraphs = Array.isArray(paragraphs) ? paragraphs : [];
      if (validParagraphs.length === 0 || validParagraphs.some(p => !p.text || !p.text.trim())) {
        return NextResponse.json(
          { error: 'Paragraf tidak boleh kosong dan wajib memiliki teks.' },
          { status: 400 }
        );
      }
      updateData.paragraphs = validParagraphs.map(p => ({
        text: p.text.trim(),
        imageUrl: p.imageUrl ? p.imageUrl.trim() : '',
      }));
      updateData.content = validParagraphs.map(p => p.text.trim()).join('\n\n');
    }

    if (excerpt !== undefined) updateData.excerpt = excerpt;

    if (status !== undefined) {
      if (status === 'published') {
        if (isAdmin) {
          updateData.status = 'published';
          if (!article.publishedAt) {
            updateData.publishedAt = new Date();
          }
        } else {
          updateData.status = 'pending'; // paksa pending jika non-admin mencoba mempublikasikan langsung
        }
      } else {
        updateData.status = status;
      }
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
