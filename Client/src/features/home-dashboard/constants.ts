import type { DashboardConfig, DashboardWidgetType } from "@/types/api/dashboardPreferences";
import type { LucideIcon } from "lucide-react";
import { BarChart3, Phone, Star, Users } from "lucide-react";

/** Bar chart body height — keep in sync with BarChart.tsx */
export const CHART_BODY_HEIGHT_PX = 220;

/**
 * Fixed min height for main-row cards (chart + top employees).
 * title (~35) + padding (40) + chart area (~254)
 */
export const MAIN_WIDGET_CARD_MIN_HEIGHT_PX =
  35 + 40 + CHART_BODY_HEIGHT_PX + 8 + 12 + 18;

export const DEFAULT_DASHBOARD_CONFIG: DashboardConfig = {
  version: 1,
  filters: { preset: "7d", departmentId: null },
  kpiOrder: [
    "kpi_active",
    "kpi_in_progress",
    "kpi_completed",
    "kpi_total",
    "kpi_employees",
  ],
  mainOrder: ["chart_open_completed", "top_employees"],
  hidden: [],
};

export interface WidgetMeta {
  type: DashboardWidgetType;
  titleKey: string;
  zone: "kpi" | "main";
  icon: LucideIcon;
  /** Columns (of 10) on lg+ when both main widgets are visible */
  mainColSpan?: number;
}

export function widgetTitleKey(type: DashboardWidgetType): string {
  return `home_dashboard.widgets.${type}`;
}

/** Grid column span per main-zone widget (width follows type, not slot order) */
export const MAIN_WIDGET_COL_SPAN: Partial<
  Record<DashboardWidgetType, number>
> = {
  chart_open_completed: 7,
  top_employees: 3,
};

export function getMainWidgetColClass(
  type: DashboardWidgetType,
  visibleCount: number,
): string {
  if (visibleCount <= 1) return "lg:col-span-10";
  const span = MAIN_WIDGET_COL_SPAN[type];
  if (span === 7) return "lg:col-span-7";
  if (span === 3) return "lg:col-span-3";
  return "lg:col-span-10";
}

export const WIDGET_REGISTRY: WidgetMeta[] = [
  {
    type: "kpi_active",
    titleKey: widgetTitleKey("kpi_active"),
    zone: "kpi",
    icon: Phone,
  },
  {
    type: "kpi_in_progress",
    titleKey: widgetTitleKey("kpi_in_progress"),
    zone: "kpi",
    icon: Phone,
  },
  {
    type: "kpi_completed",
    titleKey: widgetTitleKey("kpi_completed"),
    zone: "kpi",
    icon: Phone,
  },
  {
    type: "kpi_total",
    titleKey: widgetTitleKey("kpi_total"),
    zone: "kpi",
    icon: Phone,
  },
  {
    type: "kpi_employees",
    titleKey: widgetTitleKey("kpi_employees"),
    zone: "kpi",
    icon: Users,
  },
  {
    type: "chart_open_completed",
    titleKey: widgetTitleKey("chart_open_completed"),
    zone: "main",
    icon: BarChart3,
    mainColSpan: 7,
  },
  {
    type: "top_employees",
    titleKey: widgetTitleKey("top_employees"),
    zone: "main",
    icon: Star,
    mainColSpan: 3,
  },
];

export const KPI_WIDGET_BANK = WIDGET_REGISTRY.filter((w) => w.zone === "kpi");
export const MAIN_WIDGET_BANK = WIDGET_REGISTRY.filter(
  (w) => w.zone === "main",
);

export const WIDGET_META_BY_TYPE = Object.fromEntries(
  WIDGET_REGISTRY.map((w) => [w.type, w]),
) as Record<DashboardWidgetType, WidgetMeta>;
