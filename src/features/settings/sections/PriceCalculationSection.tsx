import type { SettingsCustomSectionProps } from "../types";

/** Price calculation uses run-calculations, break points, and logs — custom UI for now. */
export function PriceCalculationSection({ title }: SettingsCustomSectionProps) {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Price calculation rules (priority, exchange rates, break points, and run calculations) will
        be available here. Use the legacy app for full calculation management until this section is
        completed.
      </p>
    </div>
  );
}
