'use client';

import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Locale } from '@/types';
import { useI18n } from '@/i18n/context';
import { isSupportedLocale, supportedLocales } from '@/i18n/config';

interface LanguageSwitchProps {
  isDarkMode?: boolean;
}

export default function LanguageSwitch({ isDarkMode = true }: LanguageSwitchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { lang, dictionary } = useI18n();
  const [isNavigating, setIsNavigating] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    if (isNavigating) {
      setIsNavigating(false);
    }
  }, [pathname, searchParams, isNavigating]);

  const changeLocale = React.useCallback(
    (targetLocale: Locale) => {
      if (targetLocale === lang) return;

      const segments = pathname.split('/').filter(Boolean);
      if (segments.length > 0 && isSupportedLocale(segments[0])) {
        segments[0] = targetLocale;
      } else {
        segments.unshift(targetLocale);
      }

      const query = searchParams.toString();
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      const targetPath = `/${segments.join('/')}${query ? `?${query}` : ''}${hash}`;
      setIsNavigating(true);
      startTransition(() => {
        router.push(targetPath);
      });
    },
    [lang, pathname, router, searchParams],
  );

  const localeLabel: Record<Locale, string> = {
    es: 'ES',
    en: 'EN',
    pt: 'PT',
    ja: 'JP',
  };

  const showLoader = isNavigating || isPending;

  return (
    <>
      {showLoader && (
        <div className="fixed inset-0 z-[900] bg-black/35 backdrop-blur-sm flex items-center justify-center">
          <div className="px-5 py-3 rounded-2xl bg-black/80 border border-white/20 text-white flex items-center gap-3">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">{dictionary.language.switching}</span>
          </div>
        </div>
      )}

      <div
        className={`p-1 rounded-2xl border backdrop-blur-xl shadow-2xl transition-colors duration-500 ${
          isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
        }`}
        aria-label={dictionary.language.label}
      >
        <div className="flex flex-col gap-1">
          {supportedLocales.map((localeOption) => {
            const active = localeOption === lang;
            return (
              <button
                key={localeOption}
                onClick={() => changeLocale(localeOption)}
                disabled={showLoader}
                className={`px-2 py-1 rounded-xl text-[10px] font-black tracking-wider transition-all disabled:opacity-70 disabled:cursor-wait ${
                  active
                    ? isDarkMode
                      ? 'bg-white text-black'
                      : 'bg-black text-white'
                    : isDarkMode
                      ? 'text-white/50 hover:text-white hover:bg-white/10'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-black/10'
                }`}
                title={dictionary.language[localeOption]}
              >
                {localeLabel[localeOption]}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
