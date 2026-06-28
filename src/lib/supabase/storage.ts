export const BUCKET = "properties";

export function getPublicUrl(storagePath: string): string {
  if (storagePath.startsWith("http")) return storagePath;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return "";
  return `${base}/storage/v1/object/public/${BUCKET}/${storagePath}`;
}

type TransformOptions = {
  width: number;
  height: number;
  quality?: number;
  resize?: "cover" | "contain" | "fill";
};

export function getTransformedUrl(storagePath: string, transform: TransformOptions): string {
  if (storagePath.startsWith("http")) return storagePath;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return "";
  const params = new URLSearchParams({
    width: String(transform.width),
    height: String(transform.height),
    quality: String(transform.quality ?? 80),
    resize: transform.resize ?? "cover",
  });
  return `${base}/storage/v1/render/image/public/${BUCKET}/${storagePath}?${params}`;
}

export const IMAGE_PRESETS = {
  card: { width: 480, height: 320, quality: 75 },
  hero: { width: 1200, height: 700, quality: 85 },
  gallery: { width: 600, height: 400, quality: 80 },
  og: { width: 1200, height: 630, quality: 90 },
} as const;
