import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth');
  const { pathname } = request.nextUrl;

  // Redirect authenticated users away from auth pages
  if (authCookie && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  // Protect /app routes
  if (!authCookie && pathname.startsWith('/app')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*', '/login', '/register'],
}; 