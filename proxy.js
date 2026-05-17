// Middleware proteksi route untuk Blog System
// Requirements: 2.1, 2.2
// Mengarahkan Visitor yang belum login ke halaman login
// saat mengakses /blog/new atau /blog/:slug/edit

import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function proxy(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/blog/new', '/blog/:slug*/edit'],
};
