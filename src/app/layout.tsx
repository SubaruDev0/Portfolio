import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from 'next/headers';
import React from 'react';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://subarudev.com';

export const metadata: Metadata = {
  title: {
    default: 'SubaruDev - Portfolio',
    template: '%s',
  },
  description: 'SubaruDev professional portfolio.',
  keywords: [
    'SubaruDev', 'Portfolio', 'Fullstack', 'React', 'Next.js',
  ],
  authors: [
    { name: 'Javier Sebastián Morales Subaru', url: SITE_URL },
  ],
  icons: {
    icon: '/logos/sd-icon.png',
    shortcut: '/logos/sd-icon.png',
    apple: '/logos/sd-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": 'large',
      "max-snippet": -1,
    }
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const localeHeader = requestHeaders.get('x-locale');
  const htmlLang = localeHeader || 'es';

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "name": "Javier Sebastián Morales Subaru",
        "alternateName": "SubaruDev",
        "url": SITE_URL,
        "jobTitle": "Desarrollador Web / Ingeniero Civil Informático",
        "description": "Desarrollador web full-stack. Proyectos, certificaciones y servicios de desarrollo.",
      },
      {
        "@type": "WebSite",
        "name": "SubaruDev",
        "url": SITE_URL,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${SITE_URL}/?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <html lang={htmlLang}>
      <head>
        {/* Removed Cascadia Code import to use Audiowide globally */}
        {/* Favicon personalizado (archivo en public/logos/sd-icon.png) */}
        <link rel="icon" href="/logos/sd-icon.png" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* JSON-LD para mejorar SEO y Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
