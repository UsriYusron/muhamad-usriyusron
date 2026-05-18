'use client';

import { useState } from 'react';

export default function AdminDashboardClient({ initialArticles }) {
  const [articles, setArticles] = useState(initialArticles);
  const [processingId, setProcessingId] = useState(null); // ID artikel yang sedang diproses
  const [expandedId, setExpandedId] = useState(null); // ID artikel yang sedang dibuka preview-nya

  const handleAction = async (id, action) => {
    setProcessingId(id);
    try {
      if (action === 'approve') {
        // Approve: status = 'published'
        const res = await fetch(`/api/blog/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'published' }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? 'Gagal menyetujui artikel.');
        }

        alert('Artikel berhasil disetujui dan dipublikasikan!');
        setArticles(prev => prev.filter(art => art._id !== id));
      } else if (action === 'reject') {
        // Reject: kembalikan ke 'draft'
        const res = await fetch(`/api/blog/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'draft' }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? 'Gagal menolak artikel.');
        }

        alert('Artikel ditolak dan dikembalikan sebagai Draft ke penulis.');
        setArticles(prev => prev.filter(art => art._id !== id));
      } else if (action === 'delete') {
        // Delete: hapus permanen
        if (!confirm('Apakah Anda yakin ingin menghapus artikel ini secara permanen?')) {
          return;
        }

        const res = await fetch(`/api/blog/${id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? 'Gagal menghapus artikel.');
        }

        alert('Artikel berhasil dihapus permanen.');
        setArticles(prev => prev.filter(art => art._id !== id));
      }
    } catch (err) {
      console.error('[AdminDashboard] Error:', err);
      alert(err.message ?? 'Terjadi kesalahan sistem.');
    } finally {
      setProcessingId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-neutral-900 border border-neutral-800 rounded-2xl text-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-neutral-500 mb-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
        </svg>
        <h3 className="text-lg font-semibold text-neutral-200">Semua Bersih!</h3>
        <p className="text-sm text-neutral-400 mt-1 max-w-md">
          Tidak ada artikel yang berstatus "Pending" (menunggu persetujuan) saat ini. Pekerjaan Anda selesai!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {articles.map((article) => {
        const isExpanded = expandedId === article._id;
        const isProcessing = processingId === article._id;

        return (
          <div
            key={article._id}
            className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:border-neutral-700"
          >
            {/* Card Header / Summary */}
            <div className="p-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                    {article.status}
                  </span>
                  <span className="text-xs text-neutral-400">
                    Diajukan pada {new Date(article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-neutral-100 hover:text-white leading-tight">
                  {article.title}
                </h3>
                <p className="text-sm text-neutral-400">
                  Oleh <span className="font-medium text-neutral-300">{article.authorName}</span>
                </p>
                {article.excerpt && (
                  <p className="text-xs text-neutral-400 italic line-clamp-2">
                    "{article.excerpt}"
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 self-stretch md:self-start justify-end">
                <button
                  type="button"
                  onClick={() => toggleExpand(article._id)}
                  disabled={isProcessing}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors inline-flex items-center gap-1"
                >
                  {isExpanded ? 'Tutup Preview' : 'Tinjau Artikel'}
                </button>
                <button
                  type="button"
                  onClick={() => handleAction(article._id, 'reject')}
                  disabled={isProcessing}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-amber-950/40 text-amber-400 border border-amber-500/20 hover:border-amber-500/40 transition-colors disabled:opacity-40"
                >
                  Tolak ke Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleAction(article._id, 'approve')}
                  disabled={isProcessing}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-neutral-950 transition-colors disabled:opacity-40 inline-flex items-center gap-1.5"
                >
                  {isProcessing && processingId === article._id ? (
                    <span className="w-3.5 h-3.5 border-2 border-neutral-950 border-t-transparent animate-spin rounded-full" />
                  ) : null}
                  Setujui Publikasi
                </button>
                <button
                  type="button"
                  onClick={() => handleAction(article._id, 'delete')}
                  disabled={isProcessing}
                  className="p-2 text-red-400 hover:bg-red-950/20 hover:text-red-300 rounded-lg border border-red-500/10 hover:border-red-500/30 transition-colors disabled:opacity-40"
                  title="Hapus permanen"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Expanded Full Preview */}
            {isExpanded && (
              <div className="border-t border-neutral-800 bg-neutral-950/60 p-6 space-y-6 animate-fadeIn">
                {/* Cover Gallery Preview */}
                {article.coverImages && article.coverImages.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Gambar Cover Blog (Gallery)</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {article.coverImages.map((cover, idx) => (
                        <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-neutral-800 group bg-neutral-900">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={cover}
                            alt={`Preview Cover #${idx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-neutral-950/80 text-neutral-200">
                            Cover #{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Paragraph Content Preview */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Isi Artikel</h4>
                  <div className="space-y-4 text-sm text-neutral-300 leading-relaxed max-w-3xl border-l-2 border-neutral-800 pl-4 py-1">
                    {article.paragraphs && article.paragraphs.length > 0 ? (
                      article.paragraphs.map((p, idx) => (
                        <div key={idx} className="space-y-2">
                          <p className="whitespace-pre-wrap">{p.text}</p>
                          {p.imageUrl && (
                            <div className="relative max-w-md aspect-video rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 my-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={p.imageUrl}
                                alt={`Gambar Paragraf #${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="whitespace-pre-wrap">{article.content}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
