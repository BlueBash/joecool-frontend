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

export type SettingsSection = { slug: string; resourceKey: string; label: string };

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
            slug: "/stock/category/categories",
            label: "Categories",
          },

          {
            resourceKey: "stock.category.groups",
            slug: "/stock/category/groups",
            label: "Category Groups",
          },
        ],
      },

      {
        slug: "fittings",
        label: "Fittings",

        sections: [
          {
            resourceKey: "stock.fittings.sizes-pack-assortments",
            slug: "/stock/fittings/sizes-pack-assortments",
            label: "Pack Assortments",
          },

          {
            resourceKey: "stock.fittings.sizes-specs",
            slug: "/stock/fittings/sizes-specs",
            label: "Sizes Specs",
          },

          {
            resourceKey: "stock.fittings.sizes-measures",
            slug: "/stock/fittings/sizes-measures",
            label: "Sizes Measures",
          },

          {
            resourceKey: "stock.fittings.messages",
            slug: "/stock/fittings/messages",
            label: "Fitting Messages",
          },
        ],
      },

      {
        slug: "dimensions",
        label: "Dimensions",

        sections: [
          {
            resourceKey: "stock.dimensions.pack-assortments",
            slug: "/stock/dimensions/pack-assortments",
            label: "Pack Assortments",
          },

          {
            resourceKey: "stock.dimensions.specs",
            slug: "/stock/dimensions/specs",
            label: "Specs",
          },

          {
            resourceKey: "stock.dimensions.measures",
            slug: "/stock/dimensions/measures",
            label: "Measures",
          },

          {
            resourceKey: "stock.dimensions.messages",
            slug: "/stock/dimensions/messages",
            label: "Messages",
          },
        ],
      },

      {
        slug: "stock-details",
        label: "Stock",

        sections: [
          {
            resourceKey: "stock.stock.selections",
            slug: "/stock/stock/selections",
            label: "Selections",
          },

          {
            resourceKey: "stock.stock.collections",
            slug: "/stock/stock/collections",
            label: "Collections",
          },

          {
            resourceKey: "stock.stock.stock-ranges",
            slug: "/stock/stock/stock-ranges",
            label: "Stock Ranges",
          },

          {
            resourceKey: "stock.stock.marketing",
            slug: "/stock/stock/marketing",
            label: "Marketing",
          },
        ],
      },

      {
        slug: "attributes",
        label: "Attributes",

        sections: [
          {
            resourceKey: "stock.attributes.colors",
            slug: "/stock/colors",
            label: "Colors",
          },

          {
            resourceKey: "stock.attributes.colors-options",
            slug: "/stock/colors-options",
            label: "Color Options",
          },

          {
            resourceKey: "stock.attributes.sizes",
            slug: "/stock/sizes",
            label: "Sizes",
          },

          {
            resourceKey: "stock.attributes.units",
            slug: "/stock/units",
            label: "Units",
          },
        ],
      },

      {
        slug: "presentation",
        label: "Presentation",

        sections: [
          {
            resourceKey: "stock.presentation.carding",
            slug: "/stock/carding",
            label: "Carding",
          },

          {
            resourceKey: "stock.presentation.displays",
            slug: "/stock/displays",
            label: "Displays",
          },

          {
            resourceKey: "stock.presentation.assembly-costs",
            slug: "/stock/assembly-costs",
            label: "Assembly Costs",
          },

          {
            resourceKey: "stock.presentation.packing-costs",
            slug: "/stock/packing-costs",
            label: "Packing Costs",
          },
        ],
      },

      {
        slug: "others",
        label: "Others",

        sections: [
          {
            resourceKey: "stock.others.other-assortments",
            slug: "/stock/other-assortments",
            label: "Assortments",
          },

          {
            resourceKey: "stock.others.other-genders",
            slug: "/stock/other-genders",
            label: "Genders",
          },

          {
            resourceKey: "stock.others.other-materials",
            slug: "/stock/other-materials",
            label: "Materials",
          },

          {
            resourceKey: "stock.others.other-online-ranges",
            slug: "/stock/other-online-ranges",
            label: "Online Ranges",
          },

          {
            resourceKey: "stock.others.other-custom-tariff-codes",
            slug: "/stock/other-custom-tariff-codes",
            label: "Custom Tariff Codes",
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
        slug: "/price/category",
        label: "Category",
      },

      {
        resourceKey: "price.calculation",
        slug: "/price/calculation",
        label: "Calculation",
      },

      {
        resourceKey: "price.currencies",
        slug: "/price/currencies",
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
        slug: "/address/category",
        label: "Category",
      },

      {
        resourceKey: "address.payment-method",
        slug: "/address/payment-method",
        label: "Payment Method",
      },

      {
        resourceKey: "address.ship-from",
        slug: "/address/ship-from",
        label: "Ship From",
      },

      {
        resourceKey: "address.pay-term",
        slug: "/address/pay-term",
        label: "Pay Term",
      },

      {
        resourceKey: "address.special-customer",
        slug: "/address/special-customer",
        label: "Special Customer",
      },

      {
        resourceKey: "address.ship-method",
        slug: "/address/ship-method",
        label: "Ship Method",
      },

      {
        resourceKey: "address.contact-departments",
        slug: "/address/contact-departments",
        label: "Contact Departments",
      },

      {
        resourceKey: "address.contact-role",
        slug: "/address/contact-role",
        label: "Contact Roles",
      },

      {
        resourceKey: "address.agent",
        slug: "/address/agent",
        label: "Agents",
      },

      {
        resourceKey: "address.country",
        slug: "/address/country",
        label: "Countries",
      },

      {
        resourceKey: "address.ups-service",
        slug: "/address/ups-service",
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
        slug: "/operators/roles",
        label: "Roles",
      },

      {
        resourceKey: "operators.permissions",
        slug: "/operators/permissions",
        label: "Permissions",
      },

      {
        resourceKey: "operators.departments",
        slug: "/operators/departments",
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
        slug: "/messages/purposes",
        label: "Purposes",
      },

      {
        resourceKey: "messages.general",
        slug: "/messages/general",
        label: "General",
      },

      {
        resourceKey: "messages.shipping",
        slug: "/messages/shipping",
        label: "Shipping",
      },

      {
        resourceKey: "messages.payment-term",
        slug: "/messages/payment-term",
        label: "Payment Term",
      },

      {
        resourceKey: "messages.payment-method",
        slug: "/messages/payment-method",
        label: "Payment Method",
      },

      {
        resourceKey: "messages.bank",
        slug: "/messages/bank",
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
        slug: "/others/profit-centre",
        label: "Profit Centre",
      },

      {
        resourceKey: "others.area",
        slug: "/others/area",
        label: "Area",
      },

      {
        resourceKey: "others.invoice-environment",
        slug: "/others/invoice-environment",
        label: "Invoice Environment",
      },

      {
        resourceKey: "others.warehouse",
        slug: "/others/warehouse",
        label: "Warehouse",
      },

      {
        resourceKey: "others.shipping-charges",
        slug: "/others/shipping-charges",
        label: "Shipping Charges",
      },

      {
        resourceKey: "others.cost-codes",
        slug: "/others/cost-codes",
        label: "Cost Codes",
      },

      {
        resourceKey: "others.order-kinds",
        slug: "/others/order-kinds",
        label: "Order Kinds",
      },

      {
        resourceKey: "others.languages",
        slug: "/others/languages",
        label: "Languages",
      },

      {
        resourceKey: "others.label-sources",
        slug: "/others/label-sources",
        label: "Label Sources",
      },

      {
        resourceKey: "others.vat-kinds",
        slug: "/others/vat-kinds",
        label: "VAT Kinds",
      },

      {
        resourceKey: "others.vat-rate-codes",
        slug: "/others/vat-rate-codes",
        label: "VAT Rate Codes",
      },

      {
        resourceKey: "others.bank-account",
        slug: "/others/bank-account",
        label: "Bank Accounts",
      },

      {
        resourceKey: "others.map-accountants",
        slug: "/others/map-accountants",
        label: "Map Accountants",
      },

      {
        resourceKey: "others.profit-loss",
        slug: "/others/profit-loss",
        label: "Profit & Loss",
      },

      {
        resourceKey: "others.cash-flow",
        slug: "/others/cash-flow",
        label: "Cash Flow",
      },

      {
        resourceKey: "others.venues",
        slug: "/others/venues",
        label: "Venues",
      },

      {
        resourceKey: "others.documents",
        slug: "/others/documents",
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
  category: { title: "Stock Categories", desc: "Top-level grouping for stock items." },
  "category-groups": { title: "Stock Category Groups", desc: "Higher-level category groupings." },
  fittings: { title: "Fitting Pack Assortments", desc: "Attachment / fastening pack assortments." },
  "fitting-specs": {
    title: "Fitting Sizes Specs",
    desc: "Specification details per fitting size.",
  },
  "fitting-measures": {
    title: "Fitting Sizes Measures",
    desc: "Measurement values per fitting size.",
  },
  "fitting-messages": { title: "Fitting Messages", desc: "Original fitting message snippets." },
  dimensions: { title: "Dimensions", desc: "Standard size buckets." },
  colours: { title: "Colours", desc: "Colour options shown on products." },
  sizes: { title: "Sizes", desc: "Size options shown on products." },
  units: { title: "Units", desc: "Units of measure for stock and orders." },
  carding: { title: "Carding", desc: "Card / packaging options." },
  displays: { title: "Displays", desc: "In-store display formats." },
  costs: { title: "Costs", desc: "Cost calculation bases." },
  messages: { title: "Messages", desc: "Re-usable message snippets." },
  others: { title: "Tags", desc: "Misc labels." },
  "address-types": { title: "Address Types", desc: "Categorise addresses (billing, shipping…)." },
  regions: { title: "Regions", desc: "Sales / shipping regions." },
  countries: { title: "Countries", desc: "Country codes available across the app." },
  roles: { title: "Roles", desc: "Operator roles for permission grouping." },
  permissions: { title: "Permissions", desc: "Granular permission keys." },
  departments: { title: "Departments", desc: "Operator department assignments." },
};
