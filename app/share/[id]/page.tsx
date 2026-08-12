import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { shareImagePath } from '@/lib/imageUrl';

function siteOrigin() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const h = headers();
  const host = h.get('host');
  const proto = h.get('x-forwarded-proto') ?? 'https';
  return `${proto}://${host}`;
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const origin = siteOrigin();
  const imagePath = shareImagePath(params.id);
  const imageUrl = imagePath.startsWith('http') ? imagePath : `${origin}${imagePath}`;

  const title = 'I built my Hacker House Goa 2026 ID 🌴';
  const description = "Come build with us at Hacker House Goa, Oct 28–31 2026. #FrameInGoa";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl, width: 1080, height: 1350 }],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl]
    }
  };
}

export default function SharePage({ params }: { params: { id: string } }) {
  const imagePath = shareImagePath(params.id);

  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imagePath}
        alt="Hacker House Goa 2026 builder ID card"
        className="w-full max-w-sm rounded-3xl shadow-card border-4 border-teal"
      />
      <div>
        <p className="font-display text-3xl text-teal mb-2">SEE YOU IN GOA</p>
        <p className="font-body text-ink/70 mb-6">28–31 Oct 2026 · #FrameInGoa</p>
        <Link
          href="/"
          className="inline-block bg-coral text-white font-body font-semibold px-6 py-3 rounded-full shadow-card hover:brightness-105 transition"
        >
          Make your own ID →
        </Link>
      </div>
    </main>
  );
}
