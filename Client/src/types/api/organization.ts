export interface Organization {
  id: number;
  name: string;
  logo: string;
  OrganizationRole: OrganizationRole;
  customStyles?: CustomStyles;
  twilioWhatsAppNumber?: string | null;
  whatsappEnabled?: boolean;
}

export interface OrganizationRole {
  role: Role;
}
export interface Role {
  id: number;
  name: string;
}

export interface CustomStyles {
  foreground?: string;
  primary?: string;
  "muted-foreground"?: string;
  accent?: string;
  border?: string;
  surface?: string;
  background?: string;
}
export interface NewOrganizationPayload {
  name: string;
}
export interface UpdateOrganizationPayload {
  organizationId: number;
  name: string;
  logo?: string;
  customStyles?: CustomStyles;
  twilioWhatsAppNumber?: string | null;
  whatsappEnabled?: boolean;
}

export interface GetOrganizationPayload {
  id: number;
}
