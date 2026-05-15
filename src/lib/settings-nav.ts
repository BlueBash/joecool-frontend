// Settings navigation tree — supports arbitrary nesting.
//
// A "group" is a collapsible bucket in the sidebar.
// A "section" is a leaf navigable page (renders /settings/$section).
// A group can contain sections, nested groups, or both.
import {
  Boxes,
  Ruler,
  Palette,
  Tag,
  MessageSquare,
  MapPin,
  Users,
  Settings as SettingsIcon,
  type LucideIcon,
  DollarSign,
} from "lucide-react";

export type SettingsSection = {
  slug: string;
  resourceKey: string;
  label: string;
  /** Mock-store key for sidebar counts (`useSettings` seed). Defaults to `slug`. */
  countKey?: string;
};

export type SettingsGroup = {
  slug: string;
  label: string;
  icon?: LucideIcon;
  sections?: SettingsSection[];
  groups?: SettingsGroup[];
};

/** Top-level Stock group: nested sub-areas list in sidebar; their sections use in-page tabs only */
export const SETTINGS_STOCK_SIDEBAR_ROOT_SLUG = "stock";

export const settingsTree: SettingsGroup[] = [
  {
    slug: "stock",
    label: "Stock",
    icon: Boxes,

    groups: [
      {
        slug: "category",
        label: "Category",

        sections: [
          {
            resourceKey: "stock.category.categories",
            slug: "stock/category/categories",
            label: "Categories",
            countKey: "category",
          },

          {
            resourceKey: "stock.category.groups",
            slug: "stock/category/groups",
            label: "Category Groups",
          },

          {
            resourceKey: "stock.category.packaging",
            slug: "stock/category/packaging",
            label: "Packaging",
          },
        ],
      },

      {
        slug: "fittings",
        label: "Fittings",

        sections: [
          {
            resourceKey: "stock.fittings.sizes-pack-assortments",
            slug: "stock/fittings/sizes-pack-assortments",
            label: "Pack Assortments",
            countKey: "fittings",
          },

          {
            resourceKey: "stock.fittings.sizes-specs",
            slug: "stock/fittings/sizes-specs",
            label: "Sizes Specs",
            countKey: "fittings",
          },

          {
            resourceKey: "stock.fittings.sizes-measures",
            slug: "stock/fittings/sizes-measures",
            label: "Sizes Measures",
            countKey: "fittings",
          },

          {
            resourceKey: "stock.fittings.messages",
            slug: "stock/fittings/messages",
            label: "Fitting Messages",
            countKey: "fittings",
          },
        ],
      },

      {
        slug: "dimensions",
        label: "Dimensions",

        sections: [
          {
            resourceKey: "stock.dimensions.pack-assortments",
            slug: "stock/dimensions/pack-assortments",
            label: "Pack Assortments",
            countKey: "dimensions",
          },

          {
            resourceKey: "stock.dimensions.specs",
            slug: "stock/dimensions/specs",
            label: "Specs",
            countKey: "dimensions",
          },

          {
            resourceKey: "stock.dimensions.measures",
            slug: "stock/dimensions/measures",
            label: "Measures",
            countKey: "dimensions",
          },

          {
            resourceKey: "stock.dimensions.messages",
            slug: "stock/dimensions/messages",
            label: "Messages",
            countKey: "dimensions",
          },
        ],
      },

      {
        slug: "stock-details",
        label: "Stock",

        sections: [
          {
            resourceKey: "stock.stock.selections",
            slug: "stock/stock/selections",
            label: "Selections",
            countKey: "others",
          },

          {
            resourceKey: "stock.stock.collections",
            slug: "stock/stock/collections",
            label: "Collections",
            countKey: "others",
          },

          {
            resourceKey: "stock.stock.stock-ranges",
            slug: "stock/stock/stock-ranges",
            label: "Stock Ranges",
            countKey: "others",
          },

          {
            resourceKey: "stock.stock.marketing",
            slug: "stock/stock/marketing",
            label: "Marketing",
            countKey: "messages",
          },
        ],
      },

      {
        slug: "amazon",
        label: "Amazon",

        sections: [
          {
            resourceKey: "stock.amazon.templates",
            slug: "stock/amazon/templates",
            label: "Templates",
          },
          {
            resourceKey: "stock.amazon.product-types",
            slug: "stock/amazon/product-types",
            label: "Product types",
          },
          {
            resourceKey: "stock.amazon.browse-nodes",
            slug: "stock/amazon/browse-nodes",
            label: "Browse nodes",
          },
          {
            resourceKey: "stock.amazon.materials",
            slug: "stock/amazon/materials",
            label: "Materials",
          },
          {
            resourceKey: "stock.amazon.metal-types",
            slug: "stock/amazon/metal-types",
            label: "Metal types",
          },
          {
            resourceKey: "stock.amazon.metal-stamps",
            slug: "stock/amazon/metal-stamps",
            label: "Metal stamps",
          },
          {
            resourceKey: "stock.amazon.us-item-types",
            slug: "stock/amazon/us-item-types",
            label: "US item types",
          },
        ],
      },

      {
        slug: "attributes",
        label: "Attributes",

        sections: [
          {
            resourceKey: "stock.attributes.colors",
            slug: "stock/colors",
            label: "Colors",
            countKey: "colours",
          },

          {
            resourceKey: "stock.attributes.colors-options",
            slug: "stock/colors-options",
            label: "Color Options",
          },

          {
            resourceKey: "stock.attributes.sizes",
            slug: "stock/sizes",
            label: "Ring sizes",
            countKey: "sizes",
          },

          {
            resourceKey: "stock.attributes.web-stock-availability",
            slug: "stock/sizes/web-availability",
            label: "Web availability",
          },

          {
            resourceKey: "stock.attributes.units",
            slug: "stock/units",
            label: "Units",
            countKey: "units",
          },
        ],
      },

      {
        slug: "presentation",
        label: "Presentation",

        sections: [
          {
            resourceKey: "stock.presentation.carding",
            slug: "stock/carding",
            label: "Carding",
            countKey: "carding",
          },

          {
            resourceKey: "stock.presentation.displays",
            slug: "stock/displays",
            label: "Displays",
            countKey: "displays",
          },

          {
            resourceKey: "stock.presentation.assembly-costs",
            slug: "stock/assembly-costs",
            label: "Assembly Costs",
            countKey: "costs",
          },

          {
            resourceKey: "stock.presentation.packing-costs",
            slug: "stock/packing-costs",
            label: "Packing Costs",
            countKey: "costs",
          },
        ],
      },

      {
        slug: "others",
        label: "Others",

        sections: [
          {
            resourceKey: "stock.others.other-assortments",
            slug: "stock/other-assortments",
            label: "Assortments",
            countKey: "others",
          },

          {
            resourceKey: "stock.others.other-genders",
            slug: "stock/other-genders",
            label: "Genders",
            countKey: "others",
          },

          {
            resourceKey: "stock.others.other-materials",
            slug: "stock/other-materials",
            label: "Materials",
            countKey: "others",
          },

          {
            resourceKey: "stock.others.other-online-ranges",
            slug: "stock/other-online-ranges",
            label: "Online Ranges",
            countKey: "others",
          },

          {
            resourceKey: "stock.others.other-custom-tariff-codes",
            slug: "stock/other-custom-tariff-codes",
            label: "Custom Tariff Codes",
            countKey: "others",
          },
        ],
      },
    ],
  },

  // ================= PRICE =================
  {
    slug: "price",
    label: "Price",
    icon: DollarSign,

    sections: [
      {
        resourceKey: "price.category",
        slug: "price/category",
        label: "Category",
      },

      {
        resourceKey: "price.calculation",
        slug: "price/calculation",
        label: "Calculation",
      },

      {
        resourceKey: "price.currencies",
        slug: "price/currencies",
        label: "Currencies",
      },
    ],
  },

  // ================= ADDRESS =================
  {
    slug: "address",
    label: "Addresses",
    icon: MapPin,

    sections: [
      {
        resourceKey: "address.category",
        slug: "address/category",
        label: "Category",
      },

      {
        resourceKey: "address.payment-method",
        slug: "address/payment-method",
        label: "Payment Method",
      },

      {
        resourceKey: "address.ship-from",
        slug: "address/ship-from",
        label: "Ship From",
      },

      {
        resourceKey: "address.pay-term",
        slug: "address/pay-term",
        label: "Pay Term",
      },

      {
        resourceKey: "address.special-customer",
        slug: "address/special-customer",
        label: "Special Customer",
      },

      {
        resourceKey: "address.ship-method",
        slug: "address/ship-method",
        label: "Ship Method",
      },

      {
        resourceKey: "address.contact-departments",
        slug: "address/contact-departments",
        label: "Contact Departments",
      },

      {
        resourceKey: "address.contact-role",
        slug: "address/contact-role",
        label: "Contact Roles",
      },

      {
        resourceKey: "address.agent",
        slug: "address/agent",
        label: "Agents",
      },

      {
        resourceKey: "address.country",
        slug: "address/country",
        label: "Countries",
      },

      {
        resourceKey: "address.ups-service",
        slug: "address/ups-service",
        label: "UPS Service",
      },
    ],
  },

  // ================= OPERATORS =================
  {
    slug: "operators",
    label: "Operators",
    icon: Users,

    sections: [
      {
        resourceKey: "operators.roles",
        slug: "operators/roles",
        label: "Roles",
      },

      {
        resourceKey: "operators.permissions",
        slug: "operators/permissions",
        label: "Permissions",
      },

      {
        resourceKey: "operators.departments",
        slug: "operators/departments",
        label: "Departments",
      },
    ],
  },

  // ================= MESSAGES =================
  {
    slug: "messages",
    label: "Messaging",
    icon: MessageSquare,

    sections: [
      {
        resourceKey: "messages.purposes",
        slug: "messages/purposes",
        label: "Purposes",
      },

      {
        resourceKey: "messages.general",
        slug: "messages/general",
        label: "General",
      },

      {
        resourceKey: "messages.shipping",
        slug: "messages/shipping",
        label: "Shipping",
      },

      {
        resourceKey: "messages.payment-term",
        slug: "messages/payment-term",
        label: "Payment Term",
      },

      {
        resourceKey: "messages.payment-method",
        slug: "messages/payment-method",
        label: "Payment Method",
      },

      {
        resourceKey: "messages.bank",
        slug: "messages/bank",
        label: "Bank",
      },
    ],
  },

  // ================= SYSTEM =================
  {
    slug: "others",
    label: "System",
    icon: SettingsIcon,

    sections: [
      {
        resourceKey: "others.profit-centre",
        slug: "others/profit-centre",
        label: "Profit Centre",
      },

      {
        resourceKey: "others.area",
        slug: "others/area",
        label: "Area",
      },

      {
        resourceKey: "others.invoice-environment",
        slug: "others/invoice-environment",
        label: "Invoice Environment",
      },

      {
        resourceKey: "others.warehouse",
        slug: "others/warehouse",
        label: "Warehouse",
      },

      {
        resourceKey: "others.shipping-charges",
        slug: "others/shipping-charges",
        label: "Shipping Charges",
      },

      {
        resourceKey: "others.cost-codes",
        slug: "others/cost-codes",
        label: "Cost Codes",
      },

      {
        resourceKey: "others.order-kinds",
        slug: "others/order-kinds",
        label: "Order Kinds",
      },

      {
        resourceKey: "others.languages",
        slug: "others/languages",
        label: "Languages",
      },

      {
        resourceKey: "others.label-sources",
        slug: "others/label-sources",
        label: "Label Sources",
      },

      {
        resourceKey: "others.vat-kinds",
        slug: "others/vat-kinds",
        label: "VAT Kinds",
      },

      {
        resourceKey: "others.vat-rate-codes",
        slug: "others/vat-rate-codes",
        label: "VAT Rate Codes",
      },

      {
        resourceKey: "others.bank-account",
        slug: "others/bank-account",
        label: "Bank Accounts",
      },

      {
        resourceKey: "others.map-accountants",
        slug: "others/map-accountants",
        label: "Map Accountants",
      },

      {
        resourceKey: "others.profit-loss",
        slug: "others/profit-loss",
        label: "Profit & Loss",
      },

      {
        resourceKey: "others.cash-flow",
        slug: "others/cash-flow",
        label: "Cash Flow",
      },

      {
        resourceKey: "others.venues",
        slug: "others/venues",
        label: "Venues",
      },

      {
        resourceKey: "others.documents",
        slug: "others/documents",
        label: "Documents",
      },
    ],
  },
];

export type SettingsTrail = {
  groups: SettingsGroup[]; // ancestor chain (root → leaf parent)
  section: SettingsSection;
  siblings: SettingsSection[]; // sections under the same direct parent
};

export function findSettingsTrail(
  slug: string,
  tree: SettingsGroup[] = settingsTree,
  ancestors: SettingsGroup[] = [],
): SettingsTrail | undefined {
  for (const g of tree) {
    const chain = [...ancestors, g];
    const hit = g.sections?.find((s) => s.slug === slug);
    if (hit) return { groups: chain, section: hit, siblings: g.sections ?? [] };
    if (g.groups) {
      const nested = findSettingsTrail(slug, g.groups, chain);
      if (nested) return nested;
    }
  }
  return undefined;
}

export function firstSection(group: SettingsGroup): SettingsSection | undefined {
  if (group.sections?.length) return group.sections[0];
  if (group.groups?.length) {
    for (const g of group.groups) {
      const s = firstSection(g);
      if (s) return s;
    }
  }
  return undefined;
}

export function countSections(group: SettingsGroup): number {
  let n = group.sections?.length ?? 0;
  group.groups?.forEach((g) => {
    n += countSections(g);
  });
  return n;
}

export const sectionTitles: Record<string, { title: string; desc: string }> = {
  "stock/category/categories": {
    title: "Stock categories",
    desc: "Product categories used across stock and listings.",
  },
  "stock/category/groups": {
    title: "Category groups",
    desc: "Higher-level groupings for categories.",
  },
  "stock/category/packaging": {
    title: "Packaging",
    desc: "Packaging codes and labels.",
  },
  "stock/fittings/sizes-pack-assortments": {
    title: "Fitting pack assortments",
    desc: "Pack assortments linked to fitting size specs.",
  },
  "stock/fittings/sizes-specs": {
    title: "Fitting size specs",
    desc: "Specification rows for fitting sizes.",
  },
  "stock/fittings/sizes-measures": {
    title: "Fitting size measures",
    desc: "Units and measures for fitting sizes.",
  },
  "stock/fittings/messages": {
    title: "Fitting messages",
    desc: "Customer-facing fitting copy by category and assortment.",
  },
  "stock/dimensions/pack-assortments": {
    title: "Dimension pack assortments",
    desc: "Pack assortments used in dimension messaging.",
  },
  "stock/dimensions/specs": {
    title: "Dimension specs",
    desc: "Dimension specification definitions.",
  },
  "stock/dimensions/measures": {
    title: "Dimension measures",
    desc: "Measures used with dimension specs.",
  },
  "stock/dimensions/messages": {
    title: "Dimension messages",
    desc: "Templated dimension copy for channels.",
  },
  "stock/stock/selections": { title: "Selections", desc: "Stock selection lookup values." },
  "stock/stock/collections": { title: "Collections", desc: "Collection lookup values." },
  "stock/stock/stock-ranges": { title: "Stock ranges", desc: "Range codes for stock." },
  "stock/stock/marketing": { title: "Marketing blurbs", desc: "Short marketing snippets." },
  "stock/amazon/templates": { title: "Amazon templates", desc: "Amazon listing templates." },
  "stock/amazon/product-types": {
    title: "Amazon product types",
    desc: "Amazon product type definitions.",
  },
  "stock/amazon/browse-nodes": { title: "Amazon browse nodes", desc: "Browse node hierarchy." },
  "stock/amazon/materials": { title: "Amazon materials", desc: "Amazon material labels." },
  "stock/amazon/metal-types": { title: "Amazon metal types", desc: "Metal type reference data." },
  "stock/amazon/metal-stamps": { title: "Amazon metal stamps", desc: "Metal stamp reference data." },
  "stock/amazon/us-item-types": {
    title: "Amazon US item types",
    desc: "US marketplace item type strings.",
  },
  "stock/colors": { title: "Colours", desc: "Colour swatches and codes." },
  "stock/colors-options": { title: "Colour options", desc: "Bundled / assorted colour options." },
  "stock/sizes": { title: "Ring sizes", desc: "International ring size conversion table." },
  "stock/sizes/web-availability": {
    title: "Web availability messages",
    desc: "Messages shown for web stock availability states.",
  },
  "stock/units": { title: "Units", desc: "Units of measure." },
  "stock/carding": { title: "Carding", desc: "Carding / ticket options." },
  "stock/displays": { title: "Displays", desc: "Display types." },
  "stock/assembly-costs": { title: "Assembly costs", desc: "Assembly-side cost rows." },
  "stock/packing-costs": { title: "Packing costs", desc: "Packing-side cost rows." },
  "stock/other-assortments": { title: "Assortments", desc: "Other assortment codes." },
  "stock/other-genders": { title: "Target genders", desc: "Gender target lookup values." },
  "stock/other-materials": { title: "Materials", desc: "Jewellery / product materials." },
  "stock/other-online-ranges": { title: "Joe online ranges", desc: "Joe Cool online range flags." },
  "stock/other-custom-tariff-codes": {
    title: "Custom tariff codes",
    desc: "Customs / tariff reference codes.",
  },
  "price/category": { title: "Price category", desc: "Price book categories." },
  "price/calculation": { title: "Price calculation", desc: "Calculation rules and bases." },
  "price/currencies": { title: "Currencies", desc: "Supported currencies." },
  "address/category": { title: "Address category", desc: "Address classification." },
  "address/payment-method": { title: "Payment methods", desc: "Accepted payment methods." },
  "address/ship-from": { title: "Ship from", desc: "Ship-from locations." },
  "address/pay-term": { title: "Pay terms", desc: "Payment term codes." },
  "address/special-customer": { title: "Special customers", desc: "Special customer flags." },
  "address/ship-method": { title: "Ship methods", desc: "Carrier / ship methods." },
  "address/contact-departments": { title: "Contact departments", desc: "Department directory." },
  "address/contact-role": { title: "Contact roles", desc: "Roles on customer contacts." },
  "address/agent": { title: "Agents", desc: "Agent directory." },
  "address/country": { title: "Countries", desc: "Country reference list." },
  "address/ups-service": { title: "UPS services", desc: "UPS service codes." },
  "operators/roles": { title: "Roles", desc: "Operator roles." },
  "operators/permissions": { title: "Permissions", desc: "Fine-grained permissions." },
  "operators/departments": { title: "Departments", desc: "Operator departments." },
  "messages/purposes": { title: "Message purposes", desc: "Why a message is shown." },
  "messages/general": { title: "General messages", desc: "General-purpose snippets." },
  "messages/shipping": { title: "Shipping messages", desc: "Shipping-related snippets." },
  "messages/payment-term": { title: "Payment term messages", desc: "Payment term copy." },
  "messages/payment-method": { title: "Payment method messages", desc: "Payment method copy." },
  "messages/bank": { title: "Bank messages", desc: "Banking / remittance copy." },
  "others/profit-centre": { title: "Profit centres", desc: "Profit centre codes." },
  "others/area": { title: "Areas", desc: "Business areas / regions." },
  "others/invoice-environment": { title: "Invoice environments", desc: "Invoice environment keys." },
  "others/warehouse": { title: "Warehouses", desc: "Warehouse master list." },
  "others/shipping-charges": { title: "Shipping charges", desc: "Shipping charge rules." },
  "others/cost-codes": { title: "Cost codes", desc: "Cost accounting codes." },
  "others/order-kinds": { title: "Order kinds", desc: "Order classification." },
  "others/languages": { title: "Languages", desc: "Supported languages." },
  "others/label-sources": { title: "Label sources", desc: "Label feed sources." },
  "others/vat-kinds": { title: "VAT kinds", desc: "VAT category kinds." },
  "others/vat-rate-codes": { title: "VAT rate codes", desc: "VAT rate identifiers." },
  "others/bank-account": { title: "Bank accounts", desc: "Company bank accounts." },
  "others/map-accountants": { title: "Map accountants", desc: "Accountant mapping." },
  "others/profit-loss": { title: "Profit & loss", desc: "P&L mapping rows." },
  "others/cash-flow": { title: "Cash flow", desc: "Cash flow mapping rows." },
  "others/venues": { title: "Venues", desc: "Venue master list." },
  "others/documents": { title: "Documents", desc: "Document types." },
};
