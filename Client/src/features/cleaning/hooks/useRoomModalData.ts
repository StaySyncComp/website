import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { OrganizationsContext } from "@/features/organization/context/organization-context";
import { getSelectedOrganization } from "@/lib/utils/hooks/UseOrganizationUtils";
import {
  checkInGuest,
  checkOutGuest,
  createRoomNote,
  deleteRoomNote,
  fetchRoomModalData,
  updateActiveStay,
  updateRoomNote,
} from "@/features/cleaning/api/roomModal";
import {
  CheckInGuestPayload,
  CreateRoomNoteInput,
  RoomModalData,
  UpdateRoomNoteInput,
  UpdateStayPayload,
} from "@/features/cleaning/types/roomModal";

export const useRoomModalData = (
  locationId: number | undefined,
  isOpen: boolean,
) => {
  const { organization } = useContext(OrganizationsContext);
  const storedOrgId = getSelectedOrganization();
  const organizationId =
    organization?.id ??
    (storedOrgId > 0 ? storedOrgId : undefined);

  const [data, setData] = useState<RoomModalData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    if (!locationId || !organizationId || !isOpen) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchRoomModalData(locationId, organizationId);
      setData(result);
    } catch (err) {
      console.error("Failed to load room modal data", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [locationId, organizationId, isOpen]);

  useEffect(() => {
    load();
  }, [load]);

  const addNote = async (input: CreateRoomNoteInput) => {
    if (!locationId || !organizationId) {
      toast.error("Organization not selected");
      throw new Error("Organization not selected");
    }
    const note = await createRoomNote(locationId, {
      ...input,
      organizationId,
    });
    setData((prev) =>
      prev
        ? {
            ...prev,
            notes: [note, ...prev.notes],
            stats: { ...prev.stats, notesCount: prev.stats.notesCount + 1 },
          }
        : prev,
    );
    return note;
  };

  const editNote = async (noteId: number, input: UpdateRoomNoteInput) => {
    if (!locationId || !organizationId) {
      toast.error("Organization not selected");
      throw new Error("Organization not selected");
    }
    const note = await updateRoomNote(locationId, noteId, {
      ...input,
      organizationId,
    });
    setData((prev) =>
      prev
        ? {
            ...prev,
            notes: prev.notes.map((n) => (n.id === noteId ? note : n)),
          }
        : prev,
    );
    return note;
  };

  const removeNote = async (noteId: number) => {
    if (!locationId || !organizationId) {
      toast.error("Organization not selected");
      throw new Error("Organization not selected");
    }
    await deleteRoomNote(locationId, noteId, organizationId);
    setData((prev) =>
      prev
        ? {
            ...prev,
            notes: prev.notes.filter((n) => n.id !== noteId),
            stats: {
              ...prev.stats,
              notesCount: Math.max(0, prev.stats.notesCount - 1),
            },
          }
        : prev,
    );
  };

  const checkIn = async (payload: Omit<CheckInGuestPayload, "organizationId">) => {
    if (!locationId || !organizationId) return;
    const stay = await checkInGuest(locationId, {
      ...payload,
      organizationId,
    });
    await load();
    return stay;
  };

  const updateStay = async (payload: Omit<UpdateStayPayload, "organizationId">) => {
    if (!locationId || !organizationId) return;
    const stay = await updateActiveStay(locationId, {
      ...payload,
      organizationId,
    });
    setData((prev) => (prev ? { ...prev, stay } : prev));
    return stay;
  };

  const checkOut = async () => {
    if (!locationId || !organizationId) return;
    await checkOutGuest(locationId, organizationId);
    await load();
  };

  return {
    data,
    isLoading,
    error,
    refresh: load,
    addNote,
    editNote,
    removeNote,
    checkIn,
    updateStay,
    checkOut,
    organizationId,
  };
};
