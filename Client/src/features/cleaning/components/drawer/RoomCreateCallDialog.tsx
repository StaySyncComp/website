import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, X } from "lucide-react";
import AddCall from "@/features/calls/components/AddCall";
import { CleaningRoom } from "@/features/cleaning/types";
import { getName } from "@/features/cleaning/utils/roomHelpers";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { NestedOverlayContainerContext } from "@/contexts/nestedOverlayContext";

interface RoomCreateCallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: CleaningRoom;
  onSuccess: () => void;
}

export function RoomCreateCallDialog({
  open,
  onOpenChange,
  room,
  onSuccess,
}: RoomCreateCallDialogProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "he" || i18n.language === "ar";
  const [overlayContainer, setOverlayContainer] = useState<HTMLElement | null>(
    null,
  );

  const overlayRef = useCallback((node: HTMLDivElement | null) => {
    setOverlayContainer(node);
  }, []);

  const roomLabel = `${getName(room.name, i18n.language)} · ${t("floor")} ${getName(room.area?.name, i18n.language)} · ${t("room")} ${room.roomNumber}`;

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  const handleSuccess = () => {
    toast.success(t("call_created_success"));
    onSuccess();
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <NestedOverlayContainerContext.Provider value={overlayContainer}>
      <div
        ref={overlayRef}
        data-room-create-call-overlay
        className="absolute inset-0 z-[60] flex items-center justify-center p-4"
      >
        <button
          type="button"
          aria-label={t("close")}
          className="absolute inset-0 z-0 bg-black/50"
          onClick={() => onOpenChange(false)}
        />

        <div
          dir={isRtl ? "rtl" : "ltr"}
          role="dialog"
          aria-modal="true"
          aria-labelledby="room-create-call-title"
          className={cn(
            "relative z-10 w-full max-w-[520px] rounded-2xl border border-[#E8ECF1]",
            "bg-white shadow-2xl overflow-visible flex flex-col max-h-[85vh]",
          )}
        >
          <div className="px-6 py-4 border-b border-[#E8ECF1] shrink-0">
            <div className="flex items-center justify-between gap-3">
              <h2
                id="room-create-call-title"
                className="text-lg font-bold text-[#1E293B]"
              >
                {t("create_new_request")}
              </h2>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] hover:bg-[#E2E8F0] transition-colors shrink-0"
                aria-label={t("close")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="px-6 py-5 overflow-y-auto overflow-x-visible">
            <div className="flex items-center gap-2 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] px-4 py-3 mb-5 text-sm font-medium text-[#1E40AF]">
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="text-start">{roomLabel}</span>
            </div>

            <AddCall
              variant="room-modal"
              lockLocationId
              defaultLocationId={room.id}
              onSuccess={handleSuccess}
              onCancel={() => onOpenChange(false)}
            />
          </div>
        </div>
      </div>
    </NestedOverlayContainerContext.Provider>
  );
}
