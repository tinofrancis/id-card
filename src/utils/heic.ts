/**
 * Convert HEIC/HEIF image files to JPEG format client-side.
 * Uses dynamic import of heic2any to optimize bundle size.
 */
export async function convertHeicToJpeg(file: File): Promise<Blob> {
  if (typeof window === 'undefined') {
    throw new Error('HEIC conversion can only be performed client-side.');
  }

  // Dynamically import heic2any so it isn't included in the initial JS bundle
  const heic2any = (await import('heic2any')).default;
  
  const result = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.9,
  });

  if (Array.isArray(result)) {
    return result[0];
  }
  return result;
}
