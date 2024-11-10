'use client'
import type { Metadata } from "next";
import localFont from "next/font/local";
import { SessionProvider } from "next-auth/react"; // Importando o SessionProvider
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
      >
        <SessionProvider>{children}</SessionProvider> {/* Envolvendo o conteúdo com o SessionProvider */}
      </body>
    </html>
  );
}
