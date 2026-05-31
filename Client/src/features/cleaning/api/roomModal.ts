import apiClient from "@/lib/api-client";
import {
  CheckInGuestPayload,
  CreateRoomNotePayload,
  RoomModalData,
  RoomNote,
  RoomStay,
  UpdateRoomNotePayload,
  UpdateStayPayload,
} from "@/features/cleaning/types/roomModal";

export const fetchRoomModalData = async (
  locationId: number,
  organizationId: number,
): Promise<RoomModalData> => {
  const { data } = await apiClient.get<RoomModalData>(
    `/locations/${locationId}/modal`,
    { params: { organizationId } },
  );
  return data;
};

export const createRoomNote = async (
  locationId: number,
  payload: CreateRoomNotePayload,
): Promise<RoomNote> => {
  const { data } = await apiClient.post<RoomNote>(
    `/locations/${locationId}/notes`,
    payload,
  );
  return data;
};

export const updateRoomNote = async (
  locationId: number,
  noteId: number,
  payload: UpdateRoomNotePayload,
): Promise<RoomNote> => {
  const { data } = await apiClient.patch<RoomNote>(
    `/locations/${locationId}/notes/${noteId}`,
    payload,
  );
  return data;
};

export const deleteRoomNote = async (
  locationId: number,
  noteId: number,
  organizationId: number,
): Promise<void> => {
  await apiClient.delete(`/locations/${locationId}/notes/${noteId}`, {
    params: { organizationId },
  });
};

export const checkInGuest = async (
  locationId: number,
  payload: CheckInGuestPayload,
): Promise<RoomStay> => {
  const { data } = await apiClient.post<RoomStay>(
    `/locations/${locationId}/stay`,
    payload,
  );
  return data;
};

export const updateActiveStay = async (
  locationId: number,
  payload: UpdateStayPayload,
): Promise<RoomStay> => {
  const { data } = await apiClient.patch<RoomStay>(
    `/locations/${locationId}/stay`,
    payload,
  );
  return data;
};

export const checkOutGuest = async (
  locationId: number,
  organizationId: number,
): Promise<RoomStay> => {
  const { data } = await apiClient.post<RoomStay>(
    `/locations/${locationId}/stay/checkout`,
    { organizationId },
  );
  return data;
};
