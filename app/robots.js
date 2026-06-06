/**
 * Next.js Dynamic Robots.txt Generator
 * Menghasilkan instruksi robots.txt untuk crawler Google & search engine lainnya.
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',          // Jangan indeks route API
          '/admin/',        // Jangan indeks panel admin
          '/*/edit',        // Jangan indeks halaman pengeditan artikel
          '/login',         // Jangan indeks halaman login
        ],
      },
    ],
    sitemap: 'https://muhamad-usriyusron.site/sitemap.xml',
  };
}
