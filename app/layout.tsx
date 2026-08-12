import type { Metadata } from 'next';
import { Anton, Baloo_2, Poppins } from 'next/font/google';
import './globals.css';

const anton = Anton({ subsets: ['latin'], weight: '400', variable: '--font-anton' });
const baloobhai = Baloo_2({ subsets: ['devanagari', 'latin'], weight: ['500', '700'], variable: '--font-baloobhai' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-poppins' });

export const metadata: Metadata = {
  title: 'Hacker House Goa 2026 — Builder ID Generator',
  description: 'Make your Hacker House Goa 2026 Builder ID card in seconds. Upload a photo, get a shareable card. #FrameInGoa',
  openGraph: {
    title: 'Hacker House Goa 2026 — Builder ID Generator',
    description: 'Make your Hacker House Goa 2026 Builder ID card in seconds. #FrameInGoa'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${baloobhai.variable} ${poppins.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  );
}
