'use client';

import React from 'react';
import { Locale } from '@/types';
import { Dictionary } from './dictionaries';
import es from './dictionaries/es';

interface I18nContextValue {
  lang: Locale;
  dictionary: Dictionary;
}

const defaultValue: I18nContextValue = {
  lang: 'es',
  dictionary: es,
};

const I18nContext = React.createContext<I18nContextValue>(defaultValue);

export function I18nProvider({
  lang,
  dictionary,
  children,
}: {
  lang: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  const value = React.useMemo(() => ({ lang, dictionary }), [lang, dictionary]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return React.useContext(I18nContext);
}
