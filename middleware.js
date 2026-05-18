import { auth } from '@/app/api/auth/[...nextauth]/route';

export async function middleware(request) {
  const session = await auth();
  
  if (session) {
    return;
  }
}

export const config = {
  matcher: ['/blog/new', '/blog/:id/edit'],
};
