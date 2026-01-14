import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
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
      <body
        className={`${inter.variable} ${mono.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
