import sharp from "sharp";

/** Longest side stored on the site (matches photographer brief). */
export const WEB_IMAGE_MAX_EDGE = 2400;

/** JPEG quality for web exports (balance size vs clarity). */
export const WEB_IMAGE_JPEG_QUALITY = 82;

/** Flatten transparent PNGs to site cream before JPEG encode. */
const FLATTEN_BG = { r: 249, g: 248, b: 246 };

export type ProcessedWebImage = {
  buffer: Buffer;
  contentType: string;
  ext: "jpg" | "gif";
  width: number;
  height: number;
  bytesIn: number;
  bytesOut: number;
};

function isGif(mimeType: string, fileName: string): boolean {
  if (mimeType === "image/gif") return true;
  return fileName.toLowerCase().endsWith(".gif");
}

/**
 * Resize and compress for web. GIFs pass through unchanged (animation).
 * Other formats → JPEG, max edge 2400px, auto EXIF rotation.
 */
export async function processImageForWeb(
  input: Buffer,
  options: { mimeType?: string; fileName?: string } = {},
): Promise<ProcessedWebImage> {
  const bytesIn = input.length;
  const mimeType = options.mimeType ?? "";
  const fileName = options.fileName ?? "";

  if (isGif(mimeType, fileName)) {
    const meta = await sharp(input, { animated: true }).metadata();
    return {
      buffer: input,
      contentType: "image/gif",
      ext: "gif",
      width: meta.width ?? 0,
      height: meta.height ?? 0,
      bytesIn,
      bytesOut: input.length,
    };
  }

  let pipeline = sharp(input).rotate();

  const meta = await pipeline.metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  const longEdge = Math.max(width, height);

  if (longEdge > WEB_IMAGE_MAX_EDGE) {
    pipeline = pipeline.resize({
      width: width >= height ? WEB_IMAGE_MAX_EDGE : undefined,
      height: height > width ? WEB_IMAGE_MAX_EDGE : undefined,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  const buffer = await pipeline
    .flatten({ background: FLATTEN_BG })
    .jpeg({ quality: WEB_IMAGE_JPEG_QUALITY, mozjpeg: true })
    .toBuffer();

  const outMeta = await sharp(buffer).metadata();

  return {
    buffer,
    contentType: "image/jpeg",
    ext: "jpg",
    width: outMeta.width ?? 0,
    height: outMeta.height ?? 0,
    bytesIn,
    bytesOut: buffer.length,
  };
}
