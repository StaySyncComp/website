import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CleaningDetailsDrawer } from "@/features/cleaning/components/CleaningDetailsDrawer";
import { CleaningFiltersBar } from "@/features/cleaning/components/CleaningFiltersBar";
import { RoomGridGroup } from "@/features/cleaning/components/RoomGridGroup";
import { CleaningLegend } from "@/features/cleaning/components/CleaningLegend";
import { CleaningRoom, CleaningStatus } from "@/features/cleaning/types";
import { useUser } from "@/features/auth/hooks/useUser";
import { useRoomFilters } from "@/features/cleaning/hooks/useRoomFilters";
import { useRoomGrouping } from "@/features/cleaning/hooks/useRoomGrouping";
import { patchLocationCleaning } from "@/features/cleaning/api";
import { CleaningBoardSkeleton } from "@/features/cleaning/components/CleaningBoardSkeleton";

interface CleaningBoardProps {
  rooms: CleaningRoom[];
  isLoading: boolean;
  onRefresh: () => void;
}

/**
 * CleaningBoard Component
 *
 * Main cleaning management interface with room grid, filtering, and details drawer.
 * Refactored to use custom hooks and sub-components for better modularity.
 */
export const CleaningBoard = ({
  rooms,
  isLoading,
  onRefresh,
}: CleaningBoardProps) => {
  const { t, i18n } = useTranslation();
  const { allUsers } = useUser();

  // State management
  const [selectedRoom, setSelectedRoom] = useState<CleaningRoom | null>(null);

  // Use custom hooks for filtering and grouping
  const {
    filteredRooms,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    areaFilter,
    setAreaFilter,
  } = useRoomFilters(rooms);

  const { groupedRooms } = useRoomGrouping(
    filteredRooms,
    i18n.language,
    t("unknown_area"),
  );

  useEffect(() => {
    if (!selectedRoom) return;
    const fresh = rooms.find((r) => r.id === selectedRoom.id);
    if (fresh) setSelectedRoom(fresh);
  }, [rooms, selectedRoom?.id]);

  // Event handlers - memoized for performance
  const handleRoomClick = useCallback((room: CleaningRoom) => {
    setSelectedRoom(room);
  }, []);

  const handleStatusChange = useCallback(
    async (roomId: number, status: CleaningStatus) => {
      try {
        const updated = await patchLocationCleaning(roomId, { status });
        setSelectedRoom((prev) =>
          prev ? { ...prev, cleaningStatus: updated } : null,
        );
        onRefresh();
      } catch (error) {
        console.error("Failed to update cleaning status", error);
        throw error;
      }
    },
    [onRefresh],
  );

  const handleAssignUser = useCallback(
    async (roomId: number, userId: number) => {
      try {
        const updated = await patchLocationCleaning(roomId, {
          assignedToId: userId,
        });
        setSelectedRoom((prev) =>
          prev ? { ...prev, cleaningStatus: updated } : null,
        );
        onRefresh();
      } catch (error) {
        console.error("Failed to assign cleaner", error);
        throw error;
      }
    },
    [onRefresh],
  );

  if (isLoading) {
    return (
      <>
        <CleaningBoardSkeleton />
        <CleaningDetailsDrawer
          isOpen={!!selectedRoom}
          onClose={() => setSelectedRoom(null)}
          room={selectedRoom}
          users={allUsers}
          onStatusChange={handleStatusChange}
          onAssignUser={handleAssignUser}
          onRefresh={onRefresh}
        />
      </>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4 overflow-hidden">
      {/* Filters Bar */}
      <CleaningFiltersBar
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        areaFilter={areaFilter}
        setAreaFilter={setAreaFilter}
        rooms={rooms}
      />

      {/* Grouped Grid Map */}
      <div className="flex-1 space-y-[3px] pb-24 pr-1">
        {groupedRooms.length > 0 ? (
          groupedRooms.map((group) => (
            <RoomGridGroup
              key={group.areaId}
              areaName={group.areaName}
              rooms={group.rooms}
              onRoomClick={handleRoomClick}
            />
          ))
        ) : (
          <div className="py-20 text-center text-muted-foreground">
            <p>{t("no_rooms_found")}</p>
          </div>
        )}
      </div>

      {/* Legend - Fixed to bottom */}
      <CleaningLegend />

      {/* Room Details Drawer */}
      <CleaningDetailsDrawer
        isOpen={!!selectedRoom}
        onClose={() => setSelectedRoom(null)}
        room={selectedRoom}
        users={allUsers}
        onStatusChange={handleStatusChange}
        onAssignUser={handleAssignUser}
        onRefresh={onRefresh}
      />
    </div>
  );
};
