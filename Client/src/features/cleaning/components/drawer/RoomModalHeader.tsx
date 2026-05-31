import { memo } from "react";
import { MessageCircle, X, LayoutGrid } from "lucide-react";
import { DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { CleaningRoom } from "@/features/cleaning/types";
import { getName } from "@/features/cleaning/utils/roomHelpers";
import { cn } from "@/lib/utils";

interface RoomModalHeaderProps {
  room: CleaningRoom;
  onClose: () => void;
  onChatClick?: () => void;
  onRoomDetailsClick?: () => void;
  hasUnreadMessages?: boolean;
  mode?: "room" | "chat";
}

export const RoomModalHeader = memo<RoomModalHeaderProps>(
  ({ room, onClose, onChatClick, onRoomDetailsClick, hasUnreadMessages = true, mode = "room" }) => {
    const { t } = useTranslation();
    const task = room.cleaningStatus;
    const isVacant = task?.status.startsWith("vacant");

    return (
      <div className="bg-white px-6 py-4 shrink-0 flex items-center justify-between border-b border-[#E8ECF1]">
        {/* Room info — start side (right in RTL) */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative w-[76px] h-[56px] rounded-xl overflow-hidden shrink-0 bg-[#E2E8F0]">
            <img
              src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200&h=150&fit=crop"
              alt=""
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1.5 start-1.5 bg-black/65 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none">
              {t("more_photos", { count: 3 })}
            </span>
          </div>

          <div className="min-w-0 text-start">
            <div className="flex items-center gap-2.5 flex-wrap">
              <DialogTitle className="text-[22px] font-black text-[#1E293B] tracking-tight leading-tight">
                {getName(room.name, i18n.language)}
              </DialogTitle>
              <Badge
                variant="default"
                className={cn(
                  "px-2.5 py-0.5 text-[11px] font-bold shadow-none rounded-full border-none shrink-0",
                  isVacant
                    ? "bg-[#D1FAE5] text-[#065F46] hover:bg-[#D1FAE5]"
                    : "bg-[#FF8A8A] text-white hover:bg-[#FF8A8A]",
                )}
              >
                {isVacant ? t("vacant") : t("occupied")}
              </Badge>
            </div>
            <div className="text-[13px] text-[#64748B] font-medium flex items-center gap-2 mt-1">
              <span>
                {t("floor")} {getName(room.area?.name, i18n.language)}
              </span>
              <span className="text-[#CBD5E1]">|</span>
              <span>
                {t("room")} {room.roomNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Actions — end side (left in RTL) */}
        <div className="flex items-center gap-3 shrink-0">
          {mode === "chat" ? (
            <Button
              onClick={onRoomDetailsClick}
              className="h-10 px-5 rounded-full bg-[#2F80ED] hover:bg-[#2563EB] text-white font-semibold text-sm gap-2 shadow-none"
            >
              <LayoutGrid className="w-4 h-4" />
              {t("room_details")}
            </Button>
          ) : (
            <Button
              onClick={onChatClick}
              className="relative h-10 px-5 rounded-full bg-[#2F80ED] hover:bg-[#2563EB] text-white font-semibold text-sm gap-2 shadow-none"
            >
              <MessageCircle className="w-4 h-4" />
              {t("chat_with_guest")}
              {hasUnreadMessages && (
                <span className="absolute -top-0.5 -end-0.5 w-2.5 h-2.5 bg-[#EF4444] rounded-full border-2 border-white" />
              )}
            </Button>
          )}

          <DialogClose asChild onClick={onClose}>
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] hover:bg-[#E2E8F0] transition-colors"
              aria-label={t("close")}
            >
              <X className="w-4 h-4" />
            </button>
          </DialogClose>
        </div>
      </div>
    );
  },
);

RoomModalHeader.displayName = "RoomModalHeader";
