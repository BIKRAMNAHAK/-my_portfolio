/**
 * Compresses an image file in the browser and returns a Base64 data URL.
 * Resizes large dimensions to maxDim and applies JPEG compression.
 * This ensures the image stays tiny (typically 40KB - 90KB) so it can be stored
 * permanently in MongoDB Atlas without relying on ephemeral server disk.
 */
export const compressImageToBase64 = (file, maxDim = 800, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve('');

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;

        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
      img.src = e.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};
