export type RoomNoteColor = "blue" | "yellow" | "green";
export type RoomNoteType = "ai" | "staff";

export type NoteExpiryOption = "never" | "1d" | "1w" | "1m";

export interface RoomNote {
  id: number;
  locationId: number;
  organizationId: number;
  content: string;
  type: RoomNoteType;
  color: RoomNoteColor;
  createdById?: number | null;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: { id: number; name: string } | null;
}

export interface RoomStay {
  id: number;
  locationId: number;
  organizationId: number;
  guestName: string;
  guestPhone?: string | null;
  guestEmail?: string | null;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  preferences: string[];
  status: "active" | "checked_out" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface RoomCleaningHistoryEntry {
  id: number;
  action: string;
  createdAt: string;
  performedById?: number | null;
  performedBy?: { id: number; name: string; logo?: string | null } | null;
}

export interface RoomCleaningData {
  id: number;
  locationId: number;
  status: string;
  priority: string;
  assignedToId?: number | null;
  lastCleanedAt?: string | null;
  updatedAt: string;
  assignedTo?: { id: number; name: string; logo?: string | null } | null;
  history: RoomCleaningHistoryEntry[];
  historyCount: number;
}

export interface RoomModalStats {
  openCalls: number;
  closedCalls: number;
  cleaningHistoryCount: number;
  notesCount: number;
  unreadMessages: number;
}

export interface RoomModalData {
  notes: RoomNote[];
  stay: RoomStay | null;
  stayCount: number;
  previousStays: RoomStay[];
  cleaning: RoomCleaningData | null;
  stats: RoomModalStats;
}

export interface CreateRoomNoteInput {
  content: string;
  color?: RoomNoteColor;
  expiresInDays?: number | null;
}

export interface UpdateRoomNoteInput {
  content?: string;
  color?: RoomNoteColor;
  expiresInDays?: number | null;
  clearExpiry?: boolean;
}

export interface CreateRoomNotePayload extends CreateRoomNoteInput {
  organizationId: number;
}

export interface UpdateRoomNotePayload extends UpdateRoomNoteInput {
  organizationId: number;
}

export interface CheckInGuestPayload {
  organizationId: number;
  guestName: string;
  guestPhone?: string;
  guestEmail?: string;
  checkIn: string;
  checkOut: string;
  adults?: number;
  children?: number;
  preferences?: string[];
}

export interface UpdateStayPayload {
  organizationId: number;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  preferences?: string[];
}

export const expiryOptionToDays = (
  option: NoteExpiryOption,
): number | null => {
  switch (option) {
    case "1d":
      return 1;
    case "1w":
      return 7;
    case "1m":
      return 30;
    default:
      return null;
  }
};
