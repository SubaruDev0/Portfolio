import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjects, getCertificates, getPortfolioSettings } from '@/lib/data-fetch';
import { getDictionary } from '@/i18n/getDictionary';
import { getLocalizedMetadata } from '@/i18n/metadata';
import { getLocalizedValue } from '@/i18n/getLocalizedValue';
import { isSupportedLocale } from '@/i18n/config';
import { Locale } from '@/types';
import HomeClient from '../page-client';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) {
    return {};
  }

  const locale = lang as Locale;
  const localized = getLocalizedMetadata(locale);

  return {
    title: localized.title,
    description: localized.description,
    alternates: {
      canonical: localized.canonical,
      languages: localized.languages,
    },
    openGraph: {
      title: localized.title,
      description: localized.description,
      url: localized.canonical,
      siteName: 'SubaruDev',
      locale: localized.openGraphLocale,
      type: 'website',
      images: [
        {
          url: `${localized.siteUrl}/logos/sd-icon.png`,
          width: 512,
          height: 512,
          alt: 'SubaruDev logo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: localized.title,
      description: localized.description,
      images: [`${localized.siteUrl}/logos/sd-icon.png`],
    },
  };
}

export default async function LocalizedPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) {
    notFound();
  }

  const locale = lang as Locale;
  const [projects, certificates, settings] = await Promise.all([
    getProjects(),
    getCertificates(),
    getPortfolioSettings(),
  ]);

  // Localize and strip heavy i18n maps on the server to keep payload lean per locale route.
  const localizedProjects = projects.map((project) => {
    const { titleI18n, descriptionI18n, ...rest } = project;
    return {
      ...rest,
      title: getLocalizedValue(project.title, project.titleI18n, locale),
      description: getLocalizedValue(project.description, project.descriptionI18n, locale),
    };
  });

  const localizedCertificates = certificates.map((certificate) => {
    const { titleI18n, descriptionI18n, academyI18n, ...rest } = certificate;
    return {
      ...rest,
      title: getLocalizedValue(certificate.title, certificate.titleI18n, locale),
      description: getLocalizedValue(certificate.description || '', certificate.descriptionI18n, locale),
      academy: getLocalizedValue(certificate.academy, certificate.academyI18n, locale),
    };
  });

  const dictionary = getDictionary(locale);

  return (
    <HomeClient
      lang={locale}
      dictionary={dictionary}
      initialProjects={localizedProjects}
      initialCertificates={localizedCertificates}
      initialSettings={settings}
    />
  );
}
