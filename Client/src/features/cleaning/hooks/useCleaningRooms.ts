import { useMemo } from "react";
import { CleaningRoom, CleaningTask } from "@/features/cleaning/types";

interface UseCleaningRoomsProps {
  locations: any[] | null;
  areas: any[] | null;
  cleaningStates: CleaningTask[];
}

/**
 * Merges locations, areas, and cleaning states into rooms for the map grid.
 * Cleaning status always comes from room_states (via GET /cleaning).
 */
export const useCleaningRooms = ({
  locations,
  areas,
  cleaningStates,
}: UseCleaningRoomsProps): { rooms: CleaningRoom[] } => {
  const rooms = useMemo(() => {
    if (!locations || !Array.isArray(locations)) {
      return [];
    }

    return locations.map((location: any) => {
      const state = cleaningStates.find((s) => s.locationId === location.id);

      const cleaningStatus: CleaningTask = state ?? {
        id: 0,
        locationId: location.id,
        status: "vacant_dirty",
        priority: "normal",
        history: [],
      };

      const area = Array.isArray(areas)
        ? areas.find((a: any) => a.id === location.areaId)
        : null;

      return {
        ...location,
        area,
        cleaningStatus,
      };
    });
  }, [locations, areas, cleaningStates]);

  return { rooms };
};
