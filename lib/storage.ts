import fs from 'fs';
import path from 'path';

const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

/**
 * Saves a generated card image so it can be referenced by a stable URL for
 * the Open Graph share-preview page (X can't preview a base64 data URL).
 *
 * - If BLOB_READ_WRITE_TOKEN is set (Vercel Blob store attached to the
 *   project), the image is uploaded there and a permanent public URL is
 *   returned. This is what you want in production.
 * - Otherwise it falls back to writing into /public/generated, which is
 *   fine for local development but is NOT durable on serverless hosts
 *   (the filesystem is ephemeral/read-only in production on Vercel).
 */
export async function saveShareImage(id: string, buffer: Buffer): Promise<string> {
  if (hasBlob) {
    const { put } = await import('@vercel/blob');
    const blob = await put(`shares/${id}.png`, buffer, {
      access: 'public',
      contentType: 'image/png',
      addRandomSuffix: false
    });
    return blob.url;
  }

  const dir = path.join(process.cwd(), 'public', 'generated');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${id}.png`), buffer);
  return `/generated/${id}.png`;
}

export function isUsingBlobStorage() {
  return hasBlob;
}
