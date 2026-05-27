import type { Data } from "@measured/puck";
import { CustomStyles } from "./organization";

export type PuckPageData = Data;

export const MAX_INFO_PAGES = 5;

export interface OrganizationInfoPageRecord {
  id: number;
  organizationId: number;
  title: string;
  sortOrder: number;
  draftContent: PuckPageData | null;
  publishedContent: PuckPageData | null;
  isPublished: boolean;
  publishedAt: string | null;
  updatedAt: string;
}

export interface InfoPagesListResponse {
  pages: OrganizationInfoPageRecord[];
  maxPages: number;
}

export interface PublicInfoPageResponse {
  organization: {
    id: number;
    name: string;
    logo: string;
    customStyles: CustomStyles;
  };
  page: {
    id: number;
    title: string;
  };
  publishedContent: PuckPageData;
  publishedAt: string | null;
}

export interface SaveInfoPageDraftPayload {
  organizationId: number;
  draftContent: PuckPageData;
  title?: string;
}

export interface PublishInfoPagePayload {
  organizationId: number;
  draftContent: PuckPageData;
}
