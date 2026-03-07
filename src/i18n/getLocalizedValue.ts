import { I18nMap, Locale } from '@/types';

export function getLocalizedValue(baseEs: string, i18nMap: I18nMap | null | undefined, locale: Locale): string {
  if (locale === 'es') return (baseEs || '').trim();

  const localized = i18nMap?.[locale];
  if (typeof localized === 'string' && localized.trim().length > 0) {
    return localized.trim();
  }

  return (baseEs || '').trim();
}
