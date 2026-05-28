import { KpiCard } from "@/features/home-dashboard/components/KpiCard";
import { useDashboardData } from "@/features/home-dashboard/DashboardDataContext";
import type { DashboardWidgetType } from "@/types/api/dashboardPreferences";

interface KpiWidgetProps {
  type: DashboardWidgetType;
  isRtl: boolean;
}

export function KpiWidget({ type, isRtl }: KpiWidgetProps) {
  const { kpiMetricsByType } = useDashboardData();
  const metric = kpiMetricsByType[type];
  if (!metric) return null;
  return <KpiCard {...metric} isRtl={isRtl} />;
}
