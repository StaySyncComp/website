import apiClient, { API_BASE_URL } from "@/lib/api-client";
import { getSelectedOrganization } from "@/lib/utils/hooks/UseOrganizationUtils";
import {
  InfoPagesListResponse,
  OrganizationInfoPageRecord,
  PublicInfoPageResponse,
  PuckPageData,
  SaveInfoPageDraftPayload,
} from "@/types/api/infoPage";

const basePath = "/organizations/info-page";

const orgId = () => getSelectedOrganization();

export const fetchInfoPages = async (): Promise<InfoPagesListResponse> => {
  const { data } = await apiClient.get<InfoPagesListResponse>(basePath, {
    params: { organizationId: orgId() },
  });
  return data;
};

export const fetchInfoPage = async (
  pageId: number
): Promise<OrganizationInfoPageRecord> => {
  const { data } = await apiClient.get<OrganizationInfoPageRecord>(
    `${basePath}/${pageId}`,
    { params: { organizationId: orgId() } }
  );
  return data;
};

export const createInfoPage = async (
  title?: string
): Promise<OrganizationInfoPageRecord> => {
  const { data } = await apiClient.post<OrganizationInfoPageRecord>(basePath, {
    organizationId: orgId(),
    title,
  });
  return data;
};

export const saveInfoPageDraft = async (
  pageId: number,
  draftContent: PuckPageData,
  title?: string
): Promise<OrganizationInfoPageRecord> => {
  const payload: SaveInfoPageDraftPayload = {
    organizationId: orgId(),
    draftContent,
    ...(title !== undefined ? { title } : {}),
  };
  const { data } = await apiClient.put<OrganizationInfoPageRecord>(
    `${basePath}/${pageId}`,
    payload
  );
  return data;
};

export const publishInfoPage = async (
  pageId: number,
  draftContent: PuckPageData
): Promise<OrganizationInfoPageRecord> => {
  const { data } = await apiClient.put<OrganizationInfoPageRecord>(
    `${basePath}/${pageId}/publish`,
    { organizationId: orgId(), draftContent }
  );
  return data;
};

export const unpublishInfoPage = async (
  pageId: number
): Promise<OrganizationInfoPageRecord> => {
  const { data } = await apiClient.put<OrganizationInfoPageRecord>(
    `${basePath}/${pageId}/unpublish`,
    { organizationId: orgId() }
  );
  return data;
};

export const deleteInfoPage = async (pageId: number): Promise<void> => {
  await apiClient.delete(`${basePath}/${pageId}`, {
    params: { organizationId: orgId() },
  });
};

export const fetchPublicInfoPage = async (
  organizationId: number,
  pageId?: number
): Promise<PublicInfoPageResponse> => {
  const url = new URL(`${API_BASE_URL}${basePath}/public`);
  url.searchParams.set("organizationId", String(organizationId));
  if (pageId) url.searchParams.set("pageId", String(pageId));

  const response = await fetch(url.toString());
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Failed to load page");
  }
  return response.json();
};

export const getInfoPagePublicUrl = (
  organizationId: number,
  pageId: number
): string => {
  const origin =
    import.meta.env.VITE_APP_URL?.replace(/\/$/, "") ||
    window.location.origin;
  return `${origin}/info/${organizationId}/${pageId}`;
};
