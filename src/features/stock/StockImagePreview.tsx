import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { stockPreviewImageSrc } from "./stock-images";

type StockImagePreviewProps = {
  existingImages: string[];
  pendingImages: string[];
  imageHue: number;
  className?: string;
  onClick?: () => void;
};

export function StockImagePreview({
  existingImages,
  pendingImages,
  imageHue,
  className,
  onClick,
}: StockImagePreviewProps) {
  const src = stockPreviewImageSrc(existingImages, pendingImages);
  const isPending = pendingImages.length > 0;

  return (
    <div
      className={cn(
        "relative h-[98px] w-[98px] shrink-0 rounded-xl border border-border overflow-hidden bg-muted",
        onClick && "cursor-pointer",
        className,
      )}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center"
          style={{ background: `oklch(0.85 0.08 ${imageHue})` }}
        >
          <ImageIcon className="h-8 w-8 text-foreground/25" strokeWidth={1.25} />
        </div>
      )}
      {isPending && src && (
        <span className="absolute bottom-1.5 left-1.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
          New
        </span>
      )}
    </div>
  );
}
