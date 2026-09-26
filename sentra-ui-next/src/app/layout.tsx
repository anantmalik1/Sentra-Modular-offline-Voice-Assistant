import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-sans',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SENTRA AI CORE — Futuristic Autonomous Command Center',
  description: 'Full-screen AI command center dashboard UI built with Next.js 16 + React 19 + TypeScript + Tailwind v4',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="w-screen min-h-screen overflow-y-auto bg-[#070b14] text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}
