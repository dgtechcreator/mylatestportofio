const MAX_BYTES = 3.5 * 1024 * 1024;

const toBlob = (canvas, type, quality) => new Promise((resolve) => canvas.toBlob(resolve, type, quality));

/** Shrinks a picked image (keeps transparency) so uploads stay small and fast. */
export async function prepareImage(file, maxSide = 1600) {
  if (!/^image\/(png|jpe?g|webp|gif)$/i.test(file.type)) throw new Error('Please choose a PNG, JPG or WebP image.');
  const bitmap = await createImageBitmap(file);
  let side = maxSide;
  for (let attempt = 0; attempt < 4; attempt++) {
    const scale = Math.min(1, side / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    // WebP keeps alpha; browsers that can't encode it silently return PNG, which is fine too.
    const blob = await toBlob(canvas, 'image/webp', 0.9);
    if (blob && blob.size <= MAX_BYTES) return blob;
    side = Math.round(side * 0.75);
  }
  throw new Error('Image is too large even after shrinking. Try a smaller picture.');
}
