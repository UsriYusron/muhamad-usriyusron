# Implementation Plan: Blog System

## Overview

Implementasi Blog System secara bertahap mengikuti arsitektur Next.js App Router. Dimulai dari fondasi data layer (MongoDB, Mongoose models, koneksi DB), lalu autentikasi (NextAuth.js), kemudian API routes, komponen UI, halaman-halaman blog, dan terakhir integrasi ke Navbar dan Footer yang sudah ada.

## Tasks

- [x] 1. Setup fondasi: koneksi MongoDB dan Mongoose models
  - [x] 1.1 Buat `lib/mongodb.js` dengan singleton pattern untuk koneksi MongoDB
    - Implementasikan `connectDB()` dengan caching `global.mongoose`
    - Tangani error koneksi dengan melempar exception (akan ditangkap API route → HTTP 503)
    - _Requirements: 7.5_

  - [x] 1.2 Buat Mongoose model `lib/models/Article.js`
    - Definisikan `ArticleSchema` dengan semua field: `title`, `slug`, `content`, `excerpt`, `thumbnail`, `authorId`, `authorName`, `status`, `publishedAt`, dan `timestamps`
    - Tambahkan index: `{ slug: 1 }` (unique), `{ status: 1, publishedAt: -1 }`, `{ authorId: 1 }`
    - _Requirements: 7.1, 7.3, 7.4_

  - [x] 1.3 Buat Mongoose model `lib/models/User.js`
    - Definisikan `UserSchema` dengan field: `name`, `email`, `image`, `provider`, dan `timestamps`
    - Tambahkan index unik pada `email`
    - _Requirements: 7.2_

  - [ ]* 1.4 Tulis unit tests untuk Article dan User model
    - Test validasi field required (`title`, `content`, `slug`, `email`)
    - Test enum validation untuk `status` dan `provider`
    - Test default value untuk `status` (`"draft"`) dan `thumbnail` (`null`)
    - _Requirements: 7.1, 7.2_

- [x] 2. Implementasi slug generation
  - [x] 2.1 Buat `lib/blog/slugify.js` dengan fungsi `generateSlug` dan `ensureUniqueSlug`
    - `generateSlug`: lowercase, trim, hapus karakter non-alfanumerik, ganti spasi dengan `-`, hapus duplikat `-`
    - `ensureUniqueSlug`: query MongoDB untuk cek keunikan, tambahkan sufiks `-2`, `-3` dst. jika perlu
    - _Requirements: 3.3, 3.4_

  - [ ]* 2.2 Tulis property test untuk `generateSlug` (Property 1)
    - **Property 1: Slug generation adalah fungsi deterministik**
    - **Validates: Requirements 3.3**
    - Gunakan `fast-check` dengan `fc.string({ minLength: 1 })` sebagai arbitrary
    - Assert: slug hanya mengandung `[a-z0-9-]*`, tidak diawali/diakhiri `-`, tidak ada `--`
    - Konfigurasi minimum 100 iterasi (`{ numRuns: 100 }`)

  - [ ]* 2.3 Tulis unit tests untuk `slugify.js`
    - `generateSlug("Hello World")` → `"hello-world"`
    - `generateSlug("Cara Belajar Next.js!")` → `"cara-belajar-nextjs"`
    - `generateSlug("  spasi  di  awal  akhir  ")` → `"spasi-di-awal-akhir"`
    - `generateSlug("")` → `""` (string kosong)
    - `ensureUniqueSlug` menambahkan `-2`, `-3` dst. jika slug sudah ada
    - _Requirements: 3.3, 3.4_

- [x] 3. Setup autentikasi NextAuth.js
  - [x] 3.1 Install dependensi: `next-auth`, `mongoose`, `@auth/mongodb-adapter`
    - Tambahkan ke `package.json` dengan versi yang di-pin
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 3.2 Buat `app/api/auth/[...nextauth]/route.js` dengan konfigurasi NextAuth.js
    - Konfigurasi `GoogleProvider` dan `GitHubProvider`
    - Gunakan `MongoDBAdapter` untuk menyimpan sesi ke MongoDB
    - Tambahkan callback `session` untuk menyertakan `user.id` di sesi
    - _Requirements: 1.1, 1.2, 1.3, 1.6_

  - [x] 3.3 Buat `middleware.js` di root project untuk proteksi route
    - Export `default` dari `next-auth/middleware`
    - Konfigurasi `matcher` untuk `/blog/new` dan `/blog/:slug*/edit`
    - _Requirements: 2.1, 2.2_

  - [x] 3.4 Buat halaman login `app/(auth)/login/page.js`
    - Tampilkan tombol "Login dengan Google" dan "Login dengan GitHub"
    - Tampilkan pesan error dari query param `?error=...` jika ada
    - Tambahkan tombol "Logout" yang memanggil `signOut()` dari NextAuth.js
    - _Requirements: 1.1, 1.2, 1.4, 1.5_

  - [ ]* 3.5 Tulis unit tests untuk halaman login
    - Test render tombol Google dan GitHub
    - Test tampilan pesan error saat query param `error` ada
    - _Requirements: 1.1, 1.2, 1.4_

- [x] 4. Checkpoint — Pastikan semua tests lulus
  - Pastikan semua tests lulus, tanyakan kepada user jika ada pertanyaan.

- [x] 5. Implementasi API routes blog
  - [x] 5.1 Buat `app/api/blog/route.js` untuk `GET` (list) dan `POST` (create)
    - `GET`: query artikel dengan `status: 'published'`, sort `publishedAt: -1`, support pagination (`page`, `limit`)
    - `POST`: validasi sesi dengan `getServerSession`, validasi field `title` dan `content` (tidak boleh kosong/whitespace), generate slug, auto-generate excerpt jika kosong (160 karakter pertama dari content), simpan ke MongoDB
    - Tangani error koneksi MongoDB → HTTP 503
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 5.1, 5.6, 7.5_

  - [ ]* 5.2 Tulis property test untuk validasi field wajib artikel (Property 7)
    - **Property 7: Validasi field wajib artikel**
    - **Validates: Requirements 3.7**
    - Gunakan `fast-check` untuk generate string kosong atau hanya whitespace sebagai `title`/`content`
    - Assert: API mengembalikan HTTP 400 dan tidak menyimpan data ke database

  - [x] 5.3 Buat `app/api/blog/[id]/route.js` untuk `PUT` (update) dan `DELETE` (delete)
    - `PUT`: validasi sesi, cek ownership (`session.user.id === article.authorId`), update artikel, set `updatedAt`
    - `DELETE`: validasi sesi, cek ownership, hapus artikel dari MongoDB
    - Kembalikan HTTP 403 jika ownership check gagal
    - _Requirements: 4.2, 4.3, 4.4, 4.5_

  - [ ]* 5.4 Tulis property test untuk ownership check (Property 4)
    - **Property 4: Ownership check pada operasi write**
    - **Validates: Requirements 4.3, 4.5**
    - Gunakan `fast-check` untuk generate pasangan `userId` dan `authorId` yang berbeda
    - Assert: PUT dan DELETE mengembalikan HTTP 403 dan database tidak berubah

  - [ ]* 5.5 Tulis unit tests untuk API routes
    - POST dengan body valid → 201 Created
    - POST tanpa `title` → 400 Bad Request
    - POST tanpa `content` → 400 Bad Request
    - POST tanpa sesi → 401 Unauthorized
    - PUT dengan `authorId` berbeda → 403 Forbidden
    - DELETE dengan `authorId` berbeda → 403 Forbidden
    - _Requirements: 3.1, 3.7, 4.3, 4.5_

- [x] 6. Implementasi `lib/blog/actions.js` untuk server-side data fetching
  - [x] 6.1 Buat fungsi `getPublishedArticles(page, limit)` untuk Blog_Feed
    - Query artikel `status: 'published'`, sort `publishedAt: -1`, dengan pagination
    - Return `{ articles, total, page, totalPages }`
    - _Requirements: 5.1, 5.5, 5.6_

  - [x] 6.2 Buat fungsi `getArticleBySlug(slug)` untuk halaman detail artikel
    - Query artikel berdasarkan `slug` dan `status: 'published'`
    - Return `null` jika tidak ditemukan atau status `draft`
    - _Requirements: 5.2, 5.3, 5.4_

  - [x] 6.3 Buat fungsi `getLatestArticlesForFooter(limit = 3)` untuk Footer preview
    - Query maksimal 3 artikel `status: 'published'`, sort `publishedAt: -1`
    - Return hanya field yang dibutuhkan: `title`, `slug`, `excerpt`, `thumbnail`, `publishedAt`
    - _Requirements: 6.1, 6.2_

  - [ ]* 6.4 Tulis property test untuk artikel draft tidak terlihat Visitor (Property 3)
    - **Property 3: Artikel draft tidak terlihat oleh Visitor**
    - **Validates: Requirements 5.1, 5.4**
    - Gunakan `fast-check` untuk generate kumpulan artikel dengan status campuran
    - Assert: semua artikel yang dikembalikan `getPublishedArticles` dan `getArticleBySlug` memiliki `status === "published"`

  - [ ]* 6.5 Tulis property test untuk Footer preview hanya published (Property 6)
    - **Property 6: Article Preview di Footer hanya menampilkan artikel published**
    - **Validates: Requirements 6.1, 6.2**
    - Assert: `getLatestArticlesForFooter` selalu mengembalikan `status === "published"` dan jumlah ≤ 3

  - [ ]* 6.6 Tulis property test untuk excerpt dalam batas karakter (Property 5)
    - **Property 5: Excerpt selalu dalam batas karakter**
    - **Validates: Requirements 5.5, 7.1**
    - Gunakan `fast-check` untuk generate string dengan panjang acak sebagai `excerpt`
    - Assert: excerpt yang tersimpan tidak melebihi 160 karakter

- [x] 7. Checkpoint — Pastikan semua tests lulus
  - Pastikan semua tests lulus, tanyakan kepada user jika ada pertanyaan.

- [x] 8. Implementasi komponen blog
  - [x] 8.1 Buat `components/blog/ArticleCard.js`
    - Tampilkan: judul, excerpt (maks 160 karakter), thumbnail (atau placeholder jika tidak ada), nama Author, tanggal publikasi
    - Buat sebagai link ke `/blog/[slug]`
    - _Requirements: 5.5_

  - [x] 8.2 Buat `components/blog/ArticlePreview.js` untuk Footer
    - Tampilkan maksimal 3 artikel: judul, excerpt (maks 100 karakter), thumbnail (atau placeholder default), tanggal publikasi
    - Setiap preview adalah link ke `/blog/[slug]`
    - Tampilkan pesan "Belum ada artikel yang dipublikasikan" jika array kosong
    - _Requirements: 6.3, 6.4, 6.5, 6.6_

  - [x] 8.3 Buat `components/blog/BlogEditor.js` (Client Component)
    - Form dengan field: `title`, `content` (textarea), `excerpt` (opsional), `thumbnail` URL (opsional)
    - Validasi client-side: tampilkan pesan error inline jika `title` atau `content` kosong
    - Tombol "Simpan sebagai Draft" dan "Publikasikan"
    - Simpan draft ke `localStorage` jika sesi kedaluwarsa
    - Support mode buat baru (props kosong) dan mode edit (props berisi data artikel)
    - _Requirements: 2.3, 2.4, 3.1, 3.5, 3.6, 3.7, 4.1_

  - [x] 8.4 Buat `components/blog/BlogFeed.js`
    - Render daftar `ArticleCard` dari props `articles`
    - Tampilkan navigasi pagination (prev/next) berdasarkan `totalPages` dan `page`
    - _Requirements: 5.1, 5.5, 5.6_

  - [x] 8.5 Buat `components/blog/DeleteConfirmDialog.js`
    - Dialog konfirmasi sebelum menghapus artikel
    - Tombol "Hapus" memanggil API DELETE, tombol "Batal" menutup dialog
    - Setelah hapus berhasil, redirect ke `/blog`
    - _Requirements: 4.4, 4.6_

  - [ ]* 8.6 Tulis unit tests untuk komponen blog
    - `ArticlePreview` merender judul, excerpt, dan tanggal dengan benar
    - `ArticlePreview` menampilkan pesan kosong jika array artikel kosong
    - `BlogEditor` menampilkan pesan validasi saat field `title` atau `content` kosong
    - `BlogFeed` merender pagination dengan benar
    - _Requirements: 3.7, 5.5, 5.6, 6.3, 6.5_

- [x] 9. Implementasi halaman-halaman blog
  - [x] 9.1 Buat `app/blog/page.js` sebagai Blog_Feed (Server Component)
    - Panggil `getPublishedArticles` dengan pagination dari search params
    - Render `BlogFeed` dengan data artikel
    - _Requirements: 5.1, 5.5, 5.6_

  - [x] 9.2 Buat `app/blog/[slug]/page.js` sebagai halaman detail artikel (Server Component)
    - Panggil `getArticleBySlug(slug)`, kembalikan `notFound()` jika null
    - Render konten artikel lengkap dengan judul, thumbnail, nama Author, tanggal, dan konten
    - _Requirements: 5.2, 5.3, 5.4_

  - [x] 9.3 Buat `app/blog/new/page.js` sebagai halaman buat artikel baru (protected)
    - Cek sesi dengan `getServerSession`, redirect ke `/login` jika tidak ada sesi
    - Render `BlogEditor` tanpa props artikel (mode buat baru)
    - _Requirements: 2.1, 2.3_

  - [x] 9.4 Buat `app/blog/[slug]/edit/page.js` sebagai halaman edit artikel (protected)
    - Cek sesi dengan `getServerSession`, redirect ke `/login` jika tidak ada sesi
    - Fetch data artikel berdasarkan slug, render `BlogEditor` dengan data artikel
    - _Requirements: 2.2, 4.1_

  - [x] 9.5 Buat `app/blog/error.js` sebagai error boundary untuk halaman blog
    - Tampilkan UI fallback yang ramah pengguna saat terjadi error rendering
    - _Requirements: 7.5_

- [x] 10. Integrasi ke Navbar dan Footer
  - [x] 10.1 Modifikasi `components/Navbar.jsx` untuk menambahkan navigasi blog
    - Tambahkan link "Blog" yang mengarah ke `/blog` (selalu tampil)
    - Tambahkan link "Tulis Artikel" ke `/blog/new` jika sesi aktif (Author)
    - Tampilkan tombol "Login" jika belum ada sesi (Visitor)
    - Gunakan `useSession` dari NextAuth.js untuk membaca state autentikasi
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 10.2 Modifikasi `components/Footer.js` untuk menambahkan Article Preview section
    - Ubah `Footer` menjadi async Server Component
    - Panggil `getLatestArticlesForFooter()` untuk mengambil 3 artikel terbaru
    - Render `ArticlePreview` di area konten utama footer, tepat di atas `StickyFooter`
    - Tambahkan link "Lihat Semua Artikel" yang mengarah ke `/blog`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 8.4_

  - [x] 10.3 Update `app/layout.js` untuk menyertakan `SessionProvider` dari NextAuth.js
    - Bungkus children dengan `SessionProvider` agar `useSession` dapat digunakan di Client Components
    - _Requirements: 1.6, 2.5_

- [x] 11. Checkpoint — Pastikan semua tests lulus
  - Pastikan semua tests lulus, tanyakan kepada user jika ada pertanyaan.

- [ ]* 12. Tulis property test untuk slug uniqueness (Property 2)
  - **Property 2: Slug uniqueness setelah insert**
  - **Validates: Requirements 3.3, 3.4**
  - Gunakan `fast-check` untuk generate kumpulan judul artikel acak
  - Assert: setelah semua artikel disimpan, tidak ada dua artikel dengan `slug` yang sama

- [ ] 13. Final checkpoint — Pastikan semua tests lulus
  - Pastikan semua tests lulus, tanyakan kepada user jika ada pertanyaan.

## Notes

- Tasks bertanda `*` bersifat opsional dan dapat dilewati untuk MVP yang lebih cepat
- Setiap task mereferensikan requirement spesifik untuk keterlacakan
- Property tests menggunakan `fast-check` dengan minimum 100 iterasi per property
- Unit tests menggunakan Jest (standar ekosistem Next.js)
- Semua operasi tulis (POST, PUT, DELETE) diproteksi dengan `getServerSession` dari NextAuth.js
- Slug selalu di-generate di sisi server untuk menghindari race condition
