import { useMemo } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { DashboardGrid } from "@/features/home-dashboard/DashboardGrid";
import { DashboardDataProvider } from "@/features/home-dashboard/DashboardDataContext";
import { HomeToolbar } from "@/features/home-dashboard/HomeToolbar";
import { useHomeDashboardData } from "@/features/home-dashboard/hooks/useHomeDashboardData";

export default function Home() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const dashboardData = useHomeDashboardData();

  const isRtl =
    i18n.dir() === "rtl" ||
    i18n.language?.toLowerCase().startsWith("he") ||
    i18n.language?.toLowerCase().startsWith("ar");
  const isRtlLayout =
    isRtl ||
    (typeof document !== "undefined" &&
      document.documentElement?.dir?.toLowerCase() === "rtl");

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 5) return t("home_dashboard.greeting_night");
    if (hour < 12) return t("home_dashboard.greeting_morning");
    if (hour < 18) return t("home_dashboard.greeting_afternoon");
    return t("home_dashboard.greeting_evening");
  }, [t]);

  const userName = user?.name?.trim() || "";

  return (
    <DashboardDataProvider value={dashboardData}>
      <div className="space-y-5" dir={isRtlLayout ? "rtl" : "ltr"}>
        <div className={cn("w-full", isRtl ? "text-right" : "text-left")}>
          <h1
            dir="auto"
            className={cn(
              "inline-block text-[26px] font-extrabold text-[#2D3A58]",
              isRtl ? "text-right" : "text-left",
            )}
          >
            {greeting}
            {userName ? (
              <>
                {", "}
                <bdi>{userName}</bdi>
              </>
            ) : null}
          </h1>
        </div>

        <HomeToolbar rangeLabel={dashboardData.rangeLabel} />
        <DashboardGrid isRtl={isRtlLayout} />
      </div>
    </DashboardDataProvider>
  );
}
