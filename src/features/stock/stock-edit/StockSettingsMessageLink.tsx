import { cn } from "@/lib/utils";

export interface StockSettingsMessageLinkProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function StockSettingsMessageLink({
  onClick,
  disabled,
  className,
}: StockSettingsMessageLinkProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "text-[12px] text-primary hover:underline disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    >
      View Retail/Wholesale Message
    </button>
  );
}
