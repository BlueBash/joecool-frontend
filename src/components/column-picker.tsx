import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

export type ColumnDef = { key: string; label: string; locked?: boolean };

type VisibleColumnsChangeHandler = (next: Set<string>) => void;

interface ColumnPickerProps {
  columns: ColumnDef[];
  visible: Set<string>;
  onChange: VisibleColumnsChangeHandler;
}

export function ColumnPicker({
  columns, visible, onChange,
}: ColumnPickerProps) {
  const toggle = (k: string) => {
    const n = new Set(visible);
    if (n.has(k)) n.delete(k); else n.add(k);
    onChange(n);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5">
          <Settings2 className="h-3.5 w-3.5" /> Columns
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-2">
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground px-2 pb-1.5">Show columns</div>
        <div className="max-h-72 overflow-auto space-y-0.5">
          {columns.map(c => (
            <label key={c.key} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent text-[13px] cursor-pointer">
              <Checkbox
                checked={visible.has(c.key)}
                disabled={c.locked}
                onCheckedChange={() => !c.locked && toggle(c.key)}
              />
              <span className={c.locked ? "text-muted-foreground" : ""}>{c.label}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
