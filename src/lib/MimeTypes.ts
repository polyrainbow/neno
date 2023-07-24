const MimeTypes = new Map<string, string>(Object.entries({
  "png": "image/png",
  "jpg": "image/jpeg",
  "webp": "image/webp",
  "gif": "image/gif",
  "svg": "image/svg+xml",
  "pdf": "application/pdf",
  "js": "text/javascript",
  "json": "application/json",
  "mp3": "audio/mp3",
  "flac": "audio/flac",
  "mp4": "video/mp4",
  "webm": "video/webm",
  "md": "text/markdown",
}));

export default MimeTypes;
