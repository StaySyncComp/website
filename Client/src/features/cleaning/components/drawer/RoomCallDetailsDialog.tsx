import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { Call } from "@/types/api/calls";
import { User } from "@/types/api/user";
import { CallDetailsWithChat } from "@/features/calls/components/SideStatsCard";
import { cn } from "@/lib/utils";

interface RoomCallDetailsDialogProps {
  call: Call | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: User[];
}

export function RoomCallDetailsDialog({
  call,
  open,
  onOpenChange,
  users,
}: RoomCallDetailsDialogProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "he" || i18n.language === "ar";

  if (!open || !call) return null;

  return (
    <div
      data-room-call-details-overlay
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
        className={cn(
          "relative z-10 w-full max-w-[1200px] h-[85vh] rounded-2xl border border-[#E8ECF1]",
          "bg-white shadow-2xl overflow-hidden flex flex-col",
        )}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-[#E8ECF1] shrink-0">
          <h2 className="text-lg font-bold text-[#1E293B]">{t("call_details")}</h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] hover:bg-[#E2E8F0] transition-colors shrink-0"
            aria-label={t("close")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          <CallDetailsWithChat call={call} users={users} className="h-full" />
        </div>
      </div>
    </div>
  );
}
