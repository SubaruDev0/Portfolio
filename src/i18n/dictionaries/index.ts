import es from './es';
import en from './en';
import pt from './pt';
import ja from './ja';
import { Dictionary } from './types';
import { Locale } from '@/types';

export type { Dictionary } from './types';

export const dictionaries: Record<Locale, Dictionary> = {
  es,
  en,
  pt,
  ja,
};
