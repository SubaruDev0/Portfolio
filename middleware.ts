import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  defaultLocale,
  getLocaleFromPathname,
  normalizeLocaleFromAcceptLanguage,
} from '@/i18n/config';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/logos') ||
    pathname.startsWith('/projects') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next();
  }

  if (pathname === '/') {
    const preferred = normalizeLocaleFromAcceptLanguage(request.headers.get('accept-language'));
    const url = request.nextUrl.clone();
    url.pathname = `/${preferred}`;
    return NextResponse.redirect(url);
  }

  const localeFromPath = getLocaleFromPathname(pathname) ?? defaultLocale;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', localeFromPath);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\..*).*)'],
};
