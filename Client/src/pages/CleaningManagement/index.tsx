import { useLocations } from "@/features/organization/hooks/useLocations";
import { useAreas } from "@/features/organization/hooks/useAreas";
import { CleaningBoard } from "@/features/cleaning/components/CleaningBoard";
import { useCleaningStates } from "@/features/cleaning/hooks/useCleaningStates";
import { useCleaningRooms } from "@/features/cleaning/hooks/useCleaningRooms";

/**
 * CleaningManagement Page
 *
 * Main cleaning management page featuring room grid, filtering, and status management.
 * Refactored to use custom hooks for data fetching and merging.
 */
export default function CleaningManagement() {
  // Fetch data using custom hooks
  const { locations, isLocationsLoading } = useLocations();
  const { areas, isAreasLoading } = useAreas();
  const { cleaningStates, isInitialLoading, fetchStates } = useCleaningStates();

  // Merge data into rooms
  const { rooms } = useCleaningRooms({
    locations,
    areas,
    cleaningStates,
  });

  const isLoading =
    isInitialLoading || isLocationsLoading || isAreasLoading;

  return (
    <div className="flex flex-col min-h-full p-6 space-y-6">
      <div className="flex-1">
        <CleaningBoard
          rooms={rooms}
          isLoading={isLoading}
          onRefresh={fetchStates}
        />
      </div>
    </div>
  );
}
