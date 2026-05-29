import { useCallback, useRef } from "react";
import { useFormContext, type FieldPath } from "react-hook-form";
import { fetchReferenceOptions } from "@/lib/reference-sources";
import { ReferenceKlass } from "@/lib/reference-registry";
import type { StockFormValues } from "../stock-form-schema";
import {
  buildTitleCompositionSlots,
  composeTitles,
  referenceShowInTitle,
  settingShowInTitle,
} from "./stock-title-composition";

async function catalogShowForId(
  klass: string,
  id: number | undefined,
): Promise<boolean | undefined> {
  if (id == null) return undefined;
  const options = await fetchReferenceOptions(klass);
  const opt = options.find((o) => Number(o.id) === id);
  return opt ? settingShowInTitle(opt.show) : undefined;
}

function seedPreviousNamesFromForm(
  values: StockFormValues,
  target: Record<string, string>,
): void {
  const slots = buildTitleCompositionSlots({
    category: values.category,
    categoryShowInTitle: values.categoryShowInTitle,
    color: values.color,
    colorShowInTitle: values.colorShowInTitle,
    displayName: values.displayName,
    displayShowInTitle: values.displayShowInTitle,
    materials: values.materials,
  });
  for (const key of Object.keys(target)) delete target[key];
  for (const slot of slots) {
    if (slot.checked && slot.name.trim()) {
      target[slot.key] = slot.name.trim();
    }
  }
}

export function useStockTitleComposition(isStockCreated: boolean) {
  const { getValues, setValue } = useFormContext<StockFormValues>();
  const previousNamesRef = useRef<Record<string, string>>({});

  const syncTitles = useCallback(() => {
    const values = getValues();
    const slots = buildTitleCompositionSlots({
      category: values.category,
      categoryShowInTitle: values.categoryShowInTitle,
      color: values.color,
      colorShowInTitle: values.colorShowInTitle,
      displayName: values.displayName,
      displayShowInTitle: values.displayShowInTitle,
      materials: values.materials,
    });

    const edited = values.editedTitle ?? values.title ?? "";
    const generated = values.generatedTitle ?? "";
    const result = composeTitles(edited, generated, slots, previousNamesRef.current, {
      syncEditedTitle: !isStockCreated,
    });
    previousNamesRef.current = result.previousNames;

    const dirty = { shouldDirty: true };
    if (!isStockCreated && result.editedTitle !== (values.editedTitle ?? "")) {
      setValue("editedTitle", result.editedTitle, dirty);
    }
    if (result.generatedTitle !== (values.generatedTitle ?? "")) {
      setValue("generatedTitle", result.generatedTitle, dirty);
    }
  }, [getValues, setValue, isStockCreated]);

  const setShowInTitle = useCallback(
    (name: FieldPath<StockFormValues>, checked: boolean) => {
      setValue(name, checked as never, { shouldDirty: true });
      syncTitles();
    },
    [setValue, syncTitles],
  );

  const applyReferenceSelection = useCallback(
    (
      showInTitlePath: FieldPath<StockFormValues>,
      opt: ReferenceOption | undefined,
      cleared: boolean,
    ) => {
      if (cleared) {
        setValue(showInTitlePath, false as never, { shouldDirty: true });
      } else {
        setValue(showInTitlePath, referenceShowInTitle(opt) as never, { shouldDirty: true });
      }
      syncTitles();
    },
    [setValue, syncTitles],
  );

  const resetCompositionTracking = useCallback(() => {
    previousNamesRef.current = {};
  }, []);

  const seedFromFormValues = useCallback(() => {
    seedPreviousNamesFromForm(getValues(), previousNamesRef.current);
  }, [getValues]);

  /** Apply settings `show` to checkboxes for pre-filled reference ids (load / reset). */
  const syncShowInTitleFromCatalog = useCallback(async () => {
    const values = getValues();
    const dirty = { shouldDirty: false };
    const categoryShow = await catalogShowForId(ReferenceKlass.Category, values.categoryId);
    if (categoryShow !== undefined) {
      setValue("categoryShowInTitle", categoryShow as never, dirty);
    }
    const colorShow = await catalogShowForId(ReferenceKlass.Colour, values.colourId);
    if (colorShow !== undefined) {
      setValue("colorShowInTitle", colorShow as never, dirty);
    }
    const displayShow = await catalogShowForId(ReferenceKlass.Display, values.displayId);
    if (displayShow !== undefined) {
      setValue("displayShowInTitle", displayShow as never, dirty);
    }
    for (const [index, row] of (values.materials ?? []).entries()) {
      const materialShow = await catalogShowForId(ReferenceKlass.Material, row.materialId);
      if (materialShow !== undefined) {
        setValue(`materials.${index}.showInTitle` as FieldPath<StockFormValues>, materialShow as never, dirty);
      }
    }
    syncTitles();
  }, [getValues, setValue, syncTitles]);

  return {
    syncTitles,
    setShowInTitle,
    applyReferenceSelection,
    resetCompositionTracking,
    seedFromFormValues,
    syncShowInTitleFromCatalog,
  };
}
