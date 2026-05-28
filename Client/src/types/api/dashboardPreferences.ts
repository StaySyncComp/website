export type DashboardWidgetType =
  | "kpi_active"
  | "kpi_in_progress"
  | "kpi_completed"
  | "kpi_total"
  | "kpi_employees"
  | "chart_open_completed"
  | "top_employees";

export type QuickDatePreset = "7d" | "1m" | "3m" | "6m" | "9m" | "1y";

export interface DashboardConfig {
  version: number;
  filters: {
    preset: QuickDatePreset;
    departmentId: number | null;
  };
  kpiOrder: DashboardWidgetType[];
  mainOrder: DashboardWidgetType[];
  hidden: DashboardWidgetType[];
}

export interface DashboardPreferencesResponse {
  organizationId: number;
  config: DashboardConfig;
  updatedAt: string | null;
}
