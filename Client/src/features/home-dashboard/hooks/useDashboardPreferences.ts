import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchDashboardPreferences,
  saveDashboardPreferences,
} from "@/features/home-dashboard/api/dashboardPreferences";
import { normalizeDashboardConfig } from "@/features/home-dashboard/normalizeConfig";
import type { DashboardConfig } from "@/types/api/dashboardPreferences";
import { getSelectedOrganization } from "@/lib/utils/hooks/UseOrganizationUtils";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function useDashboardPreferencesQuery() {
  const organizationId = getSelectedOrganization();

  return useQuery({
    queryKey: ["dashboard-preferences", organizationId],
    queryFn: fetchDashboardPreferences,
    enabled: !!organizationId,
    select: (data) => normalizeDashboardConfig(data.config),
  });
}

export function useSaveDashboardPreferences() {
  const queryClient = useQueryClient();
  const organizationId = getSelectedOrganization();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (config: DashboardConfig) => saveDashboardPreferences(config),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["dashboard-preferences", organizationId],
      });
      toast.success(t("home_dashboard.layout_saved"));
    },
    onError: () => {
      toast.error(t("home_dashboard.layout_save_error"));
    },
  });
}
