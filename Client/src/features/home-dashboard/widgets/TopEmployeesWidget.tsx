import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { DemoWatermark } from "@/features/home-dashboard/components/DemoWatermark";
import { MainWidgetCard } from "@/features/home-dashboard/components/MainWidgetCard";
import { useDashboardData } from "@/features/home-dashboard/DashboardDataContext";
import { widgetTitleKey } from "@/features/home-dashboard/constants";

export function TopEmployeesWidget() {
  const { t } = useTranslation();
  const { topEmployees, demoEmployees, hasEmployeeData } = useDashboardData();
  const rows = hasEmployeeData ? topEmployees : demoEmployees;

  return (
    <MainWidgetCard
      title={t(widgetTitleKey("top_employees"))}
      bodyClassName="relative overflow-hidden"
    >
      <div className="h-full min-h-0 overflow-y-auto overscroll-contain pr-0.5">
        <div className="space-y-4">
          {rows.map((employee, idx) => (
            <div
              key={`${employee.id}-${idx}`}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border border-[#E7ECF6]">
                  <AvatarImage src={employee.logo} />
                  <AvatarFallback className="bg-[#EAF2FF] text-[12px] text-[#2F80ED]">
                    {employee.name.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[14px] text-[#5D6884]">
                  {employee.name}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[13px] font-semibold text-[#2D3A58]">
                <span>{employee.score}</span>
                <Star
                  className={cn(
                    "size-[14px]",
                    idx === 0
                      ? "fill-[#F6B021] text-[#F6B021]"
                      : "fill-[#C9D1E2] text-[#C9D1E2]",
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {!hasEmployeeData && <DemoWatermark />}
    </MainWidgetCard>
  );
}
