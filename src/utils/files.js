// @ts-nocheck
const FILE_BASE = import.meta.env.VITE_FILE_BASE_URL || window.location.origin;

const shouldStripPublic = () => {
  try {
    const host = new URL(FILE_BASE).hostname;
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return true;
  }
};

export const fileUrl = (p) => {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  let rel = String(p).replace(/^\/+/, "");
  if (shouldStripPublic() && rel.startsWith("public/")) rel = rel.replace(/^public\//, "");
  return `${String(FILE_BASE).replace(/\/+$/, "")}/${rel}`;
};

export const isImageMime = (m) => typeof m === "string" && m.startsWith("image/");
export const isImageExt  = (p) => /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(String(p || ""));

// prefer letter image for letters, photo image for photographs, but never pick audio
export const pickLetterImagePath = (r) => {
  if (r?.letterImage && (isImageMime(r.letterImage?.mimeType) || isImageExt(r.letterImage?.path))) {
    return r.letterImage.path;
  }
  if (r?.photoImage && (isImageMime(r.photoImage?.mimeType) || isImageExt(r.photoImage?.path))) {
    return r.photoImage.path;
  }
  return "";
};

export const pickPhotoImagePath = (r) => {
  if (r?.photoImage && (isImageMime(r.photoImage?.mimeType) || isImageExt(r.photoImage?.path))) {
    return r.photoImage.path;
  }
  if (r?.letterImage && (isImageMime(r.letterImage?.mimeType) || isImageExt(r.letterImage?.path))) {
    return r.letterImage.path;
  }
  return "";
};
