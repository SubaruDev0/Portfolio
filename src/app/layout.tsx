import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
    template: '%s - SubaruDev',
  },
  description: 'Portafolio profesional de Javier Sebastián Morales Subaru - Desarrollador web, programador y creador de proyectos. Proyectos, certificaciones y contacto profesional.',
  keywords: [
    'SubaruDev', 'Subaru', 'Javier Morales', 'Javier Morales Subaru', 'programador', 'portfolio', 'portafolio',
    'desarrollador web', 'ingeniero civil informatico', 'frontend', 'backend', 'fullstack', 'react', 'next.js',
    'typescript', 'nodejs', 'proyectos', 'certificados', 'CV', 'animalesperdidos.cl', 'subarudev.com'
  ],
  authors: [
    { name: 'Javier Sebastián Morales Subaru', url: SITE_URL },
  ],
  openGraph: {
  title: 'SubaruDev - Portfolio',
  description: 'Portfolio profesional de Javier Sebastián Morales Subaru — proyectos, certificaciones y contacto.',
    url: SITE_URL,
    siteName: 'SubaruDev',
    images: [
      {
        url: `${SITE_URL}/logos/sd-icon.png`,
        width: 512,
        height: 512,
        alt: 'SubaruDev logo',
      }
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  title: 'SubaruDev - Portfolio',
  description: 'Portfolio profesional de Javier Sebastián Morales Subaru — proyectos, certificaciones y contacto.',
    images: [`${SITE_URL}/logos/sd-icon.png`],
  },
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

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
    <html lang="es">
      <head>
        {/* Removed Cascadia Code import to use Audiowide globally */}
        {/* Favicon personalizado (archivo en public/logos/sd-icon.png) */}
        <link rel="icon" href="/logos/sd-icon.png" />
        <link rel="canonical" href={SITE_URL} />
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
