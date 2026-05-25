import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronRight, PanelLeft, PanelLeftClose } from "lucide-react";
import { useUi } from "@/store";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
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
  const settingsSidebarCollapsed = useUi((s) => s.settingsSidebarCollapsed);
  const toggleSettingsSidebar = useUi((s) => s.toggleSettingsSidebar);
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
        actions={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleSettingsSidebar}
            aria-label="Toggle settings sidebar"
          >
            {settingsSidebarCollapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        }
      />
      <div className="flex h-[calc(100vh-6rem)] min-h-0">
        <nav
          className={cn(
            "sticky top-0 self-start shrink-0 border-r border-border bg-muted/20 flex flex-col transition-[width] duration-200 overflow-hidden h-full",
            settingsSidebarCollapsed ? "w-14" : "w-46",
          )}
        >
          <div
            className={cn(
              "flex-1 min-h-0 overflow-y-auto scrollbar-thin pt-3",
              settingsSidebarCollapsed ? "px-1 pb-2" : "px-2 pb-5",
            )}
          >
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
                  collapsed={settingsSidebarCollapsed}
                />
              ))}
            </ul>
          </div>
          <div className="shrink-0 p-2 border-t border-border">
            <button
              type="button"
              onClick={toggleSettingsSidebar}
              className="w-full flex items-center justify-center h-8 rounded-md hover:bg-accent text-muted-foreground"
              aria-label="Toggle settings sidebar"
            >
              {settingsSidebarCollapsed ? (
                <PanelLeft className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          </div>
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
  collapsed,
}: SidebarGroupProps) {
  const isOnPath = activeGroupSlugs.has(group.slug);
  const open = expandedByParent[parentKey] === group.slug;

  const Icon = group.icon;
  const indent = depth === 0 ? "px-2.5" : depth === 1 ? "pl-6 pr-2.5" : "pl-9 pr-2.5";

  if (collapsed && depth > 0) return null;

  if (collapsed && depth === 0) {
    const first = firstSection(group);
    const to = first ? slugToSettingsPath(first.slug) : undefined;
    const iconClass = cn(
      "flex items-center justify-center h-8 w-full rounded-md transition-colors",
      isOnPath
        ? "bg-primary/10 text-primary"
        : "text-foreground/70 hover:bg-accent hover:text-foreground",
    );
    const icon = Icon ? (
      <Icon className="h-4 w-4 shrink-0" />
    ) : (
      <span className="text-xs font-semibold">{group.label.charAt(0)}</span>
    );
    return (
      <li>
        {to ? (
          <Link to={to} className={iconClass} title={group.label}>
            {icon}
          </Link>
        ) : (
          <button type="button" className={iconClass} title={group.label} disabled>
            {icon}
          </button>
        )}
      </li>
    );
  }

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
                collapsed={collapsed}
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
            {countSections(group)}
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
                collapsed={collapsed}
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
              collapsed={collapsed}
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
