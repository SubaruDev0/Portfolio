import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SubaruDev // Portfolio",
  description: "Portafolio profesional de Javier Sebastián Morales Subaru - Ingeniero Civil Informático",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Cascadia Code PL desde CDN */}
        <link 
          href="https://cdn.jsdelivr.net/npm/@fontsource/cascadia-code@4.2.1/index.min.css" 
          rel="stylesheet" 
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
