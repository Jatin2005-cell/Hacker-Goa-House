/**
 * Given a share id, returns where its image actually lives.
 *
 * When Vercel Blob is configured, set NEXT_PUBLIC_BLOB_BASE_URL to your
 * store's public base (e.g. https://xxxxxxxx.public.blob.vercel-storage.com)
 * so this stays a pure function with no database lookup required — the
 * upload route always writes to `shares/{id}.png` with a fixed pathname.
 */
export function shareImagePath(id: string): string {
  const base = process.env.NEXT_PUBLIC_BLOB_BASE_URL;
  if (base) return `${base.replace(/\/$/, '')}/shares/${id}.png`;
  return `/generated/${id}.png`;
}
