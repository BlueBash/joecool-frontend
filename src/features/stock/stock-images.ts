const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);

export function isStockImageDataUrl(value: string): boolean {
  return value.startsWith("data:image/");
}

export function parseStockImages(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((v): v is string => typeof v === "string" && v.length > 0);
}

export function readImageFilesAsDataUrls(files: FileList | File[]): Promise<string[]> {
  const list = Array.from(files).filter((f) => IMAGE_TYPES.has(f.type));
  return Promise.all(
    list.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        }),
    ),
  );
}

export function pendingStockImagesForPayload(pending?: string[]): string[] | undefined {
  const next = (pending ?? []).filter(isStockImageDataUrl);
  return next.length ? next : undefined;
}

/** Pending uploads take precedence over saved images for display. */
export function stockPreviewImageSrc(existing: string[], pending: string[]): string | null {
  if (pending.length > 0) return pending[0];
  if (existing.length > 0) return existing[0];
  return null;
}
