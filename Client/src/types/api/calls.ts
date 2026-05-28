import { Name } from "./api.types";
import { Department } from "./departments";
import { Location } from "./locations";
import { User } from "./user";
import { BaseEntity } from "./common";

export interface CallCategory extends BaseEntity {
  logo: string;
  departmentId: number;
  organizationId: number;
  expectedTime?: number;
}

export interface NewCallCategoryPayload {
  name: Name;
  logo: string;
  departmentId: number;
  organizationId: number;
}

export type CallStatus =
  | "OPENED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED"
  | "ON_HOLD";

export interface Call {
  id: string;
  description: string;
  locationId: number;
  departmentId: number;
  createdById: number;
  createdBy: User;
  createdAt: Date;
  assignedToId: number;
  assignedTo: User | null;
  closedById: number | null;
  closedBy?: User | null;
  status: CallStatus;
  callCategoryId: number;
  Department: Department;
  callCategory: CallCategory;
  location: Location;
  CallStatusHistory: CallStatusHistory[];
  /** Set when this call was spawned from a recurring schedule */
  recurringCallId?: number | null;
}

export interface RecurringCall extends BaseEntity {
  description: string;
  status: string;
  assignedToId?: string;
  callCategoryId: number;
  locationId: number;
  departmentId: number;
  organizationId: number;
  frequency: string;
  startDate: string;
  endDate?: string;
}

// enum of daily weekly monthly
export enum Frequency {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
}

export interface CallStatusHistory {
  id: number;
  callId: string;
  fromStatus: CallStatus | null;
  toStatus: CallStatus;
  changedAt: Date;
  changedById: number;
  changedBy?: User;
  assignedToId?: number | null;
  assignedTo?: User | null;
}

export interface CallMessageAttachment {
  id?: string;
  fileUrl: string;
  fileType: string;
  fileName: string;
}
