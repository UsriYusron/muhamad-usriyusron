import Article from '@/lib/models/Article';

/**
 * Menghasilkan slug dari judul artikel.
 * Contoh: "Cara Belajar Next.js!" → "cara-belajar-nextjs"
 *
 * Edge case: jika judul hanya berisi karakter non-alfanumerik,
 * fungsi akan mengembalikan string kosong tanpa leading/trailing dash.
 */
export function generateSlug(title) {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // hapus karakter non-alfanumerik (kecuali spasi & -)
    .replace(/\s+/g, '-')          // ganti spasi dengan -
    .replace(/-+/g, '-')           // hapus duplikat -
    .replace(/^-+|-+$/g, '');      // hapus leading/trailing -

  return slug;
}

/**
 * Memastikan slug unik di database.
 * Jika slug sudah ada, tambahkan sufiks numerik: slug-2, slug-3, dst.
 *
 * @param {string} baseSlug - Slug dasar yang akan dicek keunikannya
 * @param {string|null} excludeId - ID artikel yang dikecualikan (untuk kasus edit)
 * @returns {Promise<string>} Slug yang unik
 */
export async function ensureUniqueSlug(baseSlug, excludeId = null) {
  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };

    const existing = await Article.findOne(query);
    if (!existing) return slug;

    slug = `${baseSlug}-${counter++}`;
  }
}
