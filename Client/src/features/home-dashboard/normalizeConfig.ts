import {
  DEFAULT_DASHBOARD_CONFIG,
  WIDGET_REGISTRY,
} from "@/features/home-dashboard/constants";
import type {
  DashboardConfig,
  DashboardWidgetType,
  QuickDatePreset,
} from "@/types/api/dashboardPreferences";

const ALL_TYPES = WIDGET_REGISTRY.map((w) => w.type);

function isWidgetType(value: string): value is DashboardWidgetType {
  return ALL_TYPES.includes(value as DashboardWidgetType);
}

function normalizeOrder(
  value: unknown,
  zone: "kpi" | "main",
): DashboardWidgetType[] {
  const allowed = WIDGET_REGISTRY.filter((w) => w.zone === zone).map(
    (w) => w.type,
  );
  const seen = new Set<string>();
  const next: DashboardWidgetType[] = [];

  if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item !== "string" || !isWidgetType(item)) continue;
      if (!allowed.includes(item) || seen.has(item)) continue;
      seen.add(item);
      next.push(item);
    }
  }

  for (const item of allowed) {
    if (!seen.has(item)) next.push(item);
  }

  return next;
}

export function normalizeDashboardConfig(raw: unknown): DashboardConfig {
  const base: DashboardConfig = JSON.parse(
    JSON.stringify(DEFAULT_DASHBOARD_CONFIG),
  );

  if (!raw || typeof raw !== "object") return base;

  const obj = raw as Record<string, unknown>;

  if (obj.filters && typeof obj.filters === "object") {
    const filters = obj.filters as Record<string, unknown>;
    const preset = filters.preset as QuickDatePreset;
    if (["7d", "1m", "3m", "6m", "9m", "1y"].includes(preset)) {
      base.filters.preset = preset;
    }
    if (filters.departmentId === null) {
      base.filters.departmentId = null;
    } else if (
      typeof filters.departmentId === "number" &&
      Number.isFinite(filters.departmentId)
    ) {
      base.filters.departmentId = filters.departmentId;
    }
  }

  base.kpiOrder = normalizeOrder(obj.kpiOrder, "kpi");
  base.mainOrder = normalizeOrder(obj.mainOrder, "main");

  if (Array.isArray(obj.hidden)) {
    base.hidden = obj.hidden.filter(
      (item): item is DashboardWidgetType =>
        typeof item === "string" && isWidgetType(item),
    );
  }

  const hiddenSet = new Set(base.hidden);
  base.kpiOrder = base.kpiOrder.filter((id) => !hiddenSet.has(id));
  base.mainOrder = base.mainOrder.filter((id) => !hiddenSet.has(id));

  return base;
}
