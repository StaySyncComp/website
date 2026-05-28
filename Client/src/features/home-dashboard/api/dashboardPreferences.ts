import apiClient from "@/lib/api-client";
import { getSelectedOrganization } from "@/lib/utils/hooks/UseOrganizationUtils";
import type {
  DashboardConfig,
  DashboardPreferencesResponse,
} from "@/types/api/dashboardPreferences";

const basePath = "/dashboard-preferences";

const orgId = () => getSelectedOrganization();

export const fetchDashboardPreferences =
  async (): Promise<DashboardPreferencesResponse> => {
    const { data } = await apiClient.get<DashboardPreferencesResponse>(
      basePath,
      { params: { organizationId: orgId() } },
    );
    return data;
  };

export const saveDashboardPreferences = async (
  config: DashboardConfig,
): Promise<DashboardPreferencesResponse> => {
  const { data } = await apiClient.put<DashboardPreferencesResponse>(
    basePath,
    { organizationId: orgId(), config },
  );
  return data;
};
