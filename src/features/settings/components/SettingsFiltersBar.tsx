import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { SettingsListFiltersState } from "../hooks/useSettingsListFilters";
import type { SettingsFilterField, SettingsListFilterConfig } from "../filters";

interface SettingsFiltersBarProps {
  config: SettingsListFilterConfig;
  filters: SettingsListFiltersState;
}

const CLEAR_VALUE = "__clear__";

export function SettingsFiltersBar({ config, filters }: SettingsFiltersBarProps) {
  if (config.fields.length === 0) return null;

  return (
    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
      <span className="shrink-0 text-[13px] font-medium text-foreground">Filter By</span>
      {config.fields.map((field) => (
        <FilterControl key={field.key} field={field} filters={filters} />
      ))}
      {filters.hasActiveFilters ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 gap-1 px-2 text-[13px] text-muted-foreground"
          onClick={filters.clearFilters}
          aria-label="Clear filters"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
          Clear
        </Button>
      ) : null}
    </div>
  );
}

function FilterControl({
  field,
  filters,
}: {
  field: SettingsFilterField;
  filters: SettingsListFiltersState;
}) {
  switch (field.kind) {
    case "text":
      return (
        <Input
          name={field.key}
          aria-label={field.label ?? field.placeholder ?? field.key}
          placeholder={field.placeholder}
          value={String(filters.values[field.key] ?? "")}
          onChange={(e) => filters.setField(field.key, e.target.value)}
          className="h-8 w-[140px] text-[13px]"
        />
      );
    case "select":
      return (
        <Select
          value={
            filters.values[field.key] != null && filters.values[field.key] !== ""
              ? String(filters.values[field.key])
              : undefined
          }
          onValueChange={(value) => {
            if (value === CLEAR_VALUE) {
              filters.setField(field.key, "");
              return;
            }
            filters.setField(field.key, value);
          }}
        >
          <SelectTrigger
            className="h-8 w-[160px] text-[13px]"
            aria-label={field.label ?? field.placeholder ?? field.key}
          >
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field.clearable !== false ? (
              <SelectItem value={CLEAR_VALUE} className="text-muted-foreground">
                Clear
              </SelectItem>
            ) : null}
            {field.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "boolean": {
      const checked = filters.values[field.key] === true;
      return (
        <div className="flex items-center gap-2">
          <Switch
            id={`filter-${field.key}`}
            checked={checked}
            onCheckedChange={(next) => filters.setField(field.key, next)}
            aria-label={field.toggleLabel ?? field.label ?? field.key}
          />
          <Label htmlFor={`filter-${field.key}`} className="text-[13px] font-normal">
            {field.toggleLabel ?? field.label ?? field.key}
          </Label>
        </div>
      );
    }
    default:
      return null;
  }
}
