import { memo, useContext } from "react";
import { CleaningRoom } from "@/features/cleaning/types";
import { RoomStay } from "@/features/cleaning/types/roomModal";
import { useRoomLocationChat } from "@/features/cleaning/hooks/useRoomLocationChat";
import { OrganizationsContext } from "@/features/organization/context/organization-context";
import { getGuestInitials } from "@/features/cleaning/utils/chatHelpers";
import { RoomChatMessages } from "./chat/RoomChatMessages";
import { RoomChatInput } from "./chat/RoomChatInput";
import { RoomChatGuestSidebar } from "./chat/RoomChatGuestSidebar";

interface RoomChatPanelProps {
  room: CleaningRoom;
  stay: RoomStay | null;
  stayCount: number;
  previousStays: RoomStay[];
  isLoading?: boolean;
}

export const RoomChatPanel = memo<RoomChatPanelProps>(
  ({ room, stay, stayCount, previousStays, isLoading: stayLoading }) => {
    const { organization } = useContext(OrganizationsContext);
    const {
      messages,
      isLoading: messagesLoading,
      newMessage,
      setNewMessage,
      handleSendMessage,
      currentUser,
    } = useRoomLocationChat(room.id);

    const guestInitials = stay?.guestName
      ? getGuestInitials(stay.guestName)
      : undefined;

    return (
      <div className="flex-1 flex min-h-0 overflow-hidden bg-[#F4F7FB]">
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <RoomChatMessages
            messages={messages}
            isLoading={messagesLoading}
            currentUserId={currentUser?.id}
            organizationName={organization?.name}
            guestName={stay?.guestName}
            guestInitials={guestInitials}
          />
          <RoomChatInput
            locationId={room.id}
            value={newMessage}
            onChange={setNewMessage}
            onSend={handleSendMessage}
          />
        </div>

        <RoomChatGuestSidebar
          stay={stay}
          stayCount={stayCount}
          previousStays={previousStays}
          isLoading={stayLoading}
        />
      </div>
    );
  },
);

RoomChatPanel.displayName = "RoomChatPanel";
