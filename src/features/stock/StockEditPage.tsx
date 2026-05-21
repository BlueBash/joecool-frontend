import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FormProvider } from "react-hook-form";
import { Trash2, Save, ExternalLink, Plus, Loader2, Settings2 } from "lucide-react";
import { GenerateNextCodeParams, stocks } from "@/api/stocks";
import type { ApiError } from "@/api/_client";
import { AppGuard } from "@/components/app-guard";
import { ReferenceField } from "@/components/reference-field";
import { EditScreen, EditCard } from "@/components/edit-screen";
import { Field, FormGrid } from "@/components/form-primitives";
import { ReferenceKlass } from "@/lib/reference-registry";
import { STOCK_CREATE_DEFAULT_FLAGS } from "@/lib/reference";
import type { ReferenceOption } from "@/lib/reference";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pill } from "@/components/pill";
import { CopyableCode } from "@/components/app-shell";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { toast } from "sonner";
import type { StockItem, StockMaterialRowUpdate } from "@/lib/types";
import { FieldError } from "@/components/form";
import { applyApiFieldErrors, firstFormErrorMessage, useEntityForm } from "@/lib/form";
import { cn } from "@/lib/utils";
import { StockFormSchema, type StockFormValues } from "./stock-form-schema";
import {
  type CodeGenerationFieldErrors,
  extractCodeGenerationParams,
  extractGeneratedCode,
  loadStoredCodeGenerationParams,
  saveStoredCodeGenerationParams,
  validateCodeGenerationParams,
} from "./stock-code-generation";
import { useStockDetail } from "./hooks";
import { mapRowToStockItem, stockItemToPayload } from "./map-stock";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const routeApi = getRouteApi("/stock/$id");

const TXT = "h-8 text-[13px]";
const NUM = "h-8 tabular-nums text-[13px]";
const MONO = "h-8 font-mono text-[13px]";

type StockFlagOption = { code: string; label: string };

const FLAG_CODES = [
  { code: "3", label: "Sell Wholesale" },
  { code: "9", label: "Restock JOE" },
  { code: "22", label: "Shop Best Sellers" },
  { code: "7", label: "Restock Wholesale" },
  { code: "30", label: "Show on 3rd Party web" },
  { code: "8", label: "Supply Available" },
  { code: "19", label: "Show on JC wholesale web" },
  { code: "51", label: "Retail Message" },
  { code: "1", label: "Sell In JOE" },
  { code: "21", label: "Include In Best Sellers" },
  { code: "20", label: "Special Offer" },
] satisfies StockFlagOption[];
const MATERIAL_FLAGS = [
  { code: "41", label: "Nickel - Free" },
  { code: "42", label: "Cadmium - Free" },
  { code: "43", label: "Lead - Free" },
] satisfies StockFlagOption[];

const STOCK_EDIT_TABS = [
  ["makeup", "Makeup"],
  ["seo", "SEO"],
  ["supplier", "Supplier"],
  ["levels", "OrdersLevels"],
  ["cost", "CostPrices"],
  ["selling", "SellingPrices"],
  ["flags", "FlagsSpecials"],
  ["notes", "Notes"],
  ["details", "Details"],
  ["kits", "Kits"],
] as const satisfies readonly (readonly [string, string])[];

function blankStock(): StockItem {
  return {
    id: `s_${Date.now()}`,
    code: "",
    title: "",
    category: "",
    onHand: 0,
    reorderLevel: 5,
    color: "",
    introDate: new Date().toISOString().slice(0, 10),
    costPrice: 0,
    sellingPrice: 0,
    status: "active",
    imageHue: Math.floor(Math.random() * 360),
    flags: [],
    flagCodes: { ...STOCK_CREATE_DEFAULT_FLAGS },
    frontLocation: "A",
    backLocation: "A",
  };
}

function refId(v: string | number | null): number | undefined {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function RenderCodeRules({
  codeGenerationParams,
  setCodeGenerationParams,
  rulesErrors,
  isGenerating,
  onGenerate,
}: {
  codeGenerationParams: GenerateNextCodeParams;
  setCodeGenerationParams: (params: GenerateNextCodeParams) => void;
  rulesErrors: CodeGenerationFieldErrors;
  isGenerating: boolean;
  onGenerate: () => void;
}) {
  const updateParams = (next: GenerateNextCodeParams) => {
    setCodeGenerationParams(next);
    saveStoredCodeGenerationParams(next);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">Rules</span>
          <Settings2 size={12} />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-64"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div
          className="space-y-4 p-3"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Code prefix <span className="text-destructive">*</span>
            </label>
            <Input
              value={codeGenerationParams.prefix ?? ""}
              onChange={(e) => updateParams({ ...codeGenerationParams, prefix: e.target.value })}
              aria-invalid={!!rulesErrors.prefix}
              className={rulesErrors.prefix ? "border-destructive" : undefined}
            />
            <FieldError message={rulesErrors.prefix} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Total code length <span className="text-destructive">*</span>
            </label>
            <Input
              type="number"
              min={1}
              value={codeGenerationParams.length || ""}
              onChange={(e) =>
                updateParams({
                  ...codeGenerationParams,
                  length: Number(e.target.value),
                })
              }
              aria-invalid={!!rulesErrors.length}
              className={rulesErrors.length ? "border-destructive" : undefined}
            />
            <span className="text-xs text-muted-foreground">
              Characters to generate after prefix.
            </span>
            <FieldError message={rulesErrors.length} />
          </div>
          <div className="flex justify-end">
            <Button type="button" disabled={isGenerating} onClick={onGenerate}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Generating…
                </>
              ) : (
                "Generate code"
              )}
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function StockEditPage() {
  const { id } = routeApi.useParams();
  const nav = useNavigate();
  const isNew = id === "new";
  const detailQuery = useStockDetail(id, !isNew);
  const [codeGenerationParams, setCodeGenerationParams] = useState<GenerateNextCodeParams>(() => {
    return loadStoredCodeGenerationParams() ?? { prefix: "", length: 0 };
  });
  const [rulesErrors, setRulesErrors] = useState<CodeGenerationFieldErrors>({});
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  const resetValues = useMemo(() => {
    if (isNew) return blankStock();
    if (!detailQuery.data) return null;
    return mapRowToStockItem(detailQuery.data);
  }, [isNew, detailQuery.data]);

  const form = useEntityForm<StockFormValues>({
    schema: StockFormSchema,
    defaultValues: blankStock(),
    resetValues,
    resetKey: id,
  });

  const { watch, setValue, handleSubmit, setError, clearErrors, formState, isDirty, isSubmitting } =
    form;

  const draft = watch();

  const handleGenerateCode = async () => {
    const validation = validateCodeGenerationParams(codeGenerationParams);
    if (!validation.ok) {
      setRulesErrors(validation.errors);
      toast.error(
        validation.errors.prefix ?? validation.errors.length ?? "Check code generation rules",
      );
      return;
    }
    setRulesErrors({});
    setIsGeneratingCode(true);
    try {
      const result = await stocks.api.generateNextCode(validation.data);
      const code = extractGeneratedCode(result);
      const fromApi = extractCodeGenerationParams(result);
      const nextParams = fromApi ?? validation.data;
      setCodeGenerationParams(nextParams);
      saveStoredCodeGenerationParams(nextParams);
      if (code) {
        setValue("code", code.toUpperCase(), { shouldDirty: true, shouldTouch: true });
        clearErrors("code");
        toast.success("Code generated");
      } else {
        toast.error("Failed to generate code");
      }
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as ApiError).message)
          : "Failed to generate code";
      toast.error(message);
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const createStock = stocks.hooks.useCreate({
    onSuccess: (row) => {
      toast.success("Stock created");
      nav({ to: "/stock/$id", params: { id: String(row.id) } });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  const updateStock = stocks.hooks.useUpdate({
    onSuccess: () => toast.success("Stock saved"),
    onError: (err: ApiError) => toast.error(err.message),
  });

  const deleteStock = stocks.hooks.useDelete({
    onSuccess: () => {
      toast.success(`Removed ${draft.code}`);
      nav({ to: "/stocks" });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  const deleteConfirm = useDeleteConfirm<{ id: string }>({
    onConfirm: async ({ id }) => {
      await deleteStock.mutateAsync({ id });
    },
  });

  const isSaving = isSubmitting || createStock.isPending || updateStock.isPending;

  if (!isNew && detailQuery.isPending) {
    return (
      <EditScreen backTo="/stocks" title="Loading stock…">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading…
        </div>
      </EditScreen>
    );
  }

  if (!isNew && detailQuery.isError) {
    return (
      <EditScreen backTo="/stocks" title="Stock not found">
        <p className="text-muted-foreground text-[13px]">
          {(detailQuery.error as ApiError)?.message ?? "This item may have been deleted."}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3 h-8"
          onClick={() => detailQuery.refetch()}
        >
          Try again
        </Button>
      </EditScreen>
    );
  }

  const set = <K extends keyof StockItem>(k: K, v: StockItem[K]) =>
    setValue(k as keyof StockFormValues, v as never, { shouldDirty: true, shouldTouch: true });

  const setFlag = (code: string, v: boolean) =>
    setValue(
      "flagCodes",
      { ...(draft.flagCodes ?? {}), [code]: v },
      { shouldDirty: true, shouldTouch: true },
    );

  const bindRef =
    (idKey: keyof StockItem, labelKey: keyof StockItem) =>
    (refValue: string | number | null, opt?: ReferenceOption) => {
      setValue(idKey as keyof StockFormValues, refId(refValue) as never, { shouldDirty: true });
      if (opt) {
        setValue(labelKey as keyof StockFormValues, opt.name as never, { shouldDirty: true });
      }
    };

  const save = handleSubmit(
    (values) => {
      const payload = stockItemToPayload({ ...values, code: values.code.toUpperCase() });
      const onError = (err: ApiError) => {
        if (!applyApiFieldErrors(setError, err)) toast.error(err.message);
      };
      if (isNew) createStock.mutate(payload, { onError });
      else updateStock.mutate({ id: values.id, data: payload }, { onError });
    },
    (errors) => {
      toast.error(firstFormErrorMessage(errors) ?? "Please fix the highlighted fields");
    },
  );

  const onDelete = () => {
    if (isNew) {
      nav({ to: "/stocks" });
      return;
    }
    deleteConfirm.requestDelete({
      title: "Delete stock",
      entityName: draft.code,
      entityType: "stock item",
      meta: { id: draft.id },
    });
  };

  const onGenerateBarcodes = async () => {
    try {
      const result = await stocks.api.generateBarcode();
      const barcode = String(result.barcode ?? "");
      if (barcode) {
        setValue("packBarcode", barcode, { shouldDirty: true });
        setValue("retailBarcode", barcode, { shouldDirty: true });
        toast.success("Barcodes generated");
      } else {
        toast.info("No barcode returned from API");
      }
    } catch (err) {
      toast.error((err as ApiError)?.message ?? "Failed to generate barcodes");
    }
  };

  const materials = draft.materials ?? [];
  const setMaterial = (idx: number, patch: StockMaterialRowUpdate) => {
    const next = materials.map((m, i) => (i === idx ? { ...m, ...patch } : m));
    set("materials", next);
  };
  const addMaterial = () => set("materials", [...materials, { material: "", composite: 0 }]);
  const removeMaterial = (idx: number) =>
    set(
      "materials",
      materials.filter((_, i) => i !== idx),
    );

  return (
    <FormProvider {...form}>
      <DeleteConfirmDialog state={deleteConfirm} />
      <EditScreen
        backTo="/stocks"
        backLabel="Back to Stock"
        title={isNew ? "New Stock Item" : draft.title || draft.code}
        itemCode={!isNew ? draft.code : ""}
        // subtitle={!isNew && <CopyableCode value={draft.code} />}
        badges={
          !isNew && (
            <Pill
              variant={
                draft.status === "active"
                  ? "success"
                  : draft.status === "low"
                    ? "warning"
                    : draft.status === "out"
                      ? "danger"
                      : "neutral"
              }
            >
              {draft.status}
            </Pill>
          )
        }
        actions={
          <>
            {!isNew && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5"
                onClick={() => toast.info("Web page")}
              >
                <ExternalLink className="h-3.5 w-3.5" /> Web page
              </Button>
            )}
            {!isNew && (
              <AppGuard checkName="Delete Stock">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-destructive hover:text-destructive"
                  onClick={onDelete}
                  disabled={deleteStock.isPending || deleteConfirm.isPending || isSaving}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              </AppGuard>
            )}
            <Button
              size="sm"
              className="h-8 gap-1.5"
              onClick={save}
              disabled={isSaving || (!isNew && !isDirty)}
            >
              {isSaving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              {isNew ? "Create" : "Update"}
            </Button>
          </>
        }
      >
        <EditCard title="Identity">
          <FormGrid cols={4}>
            <Field
              label="Code"
              fieldLabelAction={
                isNew ? (
                  <RenderCodeRules
                    codeGenerationParams={codeGenerationParams}
                    setCodeGenerationParams={setCodeGenerationParams}
                    rulesErrors={rulesErrors}
                    isGenerating={isGeneratingCode}
                    onGenerate={() => void handleGenerateCode()}
                  />
                ) : undefined
              }
              fieldLabelActionClasses={isNew ? "flex justify-between" : undefined}
              required
            >
              <Input
                value={draft.code}
                onChange={(e) => set("code", e.target.value.toUpperCase())}
                readOnly={!isNew}
                className={cn(MONO, !isNew && "bg-muted")}
                aria-invalid={!!formState.errors.code}
              />
              <FieldError message={formState.errors.code?.message} />
            </Field>
            <Field label="Intro Date">
              <Input
                type="date"
                value={draft.introDate}
                onChange={(e) => set("introDate", e.target.value)}
                className={TXT}
              />
            </Field>
            <Field label="Edited Title">
              <Input
                value={draft.editedTitle ?? draft.title}
                onChange={(e) => set("editedTitle", e.target.value)}
                className={TXT}
              />
            </Field>
            <Field label="Generated Title">
              <Input
                value={draft.generatedTitle ?? ""}
                onChange={(e) => set("generatedTitle", e.target.value)}
                className={TXT}
              />
            </Field>
          </FormGrid>
          <label className="inline-flex items-center gap-2 text-[13px] mt-3">
            <input
              type="checkbox"
              checked={!!draft.toZoho}
              onChange={(e) => set("toZoho", e.target.checked)}
              className="h-3.5 w-3.5"
            />
            TO Zoho
          </label>
        </EditCard>

        <Tabs defaultValue="makeup" className="w-full">
          <TabsList className="bg-transparent p-0 h-auto border-b border-border rounded-none w-full justify-start gap-1 flex-wrap">
            {STOCK_EDIT_TABS.map(([v, l]) => (
              <TabsTrigger
                key={v}
                value={v}
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-3 h-9 text-[13px]"
              >
                {l}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* MAKEUP */}
          <TabsContent value="makeup" className="mt-3">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <EditCard title="Description">
                  <FormGrid cols={2}>
                    <ReferenceField
                      label="Category"
                      klass={ReferenceKlass.Category}
                      value={draft.categoryId ?? null}
                      displayLabel={draft.category}
                      placeholder="Search categories…"
                      onChange={bindRef("categoryId", "category")}
                    />
                    <Field label="Category Code">
                      <Input
                        value={draft.categoryCode ?? ""}
                        onChange={(e) => set("categoryCode", e.target.value)}
                        className={MONO}
                      />
                    </Field>
                    <ReferenceField
                      label="Color"
                      klass={ReferenceKlass.Colour}
                      value={draft.colourId ?? null}
                      displayLabel={draft.color}
                      placeholder="Search colours…"
                      onChange={bindRef("colourId", "color")}
                    />
                    <Field label="Color Code">
                      <Input
                        value={draft.colorCode ?? ""}
                        onChange={(e) => set("colorCode", e.target.value)}
                        className={MONO}
                      />
                    </Field>
                    <ReferenceField
                      label="Display"
                      klass={ReferenceKlass.Display}
                      value={draft.displayId ?? null}
                      displayLabel={draft.displayName}
                      placeholder="Search displays…"
                      onChange={(id, opt) => {
                        bindRef("displayId", "displayName")(id, opt);
                        if (opt?.code) set("displayCode", opt.code);
                      }}
                    />
                    <Field label="Display Code">
                      <Input
                        value={draft.displayCode ?? ""}
                        onChange={(e) => set("displayCode", e.target.value)}
                        className={MONO}
                      />
                    </Field>
                    <Field label="Cost">
                      <Input
                        type="number"
                        step="0.01"
                        value={draft.cost ?? draft.costPrice}
                        onChange={(e) => set("cost", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <ReferenceField
                      label="Ring size"
                      klass={ReferenceKlass.RingSize}
                      value={draft.size ?? null}
                      displayLabel={draft.size}
                      placeholder="Search sizes…"
                      onChange={(id, opt) =>
                        set("size", opt?.name ?? (id != null ? String(id) : ""))
                      }
                    />
                    <Field label="Unique Description" className="md:col-span-2">
                      <Input
                        value={draft.uniqueDescription ?? ""}
                        onChange={(e) => set("uniqueDescription", e.target.value)}
                        className={TXT}
                        placeholder="e.g., woven and knotted with tie string"
                      />
                    </Field>
                  </FormGrid>
                </EditCard>

                <EditCard title="Product Details">
                  <FormGrid cols={2}>
                    <ReferenceField
                      label="Assortment"
                      klass={ReferenceKlass.Assortment}
                      value={draft.assortmentId ?? null}
                      displayLabel={draft.assortment}
                      placeholder="Search…"
                      onChange={bindRef("assortmentId", "assortment")}
                    />
                    <ReferenceField
                      label="Collection"
                      klass={ReferenceKlass.Collection}
                      value={draft.collectionId ?? null}
                      displayLabel={draft.collection}
                      placeholder="Search…"
                      onChange={bindRef("collectionId", "collection")}
                    />
                    <ReferenceField
                      label="Selections"
                      klass={ReferenceKlass.Selection}
                      value={draft.selectionId ?? null}
                      displayLabel={draft.selections}
                      placeholder="Search…"
                      onChange={bindRef("selectionId", "selections")}
                    />
                    <ReferenceField
                      label="Packaging"
                      klass={ReferenceKlass.Packaging}
                      value={draft.packagingId ?? null}
                      displayLabel={draft.packaging}
                      placeholder="Search…"
                      onChange={bindRef("packagingId", "packaging")}
                    />
                    <ReferenceField
                      label="Gender"
                      klass={ReferenceKlass.TargetGender}
                      value={draft.genderId ?? null}
                      displayLabel={draft.gender}
                      placeholder="Search…"
                      onChange={bindRef("genderId", "gender")}
                    />
                    <Field label="Unchanged">
                      <Input
                        value={draft.unchanged ?? ""}
                        onChange={(e) => set("unchanged", e.target.value)}
                        className={TXT}
                      />
                    </Field>
                    <ReferenceField
                      label="Units"
                      klass={ReferenceKlass.Unit}
                      value={draft.unitId ?? null}
                      displayLabel={draft.units}
                      placeholder="Search…"
                      onChange={bindRef("unitId", "units")}
                    />
                    <ReferenceField
                      label="Item Tariff"
                      klass={ReferenceKlass.CustomTarrifCode}
                      value={draft.tariffCodeId ?? null}
                      displayLabel={draft.itemTariff}
                      placeholder="Search…"
                      onChange={bindRef("tariffCodeId", "itemTariff")}
                    />
                    <ReferenceField
                      label="VAT Rate"
                      klass={ReferenceKlass.VatRateCode}
                      value={draft.vatRateCodeId ?? null}
                      displayLabel={draft.vatRate}
                      placeholder="Search…"
                      onChange={bindRef("vatRateCodeId", "vatRate")}
                    />
                    <Field label="Category Tariff">
                      <Input
                        value={draft.categoryTariff ?? ""}
                        onChange={(e) => set("categoryTariff", e.target.value)}
                        className={TXT}
                      />
                    </Field>
                    <Field label="Front Location">
                      <Input
                        value={draft.frontLocation ?? "A"}
                        onChange={(e) => set("frontLocation", e.target.value)}
                        className={TXT}
                      />
                    </Field>
                    <Field label="Back Location">
                      <Input
                        value={draft.backLocation ?? "A"}
                        onChange={(e) => set("backLocation", e.target.value)}
                        className={TXT}
                      />
                    </Field>
                    <Field label="Catalogue Location" className="md:col-span-2">
                      <Input
                        value={draft.catalogueLocation ?? ""}
                        onChange={(e) => set("catalogueLocation", e.target.value)}
                        className={TXT}
                      />
                    </Field>
                  </FormGrid>
                </EditCard>
              </div>

              <div>
                <EditCard title="Barcodes">
                  <FormGrid cols={1}>
                    <Field label="Pack Barcode">
                      <Input
                        value={draft.packBarcode ?? ""}
                        onChange={(e) => set("packBarcode", e.target.value)}
                        className={MONO}
                      />
                    </Field>
                    <Field label="Retail Barcode">
                      <Input
                        value={draft.retailBarcode ?? ""}
                        onChange={(e) => set("retailBarcode", e.target.value)}
                        className={MONO}
                      />
                    </Field>
                  </FormGrid>
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      className="mt-3 h-8"
                      onClick={() => void onGenerateBarcodes()}
                    >
                      Get Barcode Numbers
                    </Button>
                  </div>
                </EditCard>

                <EditCard title="Materials & Compositions">
                  <div className="space-y-2">
                    {materials.length === 0 && (
                      <p className="text-[12.5px] text-muted-foreground">No materials added.</p>
                    )}
                    {materials.map((m, i) => (
                      <div key={i} className="grid grid-cols-[1fr_90px_28px] gap-2 items-end">
                        <Field label="Material">
                          <Input
                            value={m.material}
                            onChange={(e) => setMaterial(i, { material: e.target.value })}
                            className={TXT}
                          />
                        </Field>
                        <Field label="Composite %">
                          <Input
                            type="number"
                            value={m.composite}
                            onChange={(e) => setMaterial(i, { composite: Number(e.target.value) })}
                            className={NUM}
                          />
                        </Field>
                        <button
                          onClick={() => removeMaterial(i)}
                          className="h-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 mt-1"
                        onClick={addMaterial}
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Material
                      </Button>
                    </div>
                  </div>
                </EditCard>
              </div>
            </div>
          </TabsContent>

          {/* SEO */}
          <TabsContent value="seo" className="mt-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <EditCard title="Wholesale Blurb">
                <Field label="Item">
                  <Input value={draft.code} disabled className={MONO} />
                </Field>
                <textarea
                  className="w-full min-h-[140px] mt-2 p-2 rounded-md border border-border bg-background text-[13px] resize-y"
                  value={draft.wholesaleBlurb ?? ""}
                  onChange={(e) => set("wholesaleBlurb", e.target.value)}
                />
              </EditCard>
              <EditCard title="Consumer Blurb">
                <Field label="Item">
                  <Input value={draft.code} disabled className={MONO} />
                </Field>
                <textarea
                  className="w-full min-h-[140px] mt-2 p-2 rounded-md border border-border bg-background text-[13px] resize-y"
                  value={draft.consumerBlurb ?? ""}
                  onChange={(e) => set("consumerBlurb", e.target.value)}
                />
              </EditCard>
            </div>
            <EditCard title="SEO">
              <Field label="Keywords" hint="Use : as separator">
                <Input
                  value={draft.seoKeywords ?? ""}
                  onChange={(e) => set("seoKeywords", e.target.value)}
                  className={TXT}
                />
              </Field>
            </EditCard>
          </TabsContent>

          {/* SUPPLIER */}
          <TabsContent value="supplier" className="mt-3">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <EditCard title="Supplier">
                <FormGrid cols={2}>
                  <Field label="Code">
                    <Input
                      value={draft.supplierCode ?? ""}
                      onChange={(e) => set("supplierCode", e.target.value)}
                      className={MONO}
                    />
                  </Field>
                  <Field label="Name">
                    <Input
                      value={draft.supplierName ?? ""}
                      onChange={(e) => set("supplierName", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                  <Field label="Country">
                    <Input
                      value={draft.supplierCountry ?? ""}
                      onChange={(e) => set("supplierCountry", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                  <Field label="ISO Code">
                    <Input
                      value={draft.supplierIso ?? ""}
                      onChange={(e) => set("supplierIso", e.target.value)}
                      className={MONO}
                    />
                  </Field>
                  <Field label="Supplier Item Code">
                    <Input
                      value={draft.supplierItemCode ?? ""}
                      onChange={(e) => set("supplierItemCode", e.target.value)}
                      className={MONO}
                    />
                  </Field>
                  <Field label="Buyer">
                    <Input
                      value={draft.buyer ?? ""}
                      onChange={(e) => set("buyer", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                </FormGrid>
              </EditCard>
              <EditCard title="Manufacturer">
                <FormGrid cols={2}>
                  <Field label="Code">
                    <Input
                      value={draft.manufacturerCode ?? ""}
                      onChange={(e) => set("manufacturerCode", e.target.value)}
                      className={MONO}
                    />
                  </Field>
                  <Field label="Name">
                    <Input
                      value={draft.manufacturerName ?? ""}
                      onChange={(e) => set("manufacturerName", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                  <Field label="Country">
                    <Input
                      value={draft.manufacturerCountry ?? ""}
                      onChange={(e) => set("manufacturerCountry", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                  <Field label="ISO Code">
                    <Input
                      value={draft.manufacturerIso ?? ""}
                      onChange={(e) => set("manufacturerIso", e.target.value)}
                      className={MONO}
                    />
                  </Field>
                  <Field label="Manufr Item Code" className="md:col-span-2">
                    <Input
                      value={draft.manufrItemCode ?? ""}
                      onChange={(e) => set("manufrItemCode", e.target.value)}
                      className={MONO}
                    />
                  </Field>
                </FormGrid>
              </EditCard>
              <EditCard title="Reorder Settings">
                <FormGrid cols={1}>
                  <Field label="Wholesale Re-Order Level">
                    <Input
                      type="number"
                      value={draft.wholesaleReorderLevel ?? ""}
                      onChange={(e) => set("wholesaleReorderLevel", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Re-Order Quantity">
                    <Input
                      type="number"
                      value={draft.reorderQty ?? ""}
                      onChange={(e) => set("reorderQty", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Wholesale Top Up To">
                    <Input
                      type="number"
                      value={draft.wholesaleTopUpTo ?? ""}
                      onChange={(e) => set("wholesaleTopUpTo", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                </FormGrid>
              </EditCard>
            </div>
          </TabsContent>

          {/* ORDERS LEVELS */}
          <TabsContent value="levels" className="mt-3">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <EditCard title="Balance Orders — Customer">
                  <table className="w-full text-[12.5px]">
                    <thead className="text-muted-foreground border-b border-border">
                      <tr>
                        <th className="text-left py-1.5"></th>
                        {["Regular", "Codir", "Forecast", "Dropped"].map((h) => (
                          <th key={h} className="text-right px-2">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {["Orders", "Qntys", "Values"].map((r) => (
                        <tr key={r} className="border-b border-border/60">
                          <td className="py-1.5 font-medium">{r}</td>
                          {[0, 1, 2, 3].map((i) => (
                            <td key={i} className="px-2 py-1">
                              <Input
                                className={`${NUM} text-right`}
                                defaultValue={r === "Values" ? "0.00" : "0"}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </EditCard>
                <EditCard title="Balance Orders — Supplier">
                  <table className="w-full text-[12.5px]">
                    <thead className="text-muted-foreground border-b border-border">
                      <tr>
                        <th className="text-left py-1.5"></th>
                        {["Regular", "Codir", "Forecast", "Dropped"].map((h) => (
                          <th key={h} className="text-right px-2">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {["Orders", "Qntys", "Values"].map((r) => (
                        <tr key={r} className="border-b border-border/60">
                          <td className="py-1.5 font-medium">{r}</td>
                          {[0, 1, 2, 3].map((i) => (
                            <td key={i} className="px-2 py-1">
                              <Input
                                className={`${NUM} text-right`}
                                defaultValue={r === "Values" ? "0.00" : "0"}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </EditCard>
              </div>
              <EditCard title="Stock Position">
                <FormGrid cols={2}>
                  <Field label="Warehouse Levels">
                    <Input
                      type="number"
                      value={draft.warehouseLevels ?? 0}
                      onChange={(e) => set("warehouseLevels", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Boxes">
                    <Input
                      type="number"
                      value={draft.boxes ?? 0}
                      onChange={(e) => set("boxes", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Stock Allocated">
                    <Input
                      type="number"
                      value={draft.stockAllocated ?? 0}
                      onChange={(e) => set("stockAllocated", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Customer Orders">
                    <Input
                      type="number"
                      value={draft.customerOrders ?? 0}
                      onChange={(e) => set("customerOrders", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Transit">
                    <Input
                      type="number"
                      value={draft.transit ?? 0}
                      onChange={(e) => set("transit", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Transit Allocated">
                    <Input
                      type="number"
                      value={draft.transitAllocated ?? 0}
                      onChange={(e) => set("transitAllocated", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Supplier Orders">
                    <Input
                      type="number"
                      value={draft.supplierOrders ?? 0}
                      onChange={(e) => set("supplierOrders", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="China/CO">
                    <Input
                      type="number"
                      value={draft.chinaCo ?? 0}
                      onChange={(e) => set("chinaCo", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Shelf">
                    <Input
                      type="number"
                      value={draft.shelf ?? 0}
                      onChange={(e) => set("shelf", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Free">
                    <Input
                      type="number"
                      value={draft.free ?? 0}
                      onChange={(e) => set("free", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Available">
                    <Input
                      type="number"
                      value={draft.available ?? 0}
                      onChange={(e) => set("available", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Spare">
                    <Input
                      type="number"
                      value={draft.spare ?? 0}
                      onChange={(e) => set("spare", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Sup CODIR">
                    <Input
                      type="number"
                      value={draft.supCodir ?? 0}
                      onChange={(e) => set("supCodir", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="12 Mth Sls">
                    <Input
                      type="number"
                      value={draft.twelveMthSls ?? 0}
                      onChange={(e) => set("twelveMthSls", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Stock/Sls">
                    <Input
                      type="number"
                      value={draft.stockSls ?? 0}
                      onChange={(e) => set("stockSls", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Spare/Sls">
                    <Input
                      type="number"
                      value={draft.spareSls ?? 0}
                      onChange={(e) => set("spareSls", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                </FormGrid>
                <Button
                  size="sm"
                  className="mt-3 h-8 w-full"
                  onClick={() => toast.success("Adjusted")}
                >
                  Adjust
                </Button>
              </EditCard>
            </div>
          </TabsContent>

          {/* COST PRICES */}
          <TabsContent value="cost" className="mt-3">
            <EditCard title="Supplier">
              <FormGrid cols={3}>
                <Field label="Supplier Code">
                  <Input
                    value={draft.supplierCode ?? ""}
                    onChange={(e) => set("supplierCode", e.target.value)}
                    className={MONO}
                  />
                </Field>
                <Field label="Supplier Name">
                  <Input
                    value={draft.supplierName ?? ""}
                    onChange={(e) => set("supplierName", e.target.value)}
                    className={TXT}
                  />
                </Field>
                <Field label="Supplier FOB X">
                  <Input
                    type="number"
                    step="0.01"
                    value={draft.supplierFobX ?? ""}
                    onChange={(e) => set("supplierFobX", Number(e.target.value))}
                    className={NUM}
                  />
                </Field>
              </FormGrid>
            </EditCard>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <EditCard title="Country Of Origin Costs">
                <div className="flex justify-end mb-2">
                  <Field label="Currency" className="max-w-[140px]">
                    <Input
                      value={draft.currencyCode ?? "CNY"}
                      onChange={(e) => set("currencyCode", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                </div>
                <FormGrid cols={2}>
                  <Field label="Facty Cost">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.factyCost ?? ""}
                      onChange={(e) => set("factyCost", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Per">
                    <Input
                      type="number"
                      value={draft.factyPer ?? 1}
                      onChange={(e) => set("factyPer", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="First Cost" className="md:col-span-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.factyCost ?? ""}
                      disabled
                      className={NUM}
                    />
                  </Field>
                  <Field label="Facty Pack">
                    <Input
                      value={draft.factyPack ?? ""}
                      onChange={(e) => set("factyPack", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                  <Field label="Amount">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.factyAmount ?? ""}
                      onChange={(e) => set("factyAmount", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Facty Invd" className="md:col-span-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.factyInvd ?? ""}
                      onChange={(e) => set("factyInvd", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Packaging">
                    <Input
                      value={draft.packagingName ?? ""}
                      onChange={(e) => set("packagingName", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                  <Field label="New Amount">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.packagingNewAmount ?? 0}
                      onChange={(e) => set("packagingNewAmount", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Agent Com%">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.agentCommPct ?? ""}
                      onChange={(e) => set("agentCommPct", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Agent Amount">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.agentAmount ?? ""}
                      onChange={(e) => set("agentAmount", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Agent Base">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.agentBase ?? ""}
                      onChange={(e) => set("agentBase", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Agent Cost">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.agentCost ?? ""}
                      onChange={(e) => set("agentCost", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Agent Pack%">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.agentPackPct ?? ""}
                      onChange={(e) => set("agentPackPct", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Agent Pack Amount">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.agentPackAmount ?? ""}
                      onChange={(e) => set("agentPackAmount", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Quality%">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.qualityPct ?? 0}
                      onChange={(e) => set("qualityPct", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Probs%">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.probsPct ?? 0}
                      onChange={(e) => set("probsPct", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Charges%">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.chargesPct ?? 0}
                      onChange={(e) => set("chargesPct", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="FOB Charges%">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.fobChargesPct ?? 0}
                      onChange={(e) => set("fobChargesPct", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Item OB">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.itemOb ?? ""}
                      onChange={(e) => set("itemOb", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="FOB Base">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.fobBase ?? ""}
                      onChange={(e) => set("fobBase", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="JC Packing">
                    <Input
                      value={draft.jcPacking ?? ""}
                      onChange={(e) => set("jcPacking", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                  <Field label="JC Packing Amount">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.jcPackingAmount ?? ""}
                      onChange={(e) => set("jcPackingAmount", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="JC OB Cost" className="md:col-span-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.jcObCost ?? ""}
                      onChange={(e) => set("jcObCost", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Freight%">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.freightPct ?? ""}
                      onChange={(e) => set("freightPct", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Freight% Amount">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.freightAmount ?? ""}
                      onChange={(e) => set("freightAmount", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Arrive UK">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.arriveUk ?? ""}
                      onChange={(e) => set("arriveUk", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Calc FOB X">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.calcFobX ?? ""}
                      onChange={(e) => set("calcFobX", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                </FormGrid>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="h-8" onClick={() => toast.success("Saved FOB X")}>
                    Save FOB X in Supp Addr Record
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => toast.success("Saved")}
                  >
                    Save as Supp Defaults
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => toast.success("Read")}
                  >
                    Read Supp Defaults
                  </Button>
                </div>
              </EditCard>

              <div>
                <EditCard title="Exchange Rate">
                  <FormGrid cols={2}>
                    <Field label="Current Rate">
                      <Input
                        type="number"
                        step="0.0001"
                        value={draft.currentRate ?? ""}
                        onChange={(e) => set("currentRate", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Last Used X Rate">
                      <Input
                        type="number"
                        step="0.0001"
                        value={draft.lastUsedXRate ?? ""}
                        onChange={(e) => set("lastUsedXRate", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Buy Adjust %">
                      <Input
                        type="number"
                        step="0.01"
                        value={draft.buyAdjustPct ?? ""}
                        onChange={(e) => set("buyAdjustPct", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Effective Rate">
                      <Input
                        type="number"
                        step="0.0001"
                        value={draft.effectiveRate ?? ""}
                        onChange={(e) => set("effectiveRate", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Arrive UK Rate">
                      <Input
                        type="number"
                        step="0.0001"
                        value={draft.arriveUkRate ?? ""}
                        onChange={(e) => set("arriveUkRate", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="(Up) GBP">
                      <Input
                        type="number"
                        step="0.0001"
                        value={draft.upGbp ?? ""}
                        onChange={(e) => set("upGbp", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                  </FormGrid>
                </EditCard>

                <EditCard title="UK Costs">
                  <FormGrid cols={3}>
                    <Field label="UK Duty %">
                      <Input
                        type="number"
                        step="0.01"
                        value={draft.ukDutyPct ?? ""}
                        onChange={(e) => set("ukDutyPct", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="UK Duty% Amount">
                      <Input
                        type="number"
                        step="0.0001"
                        value={draft.ukDutyAmount ?? ""}
                        onChange={(e) => set("ukDutyAmount", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Duty Paid">
                      <Input
                        type="number"
                        step="0.0001"
                        value={draft.dutyPaid ?? ""}
                        onChange={(e) => set("dutyPaid", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Clearance %">
                      <Input
                        type="number"
                        step="0.01"
                        value={draft.clearancePct ?? ""}
                        onChange={(e) => set("clearancePct", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Clearance% Amount">
                      <Input
                        type="number"
                        step="0.0001"
                        value={draft.clearanceAmount ?? ""}
                        onChange={(e) => set("clearanceAmount", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="UK Landed">
                      <Input
                        type="number"
                        step="0.0001"
                        value={draft.ukLanded ?? ""}
                        onChange={(e) => set("ukLanded", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Delivery %">
                      <Input
                        type="number"
                        step="0.01"
                        value={draft.deliveryPct ?? ""}
                        onChange={(e) => set("deliveryPct", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Delivery% Amount">
                      <Input
                        type="number"
                        step="0.0001"
                        value={draft.deliveryAmount ?? ""}
                        onChange={(e) => set("deliveryAmount", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Delivered">
                      <Input
                        type="number"
                        step="0.0001"
                        value={draft.delivered ?? ""}
                        onChange={(e) => set("delivered", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Assembly">
                      <Input
                        value={draft.assembly ?? ""}
                        onChange={(e) => set("assembly", e.target.value)}
                        className={TXT}
                      />
                    </Field>
                    <Field label="Assembly Amount">
                      <Input
                        type="number"
                        step="0.01"
                        value={draft.assemblyAmount ?? ""}
                        onChange={(e) => set("assemblyAmount", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Assembled">
                      <Input
                        type="number"
                        step="0.0001"
                        value={draft.assembled ?? ""}
                        onChange={(e) => set("assembled", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Display">
                      <Input
                        value={draft.display ?? ""}
                        onChange={(e) => set("display", e.target.value)}
                        className={TXT}
                      />
                    </Field>
                    <Field label="Display Amount">
                      <Input
                        type="number"
                        step="0.01"
                        value={draft.displayAmount ?? ""}
                        onChange={(e) => set("displayAmount", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Calc Ready">
                      <Input
                        type="number"
                        step="0.0001"
                        value={draft.calcReady ?? ""}
                        onChange={(e) => set("calcReady", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Per">
                      <Input
                        type="number"
                        value={draft.per ?? 1}
                        onChange={(e) => set("per", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Rounded Up">
                      <Input
                        type="number"
                        step="0.01"
                        value={draft.roundedUp ?? ""}
                        onChange={(e) => set("roundedUp", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Landed Factr">
                      <Input
                        type="number"
                        step="0.0001"
                        value={draft.landedFactr ?? ""}
                        onChange={(e) => set("landedFactr", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Stored Ready">
                      <Input
                        type="number"
                        step="0.01"
                        value={draft.storedReady ?? ""}
                        onChange={(e) => set("storedReady", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="Calcd Markup">
                      <Input
                        type="number"
                        step="0.01"
                        value={draft.calcdMarkup ?? ""}
                        onChange={(e) => set("calcdMarkup", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                    <Field label="GBP Whlsl">
                      <Input
                        type="number"
                        step="0.01"
                        value={draft.gbpWhlsl ?? ""}
                        onChange={(e) => set("gbpWhlsl", Number(e.target.value))}
                        className={NUM}
                      />
                    </Field>
                  </FormGrid>
                </EditCard>
              </div>
            </div>
          </TabsContent>

          {/* SELLING PRICES */}
          <TabsContent value="selling" className="mt-3">
            <EditCard title="Currency Rates">
              <FormGrid cols={3}>
                <Field label="GBP">
                  <Input
                    type="number"
                    step="0.01"
                    value={draft.sellGbp ?? 1}
                    onChange={(e) => set("sellGbp", Number(e.target.value))}
                    className={NUM}
                  />
                </Field>
                <Field label="EUR">
                  <Input
                    type="number"
                    step="0.01"
                    value={draft.sellEur ?? 1.22}
                    onChange={(e) => set("sellEur", Number(e.target.value))}
                    className={NUM}
                  />
                </Field>
                <Field label="USD">
                  <Input
                    type="number"
                    step="0.01"
                    value={draft.sellUsd ?? 1.27}
                    onChange={(e) => set("sellUsd", Number(e.target.value))}
                    className={NUM}
                  />
                </Field>
              </FormGrid>
            </EditCard>
            {(["whlsl", "retail", "amazon"] as const).map((group) => (
              <EditCard
                key={group}
                title={group === "whlsl" ? "WHLSL" : group === "retail" ? "Retail" : "AMAZON"}
              >
                {(["Gbp", "Eur", "Usd"] as const).map((cur) => (
                  <div key={cur} className="grid grid-cols-[60px_1fr_1fr_1fr] gap-2 items-end mb-2">
                    <div className="text-[12px] font-medium text-muted-foreground pb-1.5">
                      {cur.toUpperCase()}:
                    </div>
                    <Field label="Price">
                      <Input
                        type="number"
                        step="0.01"
                        value={(draft as any)[`${group}${cur}Price`] ?? 0}
                        onChange={(e) =>
                          set(
                            `${group}${cur}Price` as keyof StockItem,
                            Number(e.target.value) as never,
                          )
                        }
                        className={NUM}
                      />
                    </Field>
                    <Field label="Per">
                      <Input
                        type="number"
                        value={(draft as any)[`${group}${cur}Per`] ?? 1}
                        onChange={(e) =>
                          set(
                            `${group}${cur}Per` as keyof StockItem,
                            Number(e.target.value) as never,
                          )
                        }
                        className={NUM}
                      />
                    </Field>
                    <Field label="%Age">
                      <Input
                        type="number"
                        step="0.01"
                        value={(draft as any)[`${group}${cur}Pct`] ?? 0}
                        onChange={(e) =>
                          set(
                            `${group}${cur}Pct` as keyof StockItem,
                            Number(e.target.value) as never,
                          )
                        }
                        className={NUM}
                      />
                    </Field>
                  </div>
                ))}
              </EditCard>
            ))}
            <EditCard title="Special Price">
              <FormGrid cols={2}>
                <Field label="Exist">
                  <Input
                    type="number"
                    step="0.01"
                    value={draft.specialPrice ?? 0}
                    onChange={(e) => set("specialPrice", Number(e.target.value))}
                    className={NUM}
                  />
                </Field>
              </FormGrid>
            </EditCard>
          </TabsContent>

          {/* FLAGS & SPECIALS */}
          <TabsContent value="flags" className="mt-3">
            <EditCard title="Flag Codes">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {FLAG_CODES.map((f) => (
                  <label
                    key={f.code}
                    className="flex items-center gap-2 px-2 py-1.5 rounded border border-border hover:bg-accent cursor-pointer text-[13px]"
                  >
                    <input
                      type="checkbox"
                      checked={!!draft.flagCodes?.[f.code]}
                      onChange={(e) => setFlag(f.code, e.target.checked)}
                    />
                    <span className="text-muted-foreground">({f.code})</span> {f.label}
                  </label>
                ))}
              </div>
            </EditCard>
            <EditCard title="Materials">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {MATERIAL_FLAGS.map((f) => (
                  <label
                    key={f.code}
                    className="flex items-center gap-2 px-2 py-1.5 rounded border border-border hover:bg-accent cursor-pointer text-[13px]"
                  >
                    <input
                      type="checkbox"
                      checked={!!draft.flagCodes?.[f.code]}
                      onChange={(e) => setFlag(f.code, e.target.checked)}
                    />
                    <span className="text-muted-foreground">({f.code})</span> {f.label}
                  </label>
                ))}
              </div>
            </EditCard>
          </TabsContent>

          {/* NOTES */}
          <TabsContent value="notes" className="mt-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <EditCard title="General Stock Item Notes">
                <Field label="Item">
                  <Input value={draft.code} disabled className={MONO} />
                </Field>
                <textarea
                  className="w-full min-h-[140px] mt-2 p-2 rounded-md border border-border bg-background text-[13px] resize-y"
                  value={draft.notes ?? ""}
                  onChange={(e) => set("notes", e.target.value)}
                />
              </EditCard>
              <EditCard title="Stock Item Supplier Notes">
                <Field label="Item">
                  <Input value={draft.code} disabled className={MONO} />
                </Field>
                <textarea
                  className="w-full min-h-[140px] mt-2 p-2 rounded-md border border-border bg-background text-[13px] resize-y"
                  value={draft.wholesaleBlurb ?? ""}
                  onChange={(e) => set("wholesaleBlurb", e.target.value)}
                />
              </EditCard>
            </div>
          </TabsContent>

          {/* DETAILS */}
          <TabsContent value="details" className="mt-3">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <EditCard title="Fitting Sizes">
                <Field label="Item">
                  <Input value={draft.code} disabled className={MONO} />
                </Field>
                <FormGrid cols={2} className="mt-2">
                  <Field label="Fitting Pack Assort">
                    <Input
                      value={draft.fittingPackAssort ?? ""}
                      onChange={(e) => set("fittingPackAssort", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                  <Field label="Fitting Measure">
                    <Input
                      value={draft.fittingMeasure ?? ""}
                      onChange={(e) => set("fittingMeasure", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                  <Field label="Fitting Spec" className="md:col-span-2">
                    <Input
                      value={draft.fittingSpec ?? ""}
                      onChange={(e) => set("fittingSpec", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                </FormGrid>
              </EditCard>
              <EditCard title="Dimensions">
                <Field label="Item">
                  <Input value={draft.code} disabled className={MONO} />
                </Field>
                <FormGrid cols={2} className="mt-2">
                  <Field label="Dimension Pack">
                    <Input
                      value={draft.dimensionPack ?? ""}
                      onChange={(e) => set("dimensionPack", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                  <Field label="Dimension Measure">
                    <Input
                      value={draft.dimensionMeasure ?? ""}
                      onChange={(e) => set("dimensionMeasure", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                  <Field label="Dimension Spec" className="md:col-span-2">
                    <Input
                      value={draft.dimensionSpec ?? ""}
                      onChange={(e) => set("dimensionSpec", e.target.value)}
                      className={TXT}
                    />
                  </Field>
                </FormGrid>
              </EditCard>
              <EditCard title="Stock Specifications">
                <FormGrid cols={3}>
                  <Field label="Pack Quantity">
                    <Input
                      type="number"
                      value={draft.packQuantity ?? 0}
                      onChange={(e) => set("packQuantity", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Weight (gm)">
                    <Input
                      type="number"
                      value={draft.weightGm ?? 0}
                      onChange={(e) => set("weightGm", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Volume">
                    <Input
                      type="number"
                      value={draft.volume ?? 0}
                      onChange={(e) => set("volume", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                </FormGrid>
                <h4 className="text-[12px] font-semibold mt-3 mb-1.5 text-muted-foreground uppercase tracking-wide">
                  Dimensions
                </h4>
                <FormGrid cols={3}>
                  <Field label="Length">
                    <Input
                      type="number"
                      value={draft.length ?? 0}
                      onChange={(e) => set("length", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Breadth">
                    <Input
                      type="number"
                      value={draft.breadth ?? 0}
                      onChange={(e) => set("breadth", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Field label="Height">
                    <Input
                      type="number"
                      value={draft.height ?? 0}
                      onChange={(e) => set("height", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                </FormGrid>
                <h4 className="text-[12px] font-semibold mt-3 mb-1.5 text-muted-foreground uppercase tracking-wide">
                  Pack Labels
                </h4>
                <div className="flex items-end gap-2">
                  <Field label="A4 Pack Labels" className="flex-1">
                    <Input
                      type="number"
                      value={draft.a4PackLabels ?? 0}
                      onChange={(e) => set("a4PackLabels", Number(e.target.value))}
                      className={NUM}
                    />
                  </Field>
                  <Button size="sm" className="h-8" onClick={() => toast.success("Print queued")}>
                    Print Sheets
                  </Button>
                </div>
              </EditCard>
            </div>
          </TabsContent>

          {/* KITS */}
          <TabsContent value="kits" className="mt-3">
            <EditCard title="Kits">
              <table className="w-full text-[13px]">
                <thead className="text-[11.5px] uppercase text-muted-foreground border-b border-border">
                  <tr>
                    {[
                      "Show Kit",
                      "Bay",
                      "Bay Name",
                      "Board",
                      "Position",
                      "Stock Code",
                      "Pieces",
                    ].map((h) => (
                      <th key={h} className="text-left font-medium pb-1.5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground text-[12.5px]"
                    >
                      No kits assigned.
                    </td>
                  </tr>
                </tbody>
              </table>
            </EditCard>
          </TabsContent>
        </Tabs>
      </EditScreen>
    </FormProvider>
  );
}
