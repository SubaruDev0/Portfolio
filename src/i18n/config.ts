import { Locale } from '@/types';

export const supportedLocales: Locale[] = ['es', 'en', 'pt', 'ja'];
export const defaultLocale: Locale = 'es';

export function isSupportedLocale(value: string): value is Locale {
  return supportedLocales.includes(value as Locale);
}

export function normalizeLocaleFromAcceptLanguage(acceptLanguage?: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const parsed = acceptLanguage
    .split(',')
    .map((raw) => raw.trim())
    .map((token) => {
      const [langPart, ...params] = token.split(';').map((part) => part.trim());
      const qParam = params.find((param) => param.startsWith('q='));
      const qValue = qParam ? Number.parseFloat(qParam.slice(2)) : 1;
      return {
        lang: (langPart || '').toLowerCase(),
        q: Number.isFinite(qValue) ? qValue : 1,
      };
    })
    .filter((entry) => Boolean(entry.lang))
    .sort((a, b) => b.q - a.q);

  for (const entry of parsed) {
    if (isSupportedLocale(entry.lang)) return entry.lang;

    const baseToken = entry.lang.split('-')[0];
    if (baseToken && isSupportedLocale(baseToken)) {
      return baseToken;
    }
  }

  return defaultLocale;
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const firstSegment = pathname.split('/').filter(Boolean)[0] || '';
  return isSupportedLocale(firstSegment) ? firstSegment : null;
}
