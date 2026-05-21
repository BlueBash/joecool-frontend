import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { EditCard } from "@/components/edit-screen";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { readImageFilesAsDataUrls } from "./stock-images";

type StockImagesTabProps = {
  existingImages: string[];
  pendingImages: string[];
  onPendingChange: (images: string[]) => void;
  disabled?: boolean;
};

export function StockImagesTab({
  existingImages,
  pendingImages,
  onPendingChange,
  disabled,
}: StockImagesTabProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isReading, setIsReading] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const totalCount = existingImages.length + pendingImages.length;

  const addFiles = async (files: FileList | File[]) => {
    if (disabled || files.length === 0) return;
    setIsReading(true);
    try {
      const dataUrls = await readImageFilesAsDataUrls(files);
      if (dataUrls.length === 0) return;
      onPendingChange([...pendingImages, ...dataUrls]);
    } finally {
      setIsReading(false);
    }
  };

  const removePending = (index: number) => {
    onPendingChange(pendingImages.filter((_, i) => i !== index));
  };

  return (
    <>
      <EditCard
        title="Stock images"
        description="Upload product photos. New images are attached when you save the stock item."
      >
        <div
          className={cn(
            "rounded-lg border border-dashed border-border p-6 text-center transition-colors",
            dragOver && "border-primary bg-primary/5",
            disabled && "opacity-60 pointer-events-none",
          )}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files.length) void addFiles(e.dataTransfer.files);
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            multiple
            className="hidden"
            disabled={disabled || isReading}
            onChange={(e) => {
              if (e.target.files?.length) void addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <ImagePlus className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-[13px] text-foreground font-medium">Drop images here or browse</p>
          <p className="text-[12px] text-muted-foreground mt-1">JPEG, PNG, GIF, or WebP</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 mt-3"
            disabled={disabled || isReading}
            onClick={() => inputRef.current?.click()}
          >
            {isReading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            Upload images
          </Button>
        </div>

        <p className="text-[12px] text-muted-foreground mt-3">
          {totalCount === 0
            ? "No images yet."
            : `${totalCount} image${totalCount === 1 ? "" : "s"} (${existingImages.length} saved${
                pendingImages.length ? `, ${pendingImages.length} pending upload` : ""
              })`}
        </p>
      </EditCard>

      {totalCount > 0 && (
        <EditCard title="Gallery">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {existingImages.map((src, index) => (
              <button
                key={`saved-${src}-${index}`}
                type="button"
                className="group relative aspect-square rounded-lg border border-border overflow-hidden bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setPreviewSrc(src)}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
            {pendingImages.map((src, index) => (
              <div
                key={`pending-${index}`}
                className="relative aspect-square rounded-lg border border-primary/40 overflow-hidden bg-muted"
              >
                <button
                  type="button"
                  className="h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setPreviewSrc(src)}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
                <span className="absolute top-1.5 left-1.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                  New
                </span>
                {!disabled && (
                  <button
                    type="button"
                    className="absolute top-1.5 right-1.5 rounded-md bg-background/90 p-1 text-muted-foreground hover:text-destructive shadow-sm"
                    aria-label="Remove pending image"
                    onClick={() => removePending(index)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </EditCard>
      )}

      {previewSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setPreviewSrc(null)}
        >
          <img
            src={previewSrc}
            alt=""
            className="max-h-[90vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
