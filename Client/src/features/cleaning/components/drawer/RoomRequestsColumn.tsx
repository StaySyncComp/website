import { memo } from "react";
import { Plus, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { CleaningRoom } from "@/features/cleaning/types";
import { Call, CallStatus } from "@/types/api/calls";
import { useRoomCalls } from "@/features/cleaning/hooks/useRoomCalls";
import { formatShortDateTime } from "@/features/cleaning/utils/drawerHelpers";
import { cn } from "@/lib/utils";
import { RoomColumnLayout, RoomSectionDivider } from "./RoomColumnLayout";

interface RoomRequestsColumnProps {
  room: CleaningRoom;
  isOpen: boolean;
  onOpenCreateCall?: () => void;
  onSelectCall?: (call: Call) => void;
  refreshKey?: number;
}

const statusBadgeStyles: Record<CallStatus, string> = {
  OPENED: "bg-[#FEE2E2] text-[#DC2626]",
  IN_PROGRESS: "bg-[#FEF3C7] text-[#D97706]",
  ON_HOLD: "bg-[#F1F5F9] text-[#64748B]",
  COMPLETED: "bg-[#D1FAE5] text-[#065F46]",
  FAILED: "bg-[#FEE2E2] text-[#DC2626]",
};

const getStatusLabel = (status: CallStatus, t: (key: string) => string) => {
  switch (status) {
    case "OPENED":
      return t("status_not_started");
    case "IN_PROGRESS":
      return t("status_in_progress");
    case "ON_HOLD":
      return t("unassigned");
    case "COMPLETED":
      return t("status_completed");
    case "FAILED":
      return t("status_failed");
    default:
      return status;
  }
};

const getCategoryIcon = (call: Call) => {
  const logo = call.callCategory?.logo;
  if (logo) {
    return (
      <img src={logo} alt="" className="w-[18px] h-[18px] object-contain shrink-0" />
    );
  }
  return <Wrench className="w-4 h-4 text-[#94A3B8] shrink-0" />;
};

const RequestRow = memo<{
  call: Call;
  showStatus?: boolean;
  onSelect?: (call: Call) => void;
}>(({ call, showStatus = false, onSelect }) => {
    const { t } = useTranslation();

    return (
      <button
        type="button"
        onClick={() => onSelect?.(call)}
        className="w-full flex items-center justify-between gap-3 py-2.5 px-1 -mx-1 rounded-lg hover:bg-[#F8FAFC] transition-colors text-start"
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {getCategoryIcon(call)}
          <span className="text-[13px] text-[#1E293B] font-medium truncate text-start">
            {call.description}
          </span>
        </div>

        {showStatus ? (
          <span
            className={cn(
              "text-[11px] font-bold px-2 py-0.5 rounded-md shrink-0 whitespace-nowrap",
              statusBadgeStyles[call.status],
            )}
          >
            {getStatusLabel(call.status, t)}
          </span>
        ) : (
          <span className="text-[11px] text-[#94A3B8] shrink-0 tabular-nums whitespace-nowrap">
            {formatShortDateTime(call.createdAt.toString())}
          </span>
        )}
      </button>
    );
  },
);

RequestRow.displayName = "RequestRow";

export const RoomRequestsColumn = memo<RoomRequestsColumnProps>(
  ({ room, isOpen, onOpenCreateCall, onSelectCall, refreshKey = 0 }) => {
    const { t } = useTranslation();
    const { activeCalls, historyCalls, isLoading } = useRoomCalls(
      room.id,
      isOpen,
      refreshKey,
    );

    return (
      <RoomColumnLayout
        icon={<Wrench className="w-[18px] h-[18px] text-[#64748B]" />}
        title={t("room_requests")}
        footer={
          <Button
            onClick={() => onOpenCreateCall?.()}
            className="w-full h-10 rounded-xl bg-[#2F80ED] hover:bg-[#2563EB] text-white font-semibold text-sm gap-1.5 shadow-none"
          >
            <Plus className="w-4 h-4" />
            {t("create_new_request")}
          </Button>
        }
      >
        <div className="pb-2">
          {isLoading ? (
            <p className="text-sm text-[#94A3B8] text-center py-4">...</p>
          ) : (
            <>
              {activeCalls.length > 0 ? (
                <div className="divide-y divide-[#F1F5F9]">
                  {activeCalls.map((call) => (
                    <RequestRow
                      key={call.id}
                      call={call}
                      showStatus
                      onSelect={onSelectCall}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-[#94A3B8] text-center py-3">
                  {t("no_active_requests")}
                </p>
              )}

              {historyCalls.length > 0 && (
                <>
                  <RoomSectionDivider label={t("request_history")} />
                  <div className="divide-y divide-[#F1F5F9]">
                    {historyCalls.slice(0, 6).map((call) => (
                      <RequestRow
                        key={call.id}
                        call={call}
                        onSelect={onSelectCall}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </RoomColumnLayout>
    );
  },
);

RoomRequestsColumn.displayName = "RoomRequestsColumn";
