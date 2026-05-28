import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useTranslation } from "react-i18next";
import { useDashboardEditOptional } from "@/features/home-dashboard/DashboardEditContext";
import {
  KPI_WIDGET_BANK,
  MAIN_WIDGET_BANK,
  WIDGET_META_BY_TYPE,
} from "@/features/home-dashboard/constants";
import type { DashboardWidgetType } from "@/types/api/dashboardPreferences";
import { cn } from "@/lib/utils";

interface WidgetTemplateSidebarProps {
  side: "left" | "right";
}

function WidgetBankCard({
  type,
  isOnDashboard,
  onAdd,
  onRemove,
}: {
  type: DashboardWidgetType;
  isOnDashboard: boolean;
  onAdd: () => void;
  onRemove: () => void;
}) {
  const { t } = useTranslation();
  const meta = WIDGET_META_BY_TYPE[type];
  const Icon = meta.icon;

  return (
    <button
      type="button"
      onClick={() => (isOnDashboard ? onRemove() : onAdd())}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-right transition-colors",
        isOnDashboard
          ? "border-[#E7ECF6] bg-[#F7F9FE] hover:bg-[#FFF5F5]"
          : "border-[#C9D4F6] bg-white hover:bg-[#F4F7FD]",
      )}
    >
      <Icon
        className={cn(
          "size-4 shrink-0",
          isOnDashboard ? "text-[#9AA6C5]" : "text-[#2F80ED]",
        )}
      />
      <span className="flex-1 text-[13px] font-medium text-[#2D3A58]">
        {t(meta.titleKey)}
      </span>
      {isOnDashboard ? (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#E74C3C]">
          {t("home_dashboard.remove")}
        </span>
      ) : (
        <span className="text-[11px] font-medium text-[#2F80ED]">
          + {t("home_dashboard.add")}
        </span>
      )}
    </button>
  );
}

export function WidgetTemplateSidebar({ side }: WidgetTemplateSidebarProps) {
  const { t } = useTranslation();
  const edit = useDashboardEditOptional();
  const config = edit?.config;
  const addWidget = edit?.addWidget;
  const removeWidget = edit?.removeWidget;

  const onDashboard = new Set<DashboardWidgetType>([
    ...(config?.kpiOrder ?? []),
    ...(config?.mainOrder ?? []),
  ]);

  const hiddenCount = edit?.hiddenWidgets.length ?? 0;

  return (
    <Sidebar side={side} className="border-[#E7ECF6]">
      <SidebarHeader className="border-b border-[#E7ECF6] px-4 py-4">
        <h2 className="text-right text-[15px] font-bold text-[#2D3A58]">
          {t("home_dashboard.template_sidebar_title")}
        </h2>
        <p className="mt-1 text-right text-[12px] text-[#8B95AD]">
          {t("home_dashboard.template_sidebar_subtitle")}
        </p>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {hiddenCount > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-right text-[#5D6884]">
              {t("home_dashboard.removed_from_dashboard", {
                count: hiddenCount,
              })}
            </SidebarGroupLabel>
            <SidebarGroupContent className="space-y-2 px-2 pb-2">
              {(edit?.hiddenWidgets ?? []).map((type) => (
                <WidgetBankCard
                  key={`hidden-${type}`}
                  type={type}
                  isOnDashboard={false}
                  onAdd={() => addWidget?.(type)}
                  onRemove={() => removeWidget?.(type)}
                />
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-right text-[#5D6884]">
            {t("home_dashboard.kpi_section")}
          </SidebarGroupLabel>
          <SidebarGroupContent className="space-y-2 px-2 pb-3">
            {KPI_WIDGET_BANK.filter(
              (w) => !edit?.hiddenWidgets.includes(w.type),
            ).map((widget) => (
              <WidgetBankCard
                key={widget.type}
                type={widget.type}
                isOnDashboard={onDashboard.has(widget.type)}
                onAdd={() => addWidget?.(widget.type)}
                onRemove={() => removeWidget?.(widget.type)}
              />
            ))}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-right text-[#5D6884]">
            {t("home_dashboard.main_section")}
          </SidebarGroupLabel>
          <SidebarGroupContent className="space-y-2 px-2 pb-4">
            {MAIN_WIDGET_BANK.filter(
              (w) => !edit?.hiddenWidgets.includes(w.type),
            ).map((widget) => (
              <WidgetBankCard
                key={widget.type}
                type={widget.type}
                isOnDashboard={onDashboard.has(widget.type)}
                onAdd={() => addWidget?.(widget.type)}
                onRemove={() => removeWidget?.(widget.type)}
              />
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
