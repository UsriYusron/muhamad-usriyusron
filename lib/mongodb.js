import mongoose from 'mongoose';

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Menghubungkan ke MongoDB menggunakan singleton pattern.
 * Koneksi di-cache di `global.mongoose` agar tidak membuat koneksi baru
 * pada setiap request (penting untuk lingkungan serverless Next.js).
 *
 * Jika koneksi gagal, exception dilempar ke pemanggil (API route)
 * yang bertanggung jawab mengembalikan HTTP 503 Service Unavailable.
 *
 * @returns {Promise<typeof mongoose>} Instance mongoose yang terhubung
 * @throws {Error} Jika koneksi ke MongoDB gagal
 */
export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e; // akan ditangkap oleh API route → HTTP 503
  }

  return cached.conn;
}
