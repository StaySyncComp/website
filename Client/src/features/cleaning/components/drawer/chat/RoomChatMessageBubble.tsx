import { memo } from "react";
import { Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/types/ui/chat.types";
import {
  formatChatTime,
  getGuestInitials,
  isHotelMessage,
} from "@/features/cleaning/utils/chatHelpers";
import { cn } from "@/lib/utils";

interface RoomChatMessageBubbleProps {
  message: Message;
  isHotel: boolean;
  locale: string;
  organizationName?: string;
  guestName?: string;
  guestInitials?: string;
  smartAssistantLabel: string;
}

export const RoomChatMessageBubble = memo<RoomChatMessageBubbleProps>(
  ({
    message,
    isHotel,
    locale,
    organizationName,
    guestName,
    guestInitials,
    smartAssistantLabel,
  }) => {
    const time = formatChatTime(message.createdAt, locale);
    const senderName = isHotel
      ? `${organizationName || ""}${organizationName ? " - " : ""}${smartAssistantLabel}`.trim()
      : guestName || message.user.name || message.user.username;

    return (
      <div
        className={cn(
          "flex gap-2.5 max-w-[85%]",
          isHotel ? "self-start flex-row" : "self-end flex-row-reverse",
        )}
      >
        <Avatar className="h-9 w-9 shrink-0 mt-5">
          {isHotel ? (
            message.user.logo ? (
              <AvatarImage src={message.user.logo} alt={senderName} />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-[#6366F1] to-[#EC4899] text-white text-xs">
                <Sparkles className="w-4 h-4" />
              </AvatarFallback>
            )
          ) : (
            <AvatarFallback className="bg-[#EFF6FF] text-[#2F80ED] text-xs font-bold">
              {guestInitials ||
                getGuestInitials(message.user.name || message.user.username)}
            </AvatarFallback>
          )}
        </Avatar>

        <div className="min-w-0 flex flex-col gap-1">
          <div
            className={cn(
              "text-[11px] text-[#94A3B8] font-medium flex items-center gap-1.5",
              isHotel ? "text-start" : "text-end flex-row-reverse",
            )}
          >
            <span className="text-[#64748B]">{senderName}</span>
            <span>{time}</span>
          </div>

          {message.content && (
            <div
              className={cn(
                "px-4 py-3 text-[14px] leading-relaxed whitespace-pre-wrap break-words rounded-2xl",
                isHotel
                  ? "bg-[#1E3A5F] text-white rounded-ee-sm"
                  : "bg-[#E8ECF1] text-[#1E293B] rounded-es-sm",
              )}
            >
              {message.content}
            </div>
          )}
        </div>
      </div>
    );
  },
);

RoomChatMessageBubble.displayName = "RoomChatMessageBubble";

export const isMessageFromHotel = (
  message: Message,
  currentUserId?: number,
) => isHotelMessage(message.user, currentUserId);
