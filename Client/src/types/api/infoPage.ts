import type { Data } from "@measured/puck";
import { CustomStyles } from "./organization";

export type PuckPageData = Data;

export interface OrganizationInfoPageRecord {
  id: number;
  organizationId: number;
  draftContent: PuckPageData | null;
  publishedContent: PuckPageData | null;
  isPublished: boolean;
  publishedAt: string | null;
  updatedAt: string;
}

export interface PublicInfoPageResponse {
  organization: {
    id: number;
    name: string;
    logo: string;
    customStyles: CustomStyles;
  };
  publishedContent: PuckPageData;
  publishedAt: string | null;
}

export interface SaveInfoPageDraftPayload {
  organizationId: number;
  draftContent: PuckPageData;
}

export interface InfoPageOrgPayload {
  organizationId: number;
}
