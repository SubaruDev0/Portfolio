import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from 'react';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SubaruDev - Portfolio",
  description: "Portafolio profesional de Javier Sebastián Morales Subaru - Ingeniero Civil Informático",
  icons: {
    icon: '/logos/sd-icon.png',
    shortcut: '/logos/sd-icon.png',
    apple: '/logos/sd-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Removed Cascadia Code import to use Audiowide globally */}
        {/* Favicon personalizado (archivo en public/logos/sd-icon.png) */}
        <link rel="icon" href="/logos/sd-icon.png" />
      </head>
      <body
        className={`${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
