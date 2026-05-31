import { memo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Message } from "@/types/ui/chat.types";
import { groupMessagesByDate } from "@/features/cleaning/utils/chatHelpers";
import {
  isMessageFromHotel,
  RoomChatMessageBubble,
} from "./RoomChatMessageBubble";

interface RoomChatMessagesProps {
  messages: Message[];
  isLoading?: boolean;
  currentUserId?: number;
  organizationName?: string;
  guestName?: string;
  guestInitials?: string;
}

export const RoomChatMessages = memo<RoomChatMessagesProps>(
  ({
    messages,
    isLoading,
    currentUserId,
    organizationName,
    guestName,
    guestInitials,
  }) => {
    const { t, i18n } = useTranslation();
    const endRef = useRef<HTMLDivElement>(null);
    const locale = i18n.language === "he" ? "he-IL" : i18n.language;
    const groups = groupMessagesByDate(messages, locale);

    useEffect(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (isLoading) {
      return (
        <div className="flex-1 flex items-center justify-center text-[#94A3B8] text-sm">
          ...
        </div>
      );
    }

    if (messages.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center text-[#94A3B8] text-sm">
          {t("no_chat_messages")}
        </div>
      );
    }

    return (
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="flex flex-col gap-6">
          {groups.map((group) => (
            <div key={group.dateKey} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#E2E8F0]" />
                <span className="text-[12px] text-[#94A3B8] font-medium whitespace-nowrap">
                  {group.label}
                </span>
                <div className="flex-1 h-px bg-[#E2E8F0]" />
              </div>

              <div className="flex flex-col gap-4">
                {group.messages.map((message) => (
                  <RoomChatMessageBubble
                    key={message.id}
                    message={message}
                    isHotel={isMessageFromHotel(message, currentUserId)}
                    locale={locale}
                    organizationName={organizationName}
                    guestName={guestName}
                    guestInitials={guestInitials}
                    smartAssistantLabel={t("hotel_smart_assistant")}
                  />
                ))}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </div>
    );
  },
);

RoomChatMessages.displayName = "RoomChatMessages";
