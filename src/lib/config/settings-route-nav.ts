import { settingsPathToSlug } from "@/lib/config/settings-paths";
import {
  getSettingsPathGroups,
  type SettingsPathGroup,
} from "@/lib/config/settings-route-groups";
import {
  humanizePathSegment,
  humanizeSlug,
  resolveSectionLabel,
  SETTINGS_SECTION_META,
} from "@/lib/config/settings-section-meta";
import type { SettingsGroup, SettingsSection } from "@/lib/config/settings-nav-types";
import {
  Boxes,
  DollarSign,
  MapPin,
  MessageSquare,
  Settings as SettingsIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const DOMAIN_META: Record<string, { label: string; icon: LucideIcon }> = {
  stock: { label: "Stock", icon: Boxes },
  price: { label: "Price", icon: DollarSign },
  address: { label: "Addresses", icon: MapPin },
  messages: { label: "Messaging", icon: MessageSquare },
  others: { label: "Others", icon: SettingsIcon },
};

const DOMAIN_ORDER = ["stock", "price", "address", "messages", "others"] as const;

function sectionFromSlug(slug: string): SettingsSection {
  const meta = SETTINGS_SECTION_META[slug];
  if (meta) {
    return {
      slug,
      label: meta.label,
      resourceKey: meta.resourceKey,
      countKey: meta.countKey,
    };
  }
  return {
    slug,
    label: humanizeSlug(slug),
    resourceKey: slug.replace(/\//g, "."),
  };
}

function sectionsFromRoutes(routes: readonly string[]): SettingsSection[] {
  return routes.map((path) => sectionFromSlug(settingsPathToSlug(path)));
}

function commonPrefix(segments: string[][]): string[] {
  if (!segments.length) return [];
  const minLen = Math.min(...segments.map((s) => s.length));
  const prefix: string[] = [];
  for (let i = 0; i < minLen; i++) {
    const value = segments[0][i];
    if (segments.every((s) => s[i] === value)) {
      prefix.push(value);
    } else {
      break;
    }
  }
  return prefix;
}

/** Derives stock sidebar subgroup slug/label from route URLs in a path group. */
function deriveStockSubgroupMeta(group: SettingsPathGroup): { slug: string; label: string } {
  const slugs = group.routes.map((path) => settingsPathToSlug(path));

  if (slugs.every((slug) => slug.startsWith("stock/stock/"))) {
    return { slug: "stock-details", label: "Stock" };
  }

  const stockSegments = slugs.map((slug) => slug.split("/").slice(1));
  const shared = commonPrefix(stockSegments);

  if (shared.length >= 1) {
    const first = shared[0];
    if (first === "category" || first === "fittings" || first === "dimensions") {
      return { slug: first, label: humanizePathSegment(first) };
    }
  }

  const leafSegments = stockSegments.map((s) => s[0]).filter(Boolean);

  if (leafSegments.every((seg) => seg.startsWith("other-"))) {
    return { slug: "others", label: "Others" };
  }

  if (leafSegments.every((seg) => seg.endsWith("-costs"))) {
    return { slug: "costs", label: "Costs" };
  }

  if (leafSegments.every((seg) => seg.startsWith("color"))) {
    return { slug: "colors", label: "Colors" };
  }

  if (leafSegments.length === 1) {
    return { slug: leafSegments[0], label: humanizePathSegment(leafSegments[0]) };
  }

  if (shared.length >= 1) {
    return {
      slug: shared.join("-"),
      label: humanizePathSegment(shared[shared.length - 1]),
    };
  }

  const fallbackSlug = settingsPathToSlug(group.basePath).split("/").slice(1).join("/");
  return { slug: fallbackSlug, label: resolveSectionLabel(group.slug) };
}

function stockNavGroupFromPathGroup(group: SettingsPathGroup): SettingsGroup {
  const { slug, label } = deriveStockSubgroupMeta(group);
  return { slug, label, sections: sectionsFromRoutes(group.routes) };
}

function flatDomainNavGroup(domain: string, groups: SettingsPathGroup[]): SettingsGroup {
  const meta = DOMAIN_META[domain] ?? { label: humanizePathSegment(domain), icon: SettingsIcon };
  return {
    slug: domain,
    label: meta.label,
    icon: meta.icon,
    sections: groups.flatMap((g) => sectionsFromRoutes(g.routes)),
  };
}

/** Builds the full settings sidebar tree from `paths` route groups. */
export function buildSettingsNavTreeFromPaths(): SettingsGroup[] {
  const pathGroups = getSettingsPathGroups();
  const byDomain = new Map<string, SettingsPathGroup[]>();

  for (const group of pathGroups) {
    const domain = group.domain;
    if (!byDomain.has(domain)) byDomain.set(domain, []);
    byDomain.get(domain)!.push(group);
  }

  const tree: SettingsGroup[] = [];

  for (const domain of DOMAIN_ORDER) {
    const groups = byDomain.get(domain);
    if (!groups?.length) continue;

    if (domain === "stock") {
      const stockMeta = DOMAIN_META.stock;
      tree.push({
        slug: "stock",
        label: stockMeta.label,
        icon: stockMeta.icon,
        groups: groups.map(stockNavGroupFromPathGroup),
      });
      continue;
    }

    tree.push(flatDomainNavGroup(domain, groups));
  }

  return tree;
}
