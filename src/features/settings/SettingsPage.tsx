import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useSettings } from "@/store";
import { PageHeader } from "@/components/app-shell";
import { cn } from "@/lib/utils";
import {
  settingsTree,
  countSections,
  findSettingsTrail,
  firstSection,
  SETTINGS_STOCK_SIDEBAR_ROOT_SLUG,
  type SettingsGroup,
} from "@/lib/settings-nav";
import { settingsPathToSlug, slugToSettingsPath } from "@/lib/config/settings-paths";
import { SETTINGS_SIDEBAR_ROOT_PARENT_KEY } from "./constants";
import type {
  SettingsSidebarExpandedByParent,
  SidebarGroupProps,
  StockSubgroupRowProps,
  ToggleSettingsSidebarGroup,
} from "./types";

export function SettingsPage() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const activeSection = settingsPathToSlug(path);
  const trail = findSettingsTrail(activeSection);
  const activeGroupSlugs = new Set(trail?.groups.map((g) => g.slug) ?? []);

  const expandedFromTrail = useMemo(() => {
    const sectionTrail = findSettingsTrail(activeSection);
    const map: Record<string, string> = {};
    if (!sectionTrail?.groups.length) return map;
    for (let i = 0; i < sectionTrail.groups.length; i++) {
      const g = sectionTrail.groups[i];
      if (i === 0) {
        map[SETTINGS_SIDEBAR_ROOT_PARENT_KEY] = g.slug;
      } else {
        map[sectionTrail.groups[i - 1].slug] = g.slug;
      }
    }
    return map;
  }, [activeSection]);

  const [expandedByParent, setExpandedByParent] =
    useState<SettingsSidebarExpandedByParent>(expandedFromTrail);

  useEffect(() => {
    setExpandedByParent((prev) => {
      let changed = false;
      const next = { ...prev };

      for (const [parent, slug] of Object.entries(expandedFromTrail)) {
        if (!next[parent]) {
          next[parent] = slug;
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [expandedFromTrail]);

  const toggleSidebarGroup = useCallback<ToggleSettingsSidebarGroup>((parentKey, slug) => {
    setExpandedByParent((prev) => {
      const next = { ...prev };
      if (next[parentKey] === slug) {
        delete next[parentKey];
      } else {
        next[parentKey] = slug;
      }
      return next;
    });
  }, []);

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage lookup tables and reference data used across the app."
      />
      <div className="flex min-h-[calc(100vh-7rem)]">
        <nav className="w-64 shrink-0 border-r border-border bg-muted/20 pt-3 pb-5 px-2 overflow-y-auto scrollbar-thin h-screen">
          <ul className="space-y-0.5">
            {settingsTree.map((group) => (
              <SidebarGroup
                key={group.slug}
                group={group}
                depth={0}
                parentKey={SETTINGS_SIDEBAR_ROOT_PARENT_KEY}
                expandedByParent={expandedByParent}
                onToggleGroup={toggleSidebarGroup}
                activeSection={activeSection}
                activeGroupSlugs={activeGroupSlugs}
                hideSectionsInSidebar={group.slug === SETTINGS_STOCK_SIDEBAR_ROOT_SLUG}
              />
            ))}
          </ul>
        </nav>
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function SidebarGroup({
  group,
  depth,
  parentKey,
  expandedByParent,
  onToggleGroup,
  activeSection,
  activeGroupSlugs,
  hideSectionsInSidebar,
}: SidebarGroupProps) {
  const isOnPath = activeGroupSlugs.has(group.slug);
  const open = expandedByParent[parentKey] === group.slug;

  const catalogs = useSettings((s) => s.catalogs);
  const totalCount = useMemo(() => {
    let n = 0;
    const walk = (g: SettingsGroup) => {
      g.sections?.forEach((s) => {
        n += catalogs[s.countKey ?? s.slug]?.length ?? 0;
      });
      g.groups?.forEach(walk);
    };
    walk(group);
    return n;
  }, [group, catalogs]);

  const Icon = group.icon;
  const indent = depth === 0 ? "px-2.5" : depth === 1 ? "pl-6 pr-2.5" : "pl-9 pr-2.5";

  const stockRoot =
    hideSectionsInSidebar && group.slug === SETTINGS_STOCK_SIDEBAR_ROOT_SLUG && depth === 0;

  if (stockRoot) {
    return (
      <li>
        <button
          type="button"
          onClick={() => onToggleGroup(parentKey, group.slug)}
          className={cn(
            "w-full flex items-center gap-2 py-1.5 rounded-md text-[13px] transition-colors",
            indent,
            isOnPath ? "text-foreground font-medium" : "text-foreground/80 hover:bg-accent",
          )}
          aria-expanded={open}
        >
          <ChevronRight
            className={cn(
              "h-3.5 w-3.5 shrink-0 transition-transform text-muted-foreground",
              open && "rotate-90",
            )}
          />
          {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
          <span className="flex-1 text-left truncate">{group.label}</span>
        </button>

        {open && (
          <ul className="mt-0.5 space-y-0.5">
            {group.groups?.map((sub) => (
              <SidebarGroup
                key={sub.slug}
                group={sub}
                depth={depth + 1}
                parentKey={group.slug}
                expandedByParent={expandedByParent}
                onToggleGroup={onToggleGroup}
                activeSection={activeSection}
                activeGroupSlugs={activeGroupSlugs}
                hideSectionsInSidebar
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  if (hideSectionsInSidebar && group.sections?.length && !group.groups?.length) {
    return (
      <li>
        <StockSubgroupRow group={group} depth={depth} activeGroupSlugs={activeGroupSlugs} />
      </li>
    );
  }

  if (hideSectionsInSidebar && group.groups?.length) {
    const midIndent = depth === 1 ? "pl-6 pr-2.5" : "pl-9 pr-2.5";
    return (
      <li>
        <button
          type="button"
          onClick={() => onToggleGroup(parentKey, group.slug)}
          className={cn(
            "w-full flex items-center gap-2 py-1.5 rounded-md text-[13px] transition-colors",
            midIndent,
            isOnPath ? "text-foreground font-medium" : "text-foreground/80 hover:bg-accent",
          )}
          aria-expanded={open}
        >
          <ChevronRight
            className={cn(
              "h-3.5 w-3.5 shrink-0 transition-transform text-muted-foreground",
              open && "rotate-90",
            )}
          />
          <span className="flex-1 text-left truncate">{group.label}</span>
          <span
            className={cn(
              "text-[11px] tabular-nums",
              isOnPath ? "text-primary/80" : "text-muted-foreground",
            )}
          >
            {totalCount || countSections(group)}
          </span>
        </button>
        {open && (
          <ul className="mt-0.5 space-y-0.5">
            {group.groups.map((sub) => (
              <SidebarGroup
                key={sub.slug}
                group={sub}
                depth={depth + 1}
                parentKey={group.slug}
                expandedByParent={expandedByParent}
                onToggleGroup={onToggleGroup}
                activeSection={activeSection}
                activeGroupSlugs={activeGroupSlugs}
                hideSectionsInSidebar
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        onClick={() => onToggleGroup(parentKey, group.slug)}
        className={cn(
          "w-full flex items-center gap-2 py-1.5 rounded-md text-[13px] transition-colors",
          indent,
          isOnPath ? "text-foreground font-medium" : "text-foreground/80 hover:bg-accent",
        )}
        aria-expanded={open}
      >
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-transform text-muted-foreground",
            open && "rotate-90",
          )}
        />
        {Icon && depth === 0 && <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
        <span className="flex-1 text-left truncate">{group.label}</span>
      </button>
      {open && (
        <ul className="mt-0.5 space-y-0.5">
          {group.sections?.map((s) => {
            const active = s.slug === activeSection;
            return (
              <li key={s.slug}>
                <Link
                  to={slugToSettingsPath(s.slug)}
                  className={cn(
                    "flex items-center justify-between py-1.5 rounded-md text-[13px] transition-colors",
                    depth === 0 ? "pl-9 pr-2.5" : "pl-12 pr-2.5",
                    active
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground/70 hover:bg-accent hover:text-foreground",
                  )}
                >
                  <span className="truncate">{s.label}</span>
                </Link>
              </li>
            );
          })}
          {group.groups?.map((sub) => (
            <SidebarGroup
              key={sub.slug}
              group={sub}
              depth={depth + 1}
              parentKey={group.slug}
              expandedByParent={expandedByParent}
              onToggleGroup={onToggleGroup}
              activeSection={activeSection}
              activeGroupSlugs={activeGroupSlugs}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function StockSubgroupRow({ group, depth, activeGroupSlugs }: StockSubgroupRowProps) {
  const first = firstSection(group);
  const to = first ? slugToSettingsPath(first.slug) : "/settings";
  const isActive = activeGroupSlugs.has(group.slug);
  const rowIndent = depth === 1 ? "pl-9 pr-2.5" : "pl-12 pr-2.5";
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center justify-between py-1.5 rounded-md text-[13px] transition-colors",
        rowIndent,
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-foreground/70 hover:bg-accent hover:text-foreground",
      )}
    >
      <span className="truncate">{group.label}</span>
    </Link>
  );
}
