'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * BlogEditor — Client Component
 *
 * Form editor artikel untuk membuat artikel baru atau mengedit artikel yang sudah ada.
 * Mendukung dua mode:
 *   - Mode buat baru: props `article` tidak disediakan (undefined)
 *   - Mode edit: props `article` berisi data artikel yang akan diedit
 *
 * Fitur:
 *   - Validasi client-side: title dan content wajib diisi
 *   - Tombol "Simpan sebagai Draft" dan "Publikasikan"
 *   - Simpan draft ke localStorage jika sesi kedaluwarsa (HTTP 401)
 *   - Redirect ke halaman artikel setelah berhasil menyimpan
 *
 * @param {{ article?: {
 *   _id: string,
 *   title: string,
 *   content: string,
 *   excerpt: string,
 *   thumbnail: string,
 *   status: 'draft' | 'published'
 * } }} props
 *
 * Requirements: 2.3, 2.4, 3.1, 3.5, 3.6, 3.7, 4.1
 */
export default function BlogEditor({ article }) {
  const router = useRouter();
  const isEditMode = Boolean(article?._id);

  // State form — pre-fill dari props jika mode edit
  const [title, setTitle] = useState(article?.title ?? '');
  const [content, setContent] = useState(article?.content ?? '');
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? '');
  const [thumbnail, setThumbnail] = useState(article?.thumbnail ?? '');

  // State UI
  const [errors, setErrors] = useState({ title: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAction, setSubmitAction] = useState(null); // 'draft' | 'published'

  /**
   * Validasi field wajib sebelum submit.
   * Mengembalikan true jika valid, false jika ada error.
   */
  function validate() {
    const newErrors = { title: '', content: '' };
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = 'Judul artikel tidak boleh kosong.';
      isValid = false;
    }
    if (!content.trim()) {
      newErrors.content = 'Isi artikel tidak boleh kosong.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  /**
   * Handler submit form.
   * @param {'draft' | 'published'} status - Status artikel yang akan disimpan
   */
  async function handleSubmit(status) {
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitAction(status);

    const payload = {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || undefined,
      thumbnail: thumbnail.trim() || undefined,
      status,
    };

    try {
      const url = isEditMode ? `/api/blog/${article._id}` : '/api/blog';
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Sesi kedaluwarsa — simpan draft ke localStorage lalu redirect ke login
      if (res.status === 401) {
        try {
          localStorage.setItem(
            'blog_draft_backup',
            JSON.stringify({
              title: title.trim(),
              content: content.trim(),
              excerpt: excerpt.trim(),
              thumbnail: thumbnail.trim(),
              savedAt: new Date().toISOString(),
            })
          );
        } catch {
          // localStorage tidak tersedia (misal: mode private di beberapa browser)
        }
        router.push('/login');
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error('[BlogEditor] Submit error:', data);
        // Tampilkan error umum — tidak perlu state khusus untuk ini
        alert(data.error ?? 'Terjadi kesalahan. Silakan coba lagi.');
        return;
      }

      const data = await res.json();
      const slug = data.article?.slug;

      if (slug) {
        router.push(`/blog/${slug}`);
      } else {
        // Fallback jika slug tidak tersedia
        router.push('/blog');
      }
    } catch (err) {
      console.error('[BlogEditor] Network error:', err);
      alert('Gagal terhubung ke server. Periksa koneksi internet Anda.');
    } finally {
      setIsSubmitting(false);
      setSubmitAction(null);
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form
        onSubmit={(e) => e.preventDefault()}
        noValidate
        aria-label={isEditMode ? 'Form edit artikel' : 'Form buat artikel baru'}
        className="flex flex-col gap-6"
      >
        {/* Field: Judul */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="blog-title"
            className="text-sm font-medium text-neutral-200"
          >
            Judul <span className="text-red-400" aria-hidden="true">*</span>
          </label>
          <input
            id="blog-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
            }}
            placeholder="Masukkan judul artikel..."
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'blog-title-error' : undefined}
            className={`w-full rounded-lg border bg-neutral-800 px-4 py-2.5 text-neutral-100 placeholder-neutral-500 text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.title
                ? 'border-red-500 focus:ring-red-500'
                : 'border-neutral-700 hover:border-neutral-600'
            }`}
          />
          {errors.title && (
            <p
              id="blog-title-error"
              role="alert"
              className="text-xs text-red-400 mt-0.5"
            >
              {errors.title}
            </p>
          )}
        </div>

        {/* Field: Isi Artikel */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="blog-content"
            className="text-sm font-medium text-neutral-200"
          >
            Isi Artikel <span className="text-red-400" aria-hidden="true">*</span>
          </label>
          <textarea
            id="blog-content"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (errors.content) setErrors((prev) => ({ ...prev, content: '' }));
            }}
            placeholder="Tulis isi artikel di sini..."
            rows={16}
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={Boolean(errors.content)}
            aria-describedby={errors.content ? 'blog-content-error' : undefined}
            className={`w-full rounded-lg border bg-neutral-800 px-4 py-2.5 text-neutral-100 placeholder-neutral-500 text-sm leading-relaxed resize-y transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.content
                ? 'border-red-500 focus:ring-red-500'
                : 'border-neutral-700 hover:border-neutral-600'
            }`}
          />
          {errors.content && (
            <p
              id="blog-content-error"
              role="alert"
              className="text-xs text-red-400 mt-0.5"
            >
              {errors.content}
            </p>
          )}
        </div>

        {/* Field: Excerpt (opsional) */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="blog-excerpt"
            className="text-sm font-medium text-neutral-200"
          >
            Excerpt{' '}
            <span className="text-neutral-500 font-normal">(opsional)</span>
          </label>
          <textarea
            id="blog-excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Ringkasan singkat artikel (maks 160 karakter). Jika kosong, akan diambil dari awal isi artikel."
            rows={3}
            maxLength={160}
            disabled={isSubmitting}
            aria-describedby="blog-excerpt-hint"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-neutral-100 placeholder-neutral-500 text-sm leading-relaxed resize-y transition-colors duration-150 hover:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p id="blog-excerpt-hint" className="text-xs text-neutral-500">
            {excerpt.length}/160 karakter
          </p>
        </div>

        {/* Field: Thumbnail URL (opsional) */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="blog-thumbnail"
            className="text-sm font-medium text-neutral-200"
          >
            URL Thumbnail{' '}
            <span className="text-neutral-500 font-normal">(opsional)</span>
          </label>
          <input
            id="blog-thumbnail"
            type="url"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="https://example.com/gambar.jpg"
            disabled={isSubmitting}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-neutral-100 placeholder-neutral-500 text-sm transition-colors duration-150 hover:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Tombol Aksi */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          {/* Simpan sebagai Draft */}
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            disabled={isSubmitting}
            aria-busy={isSubmitting && submitAction === 'draft'}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-600 bg-neutral-800 px-5 py-2.5 text-sm font-medium text-neutral-200 transition-colors duration-150 hover:bg-neutral-700 hover:border-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting && submitAction === 'draft' ? (
              <>
                <LoadingSpinner />
                Menyimpan...
              </>
            ) : (
              'Simpan sebagai Draft'
            )}
          </button>

          {/* Publikasikan */}
          <button
            type="button"
            onClick={() => handleSubmit('published')}
            disabled={isSubmitting}
            aria-busy={isSubmitting && submitAction === 'published'}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 transition-colors duration-150 hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting && submitAction === 'published' ? (
              <>
                <LoadingSpinner dark />
                Mempublikasikan...
              </>
            ) : (
              'Publikasikan'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * Spinner kecil untuk indikator loading di dalam tombol.
 * @param {{ dark?: boolean }} props
 */
function LoadingSpinner({ dark = false }) {
  return (
    <svg
      className={`w-4 h-4 animate-spin ${dark ? 'text-neutral-700' : 'text-neutral-400'}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
