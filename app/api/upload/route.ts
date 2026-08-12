import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { saveShareImage } from '@/lib/storage';

export const runtime = 'nodejs';

// Basic per-instance rate limit to keep this MVP endpoint from being abused.
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;

function isRateLimited(key: string) {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  hits.set(key, timestamps);
  return timestamps.length > MAX_PER_WINDOW;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anon';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many uploads, try again in a minute.' }, { status: 429 });
  }

  const contentType = req.headers.get('content-type') ?? '';
  if (!contentType.includes('image/png')) {
    return NextResponse.json({ error: 'Expected image/png body.' }, { status: 400 });
  }

  const arrayBuffer = await req.arrayBuffer();
  if (arrayBuffer.byteLength === 0 || arrayBuffer.byteLength > 8 * 1024 * 1024) {
    return NextResponse.json({ error: 'Image missing or too large.' }, { status: 400 });
  }

  const id = nanoid(10);
  const url = await saveShareImage(id, Buffer.from(arrayBuffer));

  return NextResponse.json({ id, url });
}
