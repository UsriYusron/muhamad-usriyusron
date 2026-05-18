'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * BlogEditor — Client Component
 *
 * Form editor artikel untuk membuat artikel baru atau mengedit artikel yang sudah ada.
 *
 * Fitur:
 *   - Mengelola lebih dari 1 Cover Image (wajib, minimal 2)
 *   - Mengelola paragraf terstruktur secara dinamis (opsional gambar di tiap paragraf)
 *   - Fitur reorder (Naik/Turun) dan hapus paragraf
 *   - Migrasi otomatis artikel lama (memisahkan isi teks berdasarkan \n\n menjadi paragraf)
 *   - Simpan draft ke localStorage jika sesi kedaluwarsa (HTTP 401)
 *
 * @param {{ article?: {
 *   _id: string,
 *   title: string,
 *   content: string,
 *   excerpt: string,
 *   coverImages?: string[],
 *   thumbnail?: string,
 *   paragraphs?: Array<{ text: string, imageUrl: string }>,
 *   status: 'draft' | 'pending' | 'published'
 * } }} props
 */
export default function BlogEditor({ article }) {
  const router = useRouter();
  const isEditMode = Boolean(article?._id);

  // State form — pre-fill dari props jika mode edit
  const [title, setTitle] = useState(article?.title ?? '');
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? '');
  
  // Minimal 1 gambar cover. Jika edit, ambil coverImages. Jika tidak ada, fallback ke thumbnail.
  const [coverImages, setCoverImages] = useState(() => {
    if (article?.coverImages && article.coverImages.length >= 1) {
      return article.coverImages;
    }
    if (article?.thumbnail) {
      return [article.thumbnail];
    }
    return [''];
  });

  // Paragraf dinamis. Jika edit, ambil paragraphs. Jika tidak ada, split content (\n\n).
  const [paragraphs, setParagraphs] = useState(() => {
    if (article?.paragraphs && article.paragraphs.length > 0) {
      return article.paragraphs;
    }
    if (article?.content) {
      return article.content.split('\n\n').map(text => ({ text, imageUrl: '' }));
    }
    return [{ text: '', imageUrl: '' }];
  });

  // State UI
  const [errors, setErrors] = useState({ title: '', coverImages: '', paragraphs: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAction, setSubmitAction] = useState(null); // 'draft' | 'pending'

  /**
   * Validasi field wajib sebelum submit.
   */
  function validate() {
    const newErrors = { title: '', coverImages: '', paragraphs: [] };
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = 'Judul artikel tidak boleh kosong.';
      isValid = false;
    }

    const filledCovers = coverImages.filter(img => img.trim() !== '');
    if (filledCovers.length < 1) {
      newErrors.coverImages = 'Cover blog wajib memiliki minimal 1 gambar cover valid (isi link gambarnya).';
      isValid = false;
    }

    const paragraphErrors = paragraphs.map((p, idx) => {
      if (!p.text.trim()) {
        return `Isi paragraf #${idx + 1} tidak boleh kosong.`;
      }
      return '';
    });

    if (paragraphErrors.some(err => err !== '')) {
      newErrors.paragraphs = paragraphErrors;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  /**
   * Handle modifikasi cover image
   */
  const handleCoverChange = (index, value) => {
    const newCovers = [...coverImages];
    newCovers[index] = value;
    setCoverImages(newCovers);
    if (errors.coverImages) setErrors(prev => ({ ...prev, coverImages: '' }));
  };

  const addCoverImage = () => {
    setCoverImages([...coverImages, '']);
  };

  const removeCoverImage = (index) => {
    if (coverImages.length <= 1) {
      alert('Cover blog wajib memiliki minimal 1 gambar cover.');
      return;
    }
    const newCovers = coverImages.filter((_, i) => i !== index);
    setCoverImages(newCovers);
  };

  /**
   * Handle modifikasi paragraf
   */
  const handleParagraphTextChange = (index, value) => {
    const newParas = [...paragraphs];
    newParas[index] = { ...newParas[index], text: value };
    setParagraphs(newParas);

    if (errors.paragraphs && errors.paragraphs[index]) {
      const newParaErrs = [...errors.paragraphs];
      newParaErrs[index] = '';
      setErrors(prev => ({ ...prev, paragraphs: newParaErrs }));
    }
  };

  const handleParagraphImageChange = (index, value) => {
    const newParas = [...paragraphs];
    newParas[index] = { ...newParas[index], imageUrl: value };
    setParagraphs(newParas);
  };

  const addParagraph = () => {
    setParagraphs([...paragraphs, { text: '', imageUrl: '' }]);
  };

  const removeParagraph = (index) => {
    if (paragraphs.length <= 1) {
      alert('Minimal harus ada 1 paragraf.');
      return;
    }
    const newParas = paragraphs.filter((_, i) => i !== index);
    setParagraphs(newParas);

    if (errors.paragraphs) {
      const newParaErrs = errors.paragraphs.filter((_, i) => i !== index);
      setErrors(prev => ({ ...prev, paragraphs: newParaErrs }));
    }
  };

  const moveParagraphUp = (index) => {
    if (index === 0) return;
    const newParas = [...paragraphs];
    const temp = newParas[index];
    newParas[index] = newParas[index - 1];
    newParas[index - 1] = temp;
    setParagraphs(newParas);

    if (errors.paragraphs) {
      const newParaErrs = [...errors.paragraphs];
      const tempErr = newParaErrs[index];
      newParaErrs[index] = newParaErrs[index - 1];
      newParaErrs[index - 1] = tempErr;
      setErrors(prev => ({ ...prev, paragraphs: newParaErrs }));
    }
  };

  const moveParagraphDown = (index) => {
    if (index === paragraphs.length - 1) return;
    const newParas = [...paragraphs];
    const temp = newParas[index];
    newParas[index] = newParas[index + 1];
    newParas[index + 1] = temp;
    setParagraphs(newParas);

    if (errors.paragraphs) {
      const newParaErrs = [...errors.paragraphs];
      const tempErr = newParaErrs[index];
      newParaErrs[index] = newParaErrs[index + 1];
      newParaErrs[index + 1] = tempErr;
      setErrors(prev => ({ ...prev, paragraphs: newParaErrs }));
    }
  };

  /**
   * Handler submit form.
   * @param {'draft' | 'pending'} status - Status artikel yang akan disimpan
   */
  async function handleSubmit(status) {
    if (!validate()) {
      alert('Mohon periksa kembali form Anda. Terdapat data yang tidak valid.');
      return;
    }

    setIsSubmitting(true);
    setSubmitAction(status);

    const payload = {
      title: title.trim(),
      coverImages: coverImages.filter(img => img.trim() !== ''),
      paragraphs: paragraphs.map(p => ({
        text: p.text.trim(),
        imageUrl: p.imageUrl.trim() || undefined,
      })),
      excerpt: excerpt.trim() || undefined,
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
              coverImages: coverImages.filter(img => img.trim() !== ''),
              paragraphs: paragraphs,
              excerpt: excerpt.trim(),
              savedAt: new Date().toISOString(),
            })
          );
        } catch {
          // localStorage tidak tersedia
        }
        router.push('/login?callbackUrl=/blog/new');
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error('[BlogEditor] Submit error:', data);
        alert(data.error ?? 'Terjadi kesalahan. Silakan coba lagi.');
        return;
      }

      alert(status === 'pending' ? 'Artikel berhasil diajukan untuk publikasi! Menunggu persetujuan admin.' : 'Draft artikel berhasil disimpan!');
      router.push('/');
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
        className="flex flex-col gap-8"
      >
        {/* Field: Judul */}
        <div className="flex flex-col gap-1.5 bg-neutral-900 p-5 rounded-xl border border-neutral-800">
          <label
            htmlFor="blog-title"
            className="text-sm font-semibold text-neutral-200"
          >
            Judul Artikel <span className="text-red-400" aria-hidden="true">*</span>
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
            className={`w-full rounded-lg border bg-neutral-800 px-4 py-2.5 text-neutral-100 placeholder-neutral-500 text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed ${
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

        {/* Section: Cover Blog (Wajib > 1) */}
        <div className="flex flex-col gap-4 bg-neutral-900 p-5 rounded-xl border border-neutral-800">
          <div>
            <h2 className="text-sm font-semibold text-neutral-200">
              Gambar Cover Blog (Minimal 2, Wajib) <span className="text-red-400">*</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Masukkan URL gambar untuk cover blog Anda. Harus menyertakan minimal 2 gambar berbeda.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {coverImages.map((cover, idx) => (
              <div key={idx} className="flex flex-col gap-2 p-3 bg-neutral-800 rounded-lg border border-neutral-700">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-neutral-400 min-w-[60px]">Cover #{idx + 1}</span>
                  <input
                    type="url"
                    value={cover}
                    onChange={(e) => handleCoverChange(idx, e.target.value)}
                    placeholder="https://example.com/cover.jpg"
                    disabled={isSubmitting}
                    className="flex-1 rounded-md border border-neutral-600 bg-neutral-700 px-3 py-1.5 text-neutral-100 placeholder-neutral-500 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:opacity-50"
                  />
                  {coverImages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCoverImage(idx)}
                      disabled={isSubmitting}
                      className="p-1.5 text-red-400 hover:bg-neutral-600 rounded-md transition-colors"
                      title="Hapus gambar cover"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {/* Preview Image */}
                <ImagePreview url={cover} alt={`Cover #${idx + 1}`} />
              </div>
            ))}
          </div>

          {errors.coverImages && (
            <p role="alert" className="text-xs text-red-400">
              {errors.coverImages}
            </p>
          )}

          <button
            type="button"
            onClick={addCoverImage}
            disabled={isSubmitting}
            className="self-start inline-flex items-center gap-1.5 rounded-lg border border-neutral-600 bg-neutral-800 px-3.5 py-2 text-xs font-medium text-neutral-200 transition-colors hover:bg-neutral-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Tambah Gambar Cover
          </button>
        </div>

        {/* Section: Paragraphs (Minimal 1, Wajib) */}
        <div className="flex flex-col gap-5 bg-neutral-900 p-5 rounded-xl border border-neutral-800">
          <div>
            <h2 className="text-sm font-semibold text-neutral-200">
              Daftar Paragraf Artikel <span className="text-red-400">*</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Tulis konten blog Anda per paragraf. Anda bisa menyisipkan gambar opsional untuk tiap paragraf yang ditulis.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {paragraphs.map((p, idx) => (
              <div key={idx} className="flex flex-col gap-3 p-4 bg-neutral-800 rounded-xl border border-neutral-700 relative">
                {/* Paragraph Header / Controls */}
                <div className="flex items-center justify-between border-b border-neutral-700 pb-2">
                  <span className="text-xs font-bold text-neutral-300">Paragraf #{idx + 1}</span>
                  
                  <div className="flex items-center gap-1.5">
                    {/* Move Up */}
                    <button
                      type="button"
                      onClick={() => moveParagraphUp(idx)}
                      disabled={idx === 0 || isSubmitting}
                      className="p-1 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700 rounded disabled:opacity-30 transition-colors"
                      title="Naikkan paragraf"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                      </svg>
                    </button>
                    {/* Move Down */}
                    <button
                      type="button"
                      onClick={() => moveParagraphDown(idx)}
                      disabled={idx === paragraphs.length - 1 || isSubmitting}
                      className="p-1 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700 rounded disabled:opacity-30 transition-colors"
                      title="Turunkan paragraf"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                    {/* Remove */}
                    {paragraphs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeParagraph(idx)}
                        disabled={isSubmitting}
                        className="p-1 text-red-400 hover:bg-neutral-700 rounded transition-colors ml-1"
                        title="Hapus paragraf"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Paragraph Content Textarea */}
                <div className="flex flex-col gap-1">
                  <label htmlFor={`para-text-${idx}`} className="sr-only">Teks Paragraf #{idx + 1}</label>
                  <textarea
                    id={`para-text-${idx}`}
                    value={p.text}
                    onChange={(e) => handleParagraphTextChange(idx, e.target.value)}
                    placeholder="Tulis teks paragraf di sini..."
                    rows={4}
                    disabled={isSubmitting}
                    className={`w-full rounded-md border bg-neutral-700 px-3 py-2 text-neutral-100 placeholder-neutral-500 text-xs leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:opacity-50 ${
                      errors.paragraphs && errors.paragraphs[idx]
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-neutral-600 hover:border-neutral-500'
                    }`}
                  />
                  {errors.paragraphs && errors.paragraphs[idx] && (
                    <p role="alert" className="text-[10px] text-red-400">
                      {errors.paragraphs[idx]}
                    </p>
                  )}
                </div>

                {/* Paragraph Optional Image */}
                <div className="flex flex-col gap-1">
                  <label htmlFor={`para-img-${idx}`} className="text-[10px] font-medium text-neutral-300">
                    URL Gambar Paragraf (Opsional)
                  </label>
                  <input
                    id={`para-img-${idx}`}
                    type="url"
                    value={p.imageUrl}
                    onChange={(e) => handleParagraphImageChange(idx, e.target.value)}
                    placeholder="https://example.com/gambar-paragraf.jpg"
                    disabled={isSubmitting}
                    className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-3 py-1.5 text-neutral-100 placeholder-neutral-500 text-[11px] focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:opacity-50"
                  />
                  <ImagePreview url={p.imageUrl} alt={`Gambar Paragraf #${idx + 1}`} />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addParagraph}
            disabled={isSubmitting}
            className="self-start inline-flex items-center gap-1.5 rounded-lg border border-neutral-600 bg-neutral-800 px-3.5 py-2 text-xs font-medium text-neutral-200 transition-colors hover:bg-neutral-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Tambah Paragraf Baru
          </button>
        </div>

        {/* Field: Excerpt (opsional) */}
        <div className="flex flex-col gap-1.5 bg-neutral-900 p-5 rounded-xl border border-neutral-800">
          <label
            htmlFor="blog-excerpt"
            className="text-sm font-semibold text-neutral-200"
          >
            Excerpt{' '}
            <span className="text-neutral-500 font-normal text-xs">(opsional)</span>
          </label>
          <textarea
            id="blog-excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Ringkasan singkat artikel (maks 160 karakter). Jika kosong, akan diambil dari awal paragraf pertama."
            rows={2}
            maxLength={160}
            disabled={isSubmitting}
            aria-describedby="blog-excerpt-hint"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-neutral-100 placeholder-neutral-500 text-sm leading-relaxed resize-y transition-all duration-150 hover:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p id="blog-excerpt-hint" className="text-xs text-neutral-500 self-end">
            {excerpt.length}/160 karakter
          </p>
        </div>

        {/* Tombol Aksi */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-neutral-800">
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

          {/* Publikasikan (Ajukan) */}
          <button
            type="button"
            onClick={() => handleSubmit('pending')}
            disabled={isSubmitting}
            aria-busy={isSubmitting && submitAction === 'pending'}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 transition-colors duration-150 hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting && submitAction === 'pending' ? (
              <>
                <LoadingSpinner dark />
                Mengajukan...
              </>
            ) : (
              'Ajukan Publikasi'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * Komponen pembantu untuk menampilkan preview gambar dari URL
 */
function ImagePreview({ url, alt }) {
  if (!url || !url.trim() || !url.startsWith('http')) return null;

  return (
    <div className="mt-2.5 relative max-w-sm aspect-video rounded-md overflow-hidden border border-neutral-600 bg-neutral-900 shadow-inner group">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        onError={(e) => {
          // Jika URL gambar salah/rusak, sembunyikan preview
          e.target.style.display = 'none';
        }}
      />
    </div>
  );
}

/**
 * Spinner kecil untuk indikator loading di dalam tombol.
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
