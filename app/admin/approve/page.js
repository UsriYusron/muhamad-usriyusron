import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Article from '@/lib/models/Article';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

export const metadata = {
  title: 'Persetujuan Artikel | Admin Dashboard',
  description: 'Tinjau, setujui, atau tolak artikel yang diajukan oleh pengguna.',
};

export default async function AdminApprovePage() {
  const session = await getServerSession(authOptions);

  // Proteksi halaman: Wajib login dan harus memiliki role 'admin'
  if (!session) {
    redirect('/login?callbackUrl=/admin/approve');
  }

  if (session.user.role !== 'admin') {
    // Jika login tetapi bukan admin, arahkan kembali ke blog list dengan status Unauthorized
    redirect('/blog');
  }

  try {
    await connectDB();
  } catch (error) {
    console.error('[AdminApprovePage] MongoDB connection error:', error);
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-bold text-red-400">Koneksi Gagal</h1>
          <p className="text-neutral-400">Gagal terhubung ke database. Silakan coba beberapa saat lagi.</p>
        </div>
      </main>
    );
  }

  // Ambil artikel yang statusnya 'pending'
  const pendingArticlesRaw = await Article.find({ status: 'pending' })
    .sort({ createdAt: -1 })
    .lean();

  // Konversi dokumen MongoDB ke format plain object agar bisa di-serialize ke Client Component
  const pendingArticles = pendingArticlesRaw.map(art => ({
    ...art,
    _id: art._id.toString(),
    authorId: art.authorId?.toString() ?? null,
    createdAt: art.createdAt?.toISOString() ?? null,
    updatedAt: art.updatedAt?.toISOString() ?? null,
    publishedAt: art.publishedAt?.toISOString() ?? null,
    paragraphs: art.paragraphs?.map(p => ({
      text: p.text,
      imageUrl: p.imageUrl ?? '',
      _id: p._id?.toString() ?? null,
    })) ?? []
  }));

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <header className="border-b border-neutral-800 pb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-100 sm:text-4xl">
              Admin Approval Dashboard
            </h1>
            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl">
              Tinjau artikel yang telah diajukan penulis. Setujui untuk mempublikasikan artikel secara langsung ke halaman utama blog, atau kembalikan ke draf jika memerlukan revisi.
            </p>
          </div>
        </header>

        {/* Dashboard Client Component */}
        <AdminDashboardClient initialArticles={pendingArticles} />
      </div>
    </main>
  );
}
