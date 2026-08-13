'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CardData, drawBuilderCard } from '@/lib/drawCard';
import { loadPhoto } from '@/lib/loadPhoto';
import { builderTitle, randomBuilderId } from '@/lib/builderTitles';

const TWEET_TEMPLATE = (title: string) =>
  `I just built my Builder ID for Hacker House Goa 2026 🌴💻\n\n${title} reporting for duty.\nJoin me → hhgoa.com\n\n#FrameInGoa`;

export default function BuilderCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photo, setPhoto] = useState<ImageBitmap | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [spin, setSpin] = useState(0);
  const [builderId] = useState(randomBuilderId());
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  const title = builderTitle(name || 'builder', role, spin);

  const redraw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const data: CardData = { name, role, builderTitle: title, builderId, photo };
    await drawBuilderCard(canvas, data);
  }, [name, role, title, builderId, photo]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  async function handleFile(file: File | null) {
    if (!file) return;
    setPhotoError(null);
    setIsProcessingPhoto(true);
    try {
      const bitmap = await loadPhoto(file);
      setPhoto(bitmap);
    } catch (err) {
      console.error(err);
      setPhotoError("Couldn't read that photo — try a JPG or PNG.");
    } finally {
      setIsProcessingPhoto(false);
    }
  }

  function canvasToBlob(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      if (!canvas) return reject(new Error('No canvas'));
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))), 'image/png', 1);
    });
  }

  async function handleDownload() {
    const blob = await canvasToBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hackerhouse-goa-${(name || 'builder').toLowerCase().replace(/\s+/g, '-')}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleShare() {
    setIsSharing(true);
    setShareError(null);
    try {
      const blob = await canvasToBlob();
      const text = TWEET_TEMPLATE(title);

      // Prefer native share sheet (mobile) so the image attaches directly.
      const file = new File([blob], 'hh-goa-builder-id.png', { type: 'image/png' });
      const nav = navigator as Navigator & { canShare?: (data: unknown) => boolean };
      if (nav.canShare && nav.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text, title: 'Hacker House Goa 2026' });
        return;
      }

      // Fallback: upload for an OG-preview link, then open the X compose intent.
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'image/png' },
        body: blob
      });
      if (!res.ok) throw new Error('Upload failed');
      const { id } = await res.json();
      const shareUrl = `${window.location.origin}/share/${id}`;
      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
      window.open(tweetUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      const isAbort = err instanceof DOMException && err.name === 'AbortError';
      if (!isAbort) {
        console.error(err);
        setShareError("Sharing didn't go through — you can still download and post it manually.");
      }
    } finally {
      setIsSharing(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[420px_1fr] items-start">
      <section className="space-y-5">
        <div>
          <label className="text-[#FFC23C] font-bold">Your photo</label>
          <label className="flex items-center justify-center gap-3 border-2 border-dashed border-teal/40 rounded-2xl px-4 py-6 cursor-pointer bg-white/60 hover:bg-white transition">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
            <span className="text-ink/70 font-body text-sm text-center">
              {isProcessingPhoto ? 'Processing photo…' : photo ? 'Tap to change photo' : 'Tap to upload — JPG, PNG or iPhone HEIC'}
            </span>
          </label>
          {photoError && <p className="text-coral text-sm mt-2">{photoError}</p>}
        </div>

        <div>
          
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={28}
            placeholder="Enter Name"
            className="w-full rounded-xl border-2 border-teal/30 bg-white px-4 py-3 font-body focus:outline-none focus:border-coral"
          />
        </div>

        <div>
          
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            maxLength={28}
            placeholder="Enter Role "
            className="w-full rounded-xl border-2 border-teal/30 bg-white px-4 py-3 font-body focus:outline-none focus:border-coral"
          />
        </div>

        <div className="flex items-center justify-between bg-white rounded-xl border-2 border-teal/30 px-4 py-3">
          <div>
            <p className="text-xs font-body text-ink/50">Builder class</p>
            <p className="font-body font-semibold text-teal">{title}</p>
          </div>
          <button
            type="button"
            onClick={() => setSpin((s) => s + 1)}
            className="text-sm font-body font-semibold text-coral hover:underline shrink-0 ml-3"
          >
            Shuffle ↻
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 bg-teal text-white font-body font-semibold rounded-full px-6 py-3 shadow-card hover:brightness-110 transition"
          >
            Download PNG
          </button>
          <button
            type="button"
            onClick={handleShare}
            disabled={isSharing}
            className="flex-1 bg-coral text-white font-body font-semibold rounded-full px-6 py-3 shadow-card hover:brightness-105 transition disabled:opacity-60"
          >
            {isSharing ? 'Sharing…' : 'Share to X'}
          </button>
        </div>
        {shareError && <p className="text-coral text-sm">{shareError}</p>}
        <p className="text-xs text-white font-body">
          No login needed. Your photo is only used to render the image in your browser.
        </p>
      </section>

      <section className="flex justify-center">
        <canvas
          ref={canvasRef}
          className="w-full max-w-[420px] rounded-[28px] shadow-card border-4 border-teal bg-white"
        />
      </section>
    </div>
  );
}
