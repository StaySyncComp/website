import { createContext, useContext } from "react";
import type { useHomeDashboardData } from "@/features/home-dashboard/hooks/useHomeDashboardData";

type DashboardData = ReturnType<typeof useHomeDashboardData>;

const DashboardDataContext = createContext<DashboardData | null>(null);

export function DashboardDataProvider({
  value,
  children,
}: {
  value: DashboardData;
  children: React.ReactNode;
}) {
  return (
    <DashboardDataContext.Provider value={value}>
      {children}
    </DashboardDataContext.Provider>
  );
}

export function useDashboardData() {
  const ctx = useContext(DashboardDataContext);
  if (!ctx) {
    throw new Error("useDashboardData must be used within DashboardDataProvider");
  }
  return ctx;
}
