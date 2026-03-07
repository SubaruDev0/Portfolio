import { Locale } from '@/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://subarudev.com';

interface LocalizedMetadata {
  title: string;
  description: string;
  openGraphLocale: string;
}

const metadataByLocale: Record<Locale, LocalizedMetadata> = {
  es: {
    title: 'SubaruDev - Portafolio',
    description: 'Portafolio profesional de Javier Sebastian Morales Subaru: proyectos, certificaciones y contacto profesional.',
    openGraphLocale: 'es_ES',
  },
  en: {
    title: 'SubaruDev - Portfolio',
    description: 'Professional portfolio of Javier Sebastian Morales Subaru: projects, certifications, and contact.',
    openGraphLocale: 'en_US',
  },
  pt: {
    title: 'SubaruDev - Portfolio',
    description: 'Portfolio profissional de Javier Sebastian Morales Subaru: projetos, certificacoes e contato.',
    openGraphLocale: 'pt_BR',
  },
  ja: {
    title: 'SubaruDev - Portfolio',
    description: 'Javier Sebastian Morales Subaru のポートフォリオ。プロジェクト、資格、連絡先を掲載。',
    openGraphLocale: 'ja_JP',
  },
};

export function getLocalizedMetadata(locale: Locale) {
  const current = metadataByLocale[locale] ?? metadataByLocale.es;

  return {
    ...current,
    canonical: `${SITE_URL}/${locale}`,
    languages: {
      es: `${SITE_URL}/es`,
      en: `${SITE_URL}/en`,
      pt: `${SITE_URL}/pt`,
      ja: `${SITE_URL}/ja`,
    },
    siteUrl: SITE_URL,
  };
}
