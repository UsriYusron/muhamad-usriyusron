import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongoClient';

/**
 * Konfigurasi NextAuth.js
 *
 * - GoogleProvider dan GitHubProvider untuk OAuth (Requirements 1.1, 1.2)
 * - MongoDBAdapter menyimpan sesi, akun, dan user ke MongoDB (Requirement 1.3)
 * - Callback session menyertakan user.id agar tersedia di sisi client (Requirement 1.6)
 */
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  adapter: MongoDBAdapter(clientPromise),

  callbacks: {
    /**
     * Menyertakan user.id ke dalam objek sesi agar dapat digunakan
     * di API routes dan komponen client untuk ownership check.
     */
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: '/login',
    error: '/login',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
