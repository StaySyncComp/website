import { useTranslation } from "react-i18next";
import { BarChart } from "@/features/home-dashboard/components/BarChart";
import { DemoWatermark } from "@/features/home-dashboard/components/DemoWatermark";
import { MainWidgetCard } from "@/features/home-dashboard/components/MainWidgetCard";
import { useDashboardData } from "@/features/home-dashboard/DashboardDataContext";
import { widgetTitleKey } from "@/features/home-dashboard/constants";

export function ChartWidget() {
  const { t } = useTranslation();
  const { chartData, hasChartData } = useDashboardData();

  return (
    <MainWidgetCard title={t(widgetTitleKey("chart_open_completed"))}>
      <BarChart data={chartData} hasRealData={hasChartData} />
      {!hasChartData && <DemoWatermark />}
    </MainWidgetCard>
  );
}
