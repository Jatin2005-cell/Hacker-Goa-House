/**
 * Turns whatever file the user picked (jpg, png, HEIC/HEIF from iPhone, webp)
 * into an ImageBitmap that is already EXIF-orientation-corrected, so the
 * canvas drawing code never has to think about rotation.
 */
export async function loadPhoto(file: File): Promise<ImageBitmap> {
  let workingFile: File | Blob = file;

  const isHeic =
    /image\/hei(c|f)/i.test(file.type) || /\.hei(c|f)$/i.test(file.name);

  if (isHeic) {
    const heic2any = (await import('heic2any')).default;
    const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 });
    workingFile = Array.isArray(converted) ? converted[0] : converted;
  }

  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(workingFile, { imageOrientation: 'from-image' });
    } catch {
      // fall through to the <img> based fallback below
    }
  }

  const dataUrl = await blobToDataUrl(workingFile);
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = dataUrl;
  });
  return createImageBitmap(img);
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
