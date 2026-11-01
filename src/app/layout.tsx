import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const arabicFont = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  style: "normal",
  display: "swap",
  variable: "--font-ibm-plex-arabic",
});

const englishFont = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: "normal",
  display: "swap",
  variable: "--font-ibm-plex-sans",
});

export const metadata: Metadata = {};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${arabicFont.variable} ${englishFont.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
