/*
  Chromium's async clipboard only accepts image/png for images, so every
  other format (JPEG, WebP, GIF, SVG) is rasterized through a canvas
  first. An animated GIF is copied as its first frame.
*/
const toPngBlob = async (blob: Blob): Promise<Blob> => {
  if (blob.type === "image/png") return blob;

  const objectUrl = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.src = objectUrl;
    await image.decode();

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not get a 2D canvas context");
    }
    context.drawImage(image, 0, 0);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((pngBlob) => {
        if (pngBlob) {
          resolve(pngBlob);
        } else {
          reject(new Error("Could not encode image as PNG"));
        }
      }, "image/png");
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};


/*
  The PNG is handed to ClipboardItem as a promise, so the write is
  started while the click's user activation is still fresh.
*/
export const copyImageToClipboard = (objectUrl: string): Promise<void> => {
  const pngBlob = fetch(objectUrl)
    .then((response) => response.blob())
    .then(toPngBlob);

  return navigator.clipboard.write([
    new ClipboardItem({ "image/png": pngBlob }),
  ]);
};


export const copyTextToClipboard = (text: string): Promise<void> => {
  return navigator.clipboard.writeText(text);
};
