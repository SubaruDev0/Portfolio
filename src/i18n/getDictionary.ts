import { Locale } from '@/types';
import { defaultLocale } from './config';
import { dictionaries } from './dictionaries';

export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}
