'use client';

import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ChevronDown, Globe } from 'lucide-react';
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
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isNavigating) setIsNavigating(false);
  }, [pathname, searchParams, isNavigating]);

  // Cierra el dropdown si se hace click afuera
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLocale = React.useCallback(
    (targetLocale: Locale) => {
      if (targetLocale === lang) {
        setIsOpen(false);
        return;
      }
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
      setIsOpen(false);
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

  const buttonBase = `
    w-full px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest
    transition-all duration-200 disabled:opacity-50 disabled:cursor-wait
  `;

  const activeStyle = isDarkMode
    ? 'bg-white text-black'
    : 'bg-black text-white';

  const inactiveStyle = isDarkMode
    ? 'text-white/40 hover:text-white hover:bg-white/10'
    : 'text-black/40 hover:text-black hover:bg-black/10';

  return (
    <>
      {/* Toast loader */}
      {showLoader && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="px-4 py-2 rounded-2xl bg-black/80 border border-white/10 text-white flex items-center gap-3 shadow-xl">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              {dictionary.language.switching}
            </span>
          </div>
        </div>
      )}

      {/* ── MOBILE: Dropdown custom ── */}
      <div
        ref={dropdownRef}
        className="relative md:hidden"
        aria-label={dictionary.language.label}
      >
        <button
          onClick={() => setIsOpen((v) => !v)}
          disabled={showLoader}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border
            backdrop-blur-xl shadow-lg transition-all duration-200
            text-[11px] font-black tracking-widest uppercase
            disabled:opacity-50 disabled:cursor-wait
            ${isDarkMode
              ? 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              : 'bg-black/5 border-black/10 text-black hover:bg-black/10'
            }
          `}
        >
          <Globe size={12} className="shrink-0" />
          {localeLabel[lang]}
          <ChevronDown
            size={12}
            className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Panel del dropdown */}
        {isOpen && (
          <div
            className={`
              absolute top-full right-0 mt-2 z-50
              min-w-[80px] p-1 rounded-2xl border
              backdrop-blur-xl shadow-2xl
              flex flex-col gap-0.5
              animate-in fade-in slide-in-from-top-2 duration-150
              ${isDarkMode
                ? 'bg-black/80 border-white/10'
                : 'bg-white/90 border-black/10'
              }
            `}
          >
            {supportedLocales.map((localeOption) => {
              const active = localeOption === lang;
              return (
                <button
                  key={localeOption}
                  onClick={() => changeLocale(localeOption)}
                  disabled={showLoader}
                  className={`${buttonBase} text-left ${active ? activeStyle : inactiveStyle}`}
                  title={dictionary.language[localeOption]}
                >
                  {localeLabel[localeOption]}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── DESKTOP: Botones verticales (igual que antes) ── */}
      <div
        className={`
          hidden md:flex flex-col gap-1 p-1 rounded-2xl border
          backdrop-blur-xl shadow-2xl transition-colors duration-500
          ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}
        `}
        aria-label={dictionary.language.label}
      >
        {supportedLocales.map((localeOption) => {
          const active = localeOption === lang;
          return (
            <button
              key={localeOption}
              onClick={() => changeLocale(localeOption)}
              disabled={showLoader}
              className={`${buttonBase} ${active ? activeStyle : inactiveStyle}`}
              title={dictionary.language[localeOption]}
            >
              {localeLabel[localeOption]}
            </button>
          );
        })}
      </div>
    </>
  );
}