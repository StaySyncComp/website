import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { NestedOverlayContainerContext } from "@/contexts/nestedOverlayContext";
import { CleaningRoom, CleaningStatus, CleaningTask } from "../types";
import { mapServerCleaningToTask } from "../api";
import { User } from "@/types/api/user";
import { RoomModalHeader } from "./drawer/RoomModalHeader";
import { RoomNotesColumn } from "./drawer/RoomNotesColumn";
import { RoomRequestsColumn } from "./drawer/RoomRequestsColumn";
import { RoomCleaningColumn } from "./drawer/RoomCleaningColumn";
import { RoomGuestInfoColumn } from "./drawer/RoomGuestInfoColumn";
import { RoomChatPanel } from "./drawer/RoomChatPanel";
import { RoomCreateCallDialog } from "./drawer/RoomCreateCallDialog";
import { RoomCallDetailsDialog } from "./drawer/RoomCallDetailsDialog";
import { useRoomModalData } from "../hooks/useRoomModalData";
import { cn } from "@/lib/utils";
import { Call } from "@/types/api/calls";

interface CleaningDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  room: CleaningRoom | null;
  users: User[];
  onStatusChange: (roomId: number, status: CleaningStatus) => void;
  onAssignUser: (roomId: number, userId: number) => void;
  onRefresh: () => void;
}

export const CleaningDetailsDrawer = ({
  isOpen,
  onClose,
  room,
  users,
  onStatusChange,
  onAssignUser,
  onRefresh,
}: CleaningDetailsDrawerProps) => {
  const { i18n } = useTranslation();
  const [showChat, setShowChat] = useState(false);
  const [createCallOpen, setCreateCallOpen] = useState(false);
  const [callsRefreshKey, setCallsRefreshKey] = useState(0);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [callDetailsOpen, setCallDetailsOpen] = useState(false);
  const [overlayContainer, setOverlayContainer] = useState<HTMLElement | null>(
    null,
  );
  const isRtl = i18n.language === "he" || i18n.language === "ar";

  const overlayRef = useCallback((node: HTMLDivElement | null) => {
    setOverlayContainer(node);
  }, []);

  const isNestedOverlayTarget = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return false;
    return !!(
      target.closest("[data-radix-popover-content]") ||
      target.closest("[data-radix-select-content]") ||
      target.closest("[data-radix-select-viewport]") ||
      target.closest("[data-radix-popper-content-wrapper]")
    );
  };

  const {
    data: modalData,
    isLoading,
    refresh,
    addNote,
    editNote,
    removeNote,
    checkIn,
    checkOut,
  } = useRoomModalData(room?.id, isOpen);

  useEffect(() => {
    if (!isOpen) {
      setShowChat(false);
      setCreateCallOpen(false);
      setCallDetailsOpen(false);
      setSelectedCall(null);
    }
  }, [isOpen]);

  if (!room || !room.cleaningStatus) return null;

  const modalCleaning: CleaningTask | undefined = modalData?.cleaning
    ? mapServerCleaningToTask(modalData.cleaning)
    : undefined;

  const handleClose = () => {
    setShowChat(false);
    onClose();
  };

  const handleStatusChange = async (roomId: number, status: CleaningStatus) => {
    await onStatusChange(roomId, status);
    refresh();
  };

  const handleAssignUser = async (roomId: number, userId: number) => {
    await onAssignUser(roomId, userId);
    refresh();
  };

  const handleCheckIn = async (
    payload: Parameters<typeof checkIn>[0],
  ) => {
    await checkIn(payload);
    onRefresh();
  };

  const handleCheckOut = async () => {
    await checkOut();
    onRefresh();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        dir={isRtl ? "rtl" : "ltr"}
        className={cn(
          "max-w-[95vw] w-[1440px] h-[88vh] p-0 gap-0 overflow-hidden",
          "bg-white rounded-[20px] flex flex-col border border-[#E8ECF1] shadow-2xl [&>button]:hidden",
        )}
        onPointerDownOutside={(event) => {
          if (
            createCallOpen ||
            callDetailsOpen ||
            isNestedOverlayTarget(event.target)
          ) {
            event.preventDefault();
          }
        }}
        onInteractOutside={(event) => {
          if (
            createCallOpen ||
            callDetailsOpen ||
            isNestedOverlayTarget(event.target)
          ) {
            event.preventDefault();
          }
        }}
        onFocusOutside={(event) => {
          if (
            createCallOpen ||
            callDetailsOpen ||
            isNestedOverlayTarget(event.target)
          ) {
            event.preventDefault();
          }
        }}
      >
        <NestedOverlayContainerContext.Provider value={overlayContainer}>
        <div
          ref={overlayRef}
          className="relative flex flex-col flex-1 min-h-0 overflow-hidden pointer-events-auto"
        >
          <RoomModalHeader
            room={room}
            onClose={handleClose}
            mode={showChat ? "chat" : "room"}
            onChatClick={() => setShowChat(true)}
            onRoomDetailsClick={() => setShowChat(false)}
            hasUnreadMessages={(modalData?.stats.unreadMessages ?? 0) > 0}
          />

          {showChat ? (
            <RoomChatPanel
              room={room}
              stay={modalData?.stay ?? null}
              stayCount={modalData?.stayCount ?? 0}
              previousStays={modalData?.previousStays ?? []}
              isLoading={isLoading}
            />
          ) : (
            <div className="flex-1 grid grid-cols-4 overflow-hidden min-h-0 bg-white">
              <RoomGuestInfoColumn
                room={room}
                stay={modalData?.stay ?? null}
                stayCount={modalData?.stayCount ?? 0}
                stats={modalData?.stats ?? null}
                isLoading={isLoading}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
              />
              <RoomCleaningColumn
                room={room}
                users={users}
                cleaning={modalCleaning ?? room.cleaningStatus}
                onStatusChange={handleStatusChange}
                onAssignUser={handleAssignUser}
              />
            <RoomRequestsColumn
              room={room}
              isOpen={isOpen}
              refreshKey={callsRefreshKey}
              onOpenCreateCall={() => setCreateCallOpen(true)}
              onSelectCall={(call) => {
                setSelectedCall(call);
                setCallDetailsOpen(true);
              }}
            />
              <RoomNotesColumn
                showDivider={false}
                notes={modalData?.notes ?? []}
                isLoading={isLoading}
                onCreateNote={addNote}
                onUpdateNote={editNote}
                onDeleteNote={removeNote}
              />
            </div>
          )}

        <RoomCreateCallDialog
          open={createCallOpen}
          onOpenChange={setCreateCallOpen}
          room={room}
          onSuccess={() => {
            setCallsRefreshKey((key) => key + 1);
            refresh();
            onRefresh();
          }}
        />

        <RoomCallDetailsDialog
          call={selectedCall}
          open={callDetailsOpen}
          onOpenChange={(open) => {
            setCallDetailsOpen(open);
            if (!open) setSelectedCall(null);
          }}
          users={users}
        />
        </div>
        </NestedOverlayContainerContext.Provider>
      </DialogContent>
    </Dialog>
  );
};
