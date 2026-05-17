# Requirements Document

## Introduction

Fitur Blog System adalah modul penulisan dan publikasi artikel yang terintegrasi ke dalam website portofolio pribadi berbasis Next.js. Fitur ini memungkinkan pemilik website untuk menulis, mengelola, dan mempublikasikan artikel setelah melakukan autentikasi. Pengunjung dapat membaca artikel tanpa login. Preview artikel terbaru ditampilkan di dalam komponen `Footer.js`, tepat di atas area sticky footer, sebagai daya tarik visual bagi pengunjung.

Sistem menggunakan MongoDB sebagai database, NextAuth.js untuk autentikasi dengan provider Google dan GitHub, dan mengikuti konvensi App Router Next.js.

---

## Glossary

- **Blog_System**: Keseluruhan modul fitur blog dalam website portofolio ini.
- **Article**: Konten tulisan yang dibuat oleh Author, terdiri dari judul, isi, slug, status publikasi, dan metadata waktu.
- **Author**: Pengguna yang telah terautentikasi dan memiliki hak untuk membuat, mengedit, dan menghapus artikel miliknya.
- **Visitor**: Pengguna yang mengakses website tanpa autentikasi; hanya dapat membaca artikel yang dipublikasikan.
- **Auth_System**: Modul autentikasi berbasis NextAuth.js dengan provider Google dan GitHub.
- **Blog_Editor**: Antarmuka penulisan artikel yang tersedia bagi Author yang telah login.
- **Blog_Feed**: Halaman daftar artikel yang dapat diakses oleh Visitor maupun Author.
- **Article_Preview**: Ringkasan singkat artikel (judul, excerpt, tanggal, thumbnail) yang ditampilkan di dalam `Footer.js` di atas sticky footer.
- **MongoDB_Store**: Lapisan penyimpanan data menggunakan MongoDB.
- **Slug**: Identifikasi URL unik berbasis teks untuk setiap artikel (contoh: `cara-belajar-nextjs`).
- **Draft**: Status artikel yang belum dipublikasikan; hanya terlihat oleh Author pemiliknya.
- **Published**: Status artikel yang telah dipublikasikan dan dapat dibaca oleh Visitor.

---

## Requirements

### Requirement 1: Autentikasi Pengguna

**User Story:** Sebagai pemilik website, saya ingin login menggunakan akun Google atau GitHub, agar saya dapat mengakses fitur penulisan blog dengan aman.

#### Acceptance Criteria

1. WHEN pengguna mengklik tombol "Login dengan Google", THE Auth_System SHALL mengarahkan pengguna ke halaman OAuth Google dan mengembalikan sesi yang valid setelah otorisasi berhasil.
2. WHEN pengguna mengklik tombol "Login dengan GitHub", THE Auth_System SHALL mengarahkan pengguna ke halaman OAuth GitHub dan mengembalikan sesi yang valid setelah otorisasi berhasil.
3. WHEN autentikasi OAuth berhasil, THE Auth_System SHALL menyimpan data sesi pengguna (nama, email, foto profil, provider) ke dalam MongoDB_Store.
4. IF provider OAuth mengembalikan error atau pengguna membatalkan otorisasi, THEN THE Auth_System SHALL menampilkan pesan error yang deskriptif dan mengarahkan pengguna kembali ke halaman login.
5. WHEN pengguna mengklik tombol "Logout", THE Auth_System SHALL menghapus sesi aktif dan mengarahkan pengguna ke halaman utama.
6. WHILE sesi pengguna aktif, THE Auth_System SHALL mempertahankan status login selama token sesi belum kedaluwarsa.

---

### Requirement 2: Proteksi Akses Penulisan Blog

**User Story:** Sebagai pemilik website, saya ingin hanya pengguna yang sudah login yang dapat membuat artikel, agar konten blog tetap terkontrol.

#### Acceptance Criteria

1. WHEN Visitor mengakses halaman pembuatan artikel (`/blog/new`), THE Blog_System SHALL mengarahkan Visitor ke halaman login.
2. WHEN Visitor mengakses halaman pengeditan artikel (`/blog/[slug]/edit`), THE Blog_System SHALL mengarahkan Visitor ke halaman login.
3. WHEN Author yang telah login mengakses halaman pembuatan artikel, THE Blog_System SHALL menampilkan Blog_Editor.
4. IF token sesi Author kedaluwarsa saat mengisi Blog_Editor, THEN THE Blog_System SHALL menyimpan draft sementara di localStorage dan mengarahkan Author ke halaman login.
5. THE Blog_System SHALL memvalidasi sesi pengguna pada setiap request ke API route yang memerlukan autentikasi menggunakan NextAuth.js `getServerSession`.

---

### Requirement 3: Pembuatan Artikel

**User Story:** Sebagai Author, saya ingin membuat artikel baru dengan judul, isi, dan thumbnail, agar saya dapat berbagi tulisan kepada pengunjung website.

#### Acceptance Criteria

1. WHEN Author menyimpan artikel baru, THE Blog_Editor SHALL mengirim data artikel ke API route `/api/blog` dengan method POST.
2. WHEN API route menerima data artikel yang valid, THE MongoDB_Store SHALL menyimpan artikel dengan field: `title`, `slug`, `content`, `excerpt`, `thumbnail`, `authorId`, `status` (default: `"draft"`), `createdAt`, dan `updatedAt`.
3. THE Blog_System SHALL menghasilkan Slug secara otomatis dari judul artikel dengan mengubah huruf menjadi lowercase, mengganti spasi dengan tanda hubung, dan menghapus karakter non-alfanumerik.
4. IF Slug yang dihasilkan sudah ada di MongoDB_Store, THEN THE Blog_System SHALL menambahkan sufiks numerik unik pada Slug (contoh: `judul-artikel-2`).
5. WHEN Author mengklik tombol "Simpan sebagai Draft", THE Blog_Editor SHALL menyimpan artikel dengan status `"draft"`.
6. WHEN Author mengklik tombol "Publikasikan", THE Blog_Editor SHALL menyimpan artikel dengan status `"published"` dan mengisi field `publishedAt` dengan waktu saat ini.
7. IF field `title` atau `content` kosong saat Author mencoba menyimpan, THEN THE Blog_Editor SHALL menampilkan pesan validasi dan mencegah pengiriman data ke server.

---

### Requirement 4: Pengeditan dan Penghapusan Artikel

**User Story:** Sebagai Author, saya ingin mengedit dan menghapus artikel yang sudah saya buat, agar saya dapat menjaga kualitas dan relevansi konten.

#### Acceptance Criteria

1. WHEN Author mengakses halaman edit artikel miliknya, THE Blog_Editor SHALL menampilkan form yang telah terisi dengan data artikel yang ada.
2. WHEN Author menyimpan perubahan artikel, THE MongoDB_Store SHALL memperbarui dokumen artikel yang sesuai dan mengisi field `updatedAt` dengan waktu saat ini.
3. IF Author mencoba mengedit artikel milik Author lain, THEN THE Blog_System SHALL mengembalikan HTTP 403 Forbidden dan menampilkan pesan "Anda tidak memiliki izin untuk mengedit artikel ini".
4. WHEN Author mengklik tombol "Hapus" dan mengonfirmasi penghapusan, THE MongoDB_Store SHALL menghapus dokumen artikel secara permanen dari database.
5. IF Author mencoba menghapus artikel milik Author lain, THEN THE Blog_System SHALL mengembalikan HTTP 403 Forbidden.
6. WHEN penghapusan artikel berhasil, THE Blog_System SHALL mengarahkan Author ke halaman Blog_Feed.

---

### Requirement 5: Pembacaan Artikel oleh Pengunjung

**User Story:** Sebagai Visitor, saya ingin membaca artikel yang dipublikasikan tanpa perlu login, agar saya dapat menikmati konten blog dengan bebas.

#### Acceptance Criteria

1. THE Blog_Feed SHALL menampilkan daftar semua artikel dengan status `"published"`, diurutkan berdasarkan `publishedAt` dari yang terbaru.
2. WHEN Visitor mengakses URL `/blog/[slug]`, THE Blog_System SHALL menampilkan konten lengkap artikel yang sesuai dengan Slug tersebut.
3. IF Slug yang diakses tidak ditemukan di MongoDB_Store, THEN THE Blog_System SHALL menampilkan halaman 404 dengan pesan "Artikel tidak ditemukan".
4. IF artikel yang diakses memiliki status `"draft"`, THEN THE Blog_System SHALL menampilkan halaman 404 kepada Visitor.
5. THE Blog_Feed SHALL menampilkan informasi berikut untuk setiap artikel: judul, excerpt (maksimal 160 karakter), thumbnail, nama Author, dan tanggal publikasi.
6. WHEN Visitor mengakses Blog_Feed, THE Blog_System SHALL menampilkan maksimal 10 artikel per halaman dengan navigasi pagination.

---

### Requirement 6: Tampilan Article Preview di Footer

**User Story:** Sebagai pengunjung website, saya ingin melihat preview artikel terbaru di bagian footer, agar saya tertarik untuk membaca blog lebih lanjut.

#### Acceptance Criteria

1. THE Footer.js SHALL menampilkan Article_Preview dari maksimal 3 artikel terbaru dengan status `"published"` di area konten utama footer, tepat di atas komponen StickyFooter.
2. WHEN halaman utama dimuat, THE Blog_System SHALL mengambil data 3 artikel terbaru dari MongoDB_Store melalui server-side data fetching.
3. THE Article_Preview SHALL menampilkan: judul artikel, excerpt (maksimal 100 karakter), thumbnail (jika tersedia), dan tanggal publikasi.
4. WHEN Visitor mengklik Article_Preview, THE Blog_System SHALL mengarahkan Visitor ke halaman detail artikel (`/blog/[slug]`).
5. IF tidak ada artikel dengan status `"published"` di MongoDB_Store, THEN THE Footer.js SHALL menampilkan pesan "Belum ada artikel yang dipublikasikan" di area Article_Preview.
6. WHERE thumbnail artikel tidak tersedia, THE Article_Preview SHALL menampilkan placeholder image default.

---

### Requirement 7: Penyimpanan Data di MongoDB

**User Story:** Sebagai developer, saya ingin semua data blog tersimpan dengan struktur yang konsisten di MongoDB, agar data mudah dikelola dan di-query.

#### Acceptance Criteria

1. THE MongoDB_Store SHALL menyimpan setiap artikel dalam collection `articles` dengan schema yang mencakup field: `_id`, `title` (string, required), `slug` (string, unique, required), `content` (string, required), `excerpt` (string, maks 160 karakter), `thumbnail` (string, URL), `authorId` (ObjectId, ref: `users`), `authorName` (string), `status` (enum: `"draft"` | `"published"`), `createdAt` (Date), `updatedAt` (Date), `publishedAt` (Date, nullable).
2. THE MongoDB_Store SHALL menyimpan data pengguna dalam collection `users` dengan field: `_id`, `name`, `email` (unique), `image`, `provider` (enum: `"google"` | `"github"`), `createdAt`.
3. THE Blog_System SHALL membuat index unik pada field `slug` di collection `articles` untuk memastikan tidak ada duplikasi Slug.
4. THE Blog_System SHALL membuat index pada field `status` dan `publishedAt` di collection `articles` untuk mengoptimalkan query Blog_Feed.
5. WHEN koneksi ke MongoDB_Store gagal, THE Blog_System SHALL mengembalikan HTTP 503 Service Unavailable dan mencatat error ke console server.

---

### Requirement 8: Navigasi Blog

**User Story:** Sebagai pengunjung, saya ingin dapat menavigasi ke halaman blog dari navbar dan footer, agar saya mudah menemukan konten blog.

#### Acceptance Criteria

1. THE Navbar SHALL menampilkan tautan navigasi ke halaman Blog_Feed (`/blog`).
2. WHEN Author telah login, THE Navbar SHALL menampilkan tautan "Tulis Artikel" yang mengarah ke `/blog/new`.
3. WHILE Author belum login, THE Navbar SHALL menampilkan tombol "Login" sebagai pengganti tautan "Tulis Artikel".
4. THE Footer.js SHALL menampilkan tautan "Lihat Semua Artikel" yang mengarah ke halaman Blog_Feed (`/blog`).
