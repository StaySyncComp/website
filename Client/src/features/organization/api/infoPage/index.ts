import apiClient, { API_BASE_URL } from "@/lib/api-client";
import { getSelectedOrganization } from "@/lib/utils/hooks/UseOrganizationUtils";
import {
  OrganizationInfoPageRecord,
  PublicInfoPageResponse,
  PuckPageData,
  SaveInfoPageDraftPayload,
} from "@/types/api/infoPage";

const basePath = "/organizations/info-page";

export const fetchInfoPage = async (): Promise<OrganizationInfoPageRecord> => {
  const organizationId = getSelectedOrganization();
  const { data } = await apiClient.get<OrganizationInfoPageRecord>(basePath, {
    params: { organizationId },
  });
  return data;
};

export const saveInfoPageDraft = async (
  draftContent: PuckPageData
): Promise<OrganizationInfoPageRecord> => {
  const payload: SaveInfoPageDraftPayload = {
    organizationId: getSelectedOrganization(),
    draftContent,
  };
  const { data } = await apiClient.put<OrganizationInfoPageRecord>(
    basePath,
    payload
  );
  return data;
};

export const publishInfoPage = async (
  draftContent: PuckPageData
): Promise<OrganizationInfoPageRecord> => {
  const { data } = await apiClient.put<OrganizationInfoPageRecord>(
    `${basePath}/publish`,
    {
      organizationId: getSelectedOrganization(),
      draftContent,
    }
  );
  return data;
};

export const unpublishInfoPage =
  async (): Promise<OrganizationInfoPageRecord> => {
    const { data } = await apiClient.put<OrganizationInfoPageRecord>(
      `${basePath}/unpublish`,
      { organizationId: getSelectedOrganization() }
    );
    return data;
  };

export const fetchPublicInfoPage = async (
  organizationId: number
): Promise<PublicInfoPageResponse> => {
  const url = new URL(`${API_BASE_URL}${basePath}/public`);
  url.searchParams.set("organizationId", String(organizationId));

  const response = await fetch(url.toString());
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Failed to load page");
  }
  return response.json();
};

export const getInfoPagePublicUrl = (organizationId: number): string => {
  const origin =
    import.meta.env.VITE_APP_URL?.replace(/\/$/, "") ||
    window.location.origin;
  return `${origin}/info/${organizationId}`;
};
