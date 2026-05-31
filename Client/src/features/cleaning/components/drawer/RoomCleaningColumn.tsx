import { memo, useState } from "react";
import { CheckCircle2, RefreshCw, Sparkles, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CleaningRoom, CleaningStatus } from "@/features/cleaning/types";
import { User } from "@/types/api/user";
import {
  formatShortDateTime,
  getCleaningStatusLabel,
  isCleanStatus,
} from "@/features/cleaning/utils/drawerHelpers";
import { cn } from "@/lib/utils";
import { useNestedOverlayContainer } from "@/contexts/nestedOverlayContext";
import { RoomColumnLayout, RoomSectionDivider } from "./RoomColumnLayout";

interface RoomCleaningColumnProps {
  room: CleaningRoom;
  users: User[];
  cleaning?: CleaningRoom["cleaningStatus"];
  onStatusChange: (roomId: number, status: CleaningStatus) => void | Promise<void>;
  onAssignUser: (roomId: number, userId: number) => void | Promise<void>;
}

export const RoomCleaningColumn = memo<RoomCleaningColumnProps>(
  ({ room, users, cleaning, onStatusChange, onAssignUser }) => {
    const { t } = useTranslation();
    const nestedOverlayContainer = useNestedOverlayContainer();
    const task = cleaning ?? room.cleaningStatus!;
    const isClean = isCleanStatus(task.status);
    const [showStatusPicker, setShowStatusPicker] = useState(false);
    const [showAssignPicker, setShowAssignPicker] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const assignedUser = users.find((u) => u.id === task.assignedToId);
    const lastHistory = task.history?.[0];

    const statusDetail = lastHistory
      ? `${t("today")}, ${formatShortDateTime(lastHistory.timestamp).split(", ")[1]} | ${lastHistory.performerName || assignedUser?.name || "-"}`
      : assignedUser
        ? `${t("today")} | ${assignedUser.name}`
        : null;

    const handleStatusChange = async (status: CleaningStatus) => {
      if (status === task.status) {
        setShowStatusPicker(false);
        return;
      }

      setShowStatusPicker(false);
      setIsUpdating(true);
      try {
        await onStatusChange(room.id, status);
      } catch (error) {
        console.error("Failed to update cleaning status", error);
        toast.error(
          t("error_updating_status", { defaultValue: "Failed to update status" }),
        );
      } finally {
        setIsUpdating(false);
      }
    };

    const handleAssignUser = async (userId: number) => {
      setShowAssignPicker(false);
      setIsUpdating(true);
      try {
        await onAssignUser(room.id, userId);
      } catch (error) {
        console.error("Failed to assign cleaner", error);
        toast.error(
          t("error_assigning_cleaner", { defaultValue: "Failed to assign cleaner" }),
        );
      } finally {
        setIsUpdating(false);
      }
    };

    const selectContentProps = {
      container: nestedOverlayContainer ?? undefined,
      className: "z-[160] pointer-events-auto",
      position: "popper" as const,
    };

    return (
      <RoomColumnLayout
        icon={<Sparkles className="w-[18px] h-[18px] text-[#64748B]" />}
        title={t("room_cleaning")}
        footer={
          <div className="flex flex-col gap-2">
            {showStatusPicker && (
              <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                <label className="text-xs font-semibold text-[#94A3B8] mb-2 block text-start">
                  {t("current_status")}
                </label>
                <Select
                  value={task.status}
                  onValueChange={(val) => handleStatusChange(val as CleaningStatus)}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="w-full h-10 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent {...selectContentProps}>
                    <SelectItem value="vacant_dirty">
                      {t("vacant_dirty")}
                    </SelectItem>
                    <SelectItem value="vacant_clean">
                      {t("vacant_clean")}
                    </SelectItem>
                    <SelectItem value="vacant_inspected">
                      {t("vacant_inspected")}
                    </SelectItem>
                    <SelectItem value="occupied_clean">
                      {t("occupied_clean")}
                    </SelectItem>
                    <SelectItem value="occupied_dirty">
                      {t("occupied_dirty")}
                    </SelectItem>
                    <SelectItem value="do_not_disturb">
                      {t("do_not_disturb")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {showAssignPicker && (
              <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                <label className="text-xs font-semibold text-[#94A3B8] mb-2 block text-start">
                  {t("assigned_staff")}
                </label>
                <Select
                  value={task.assignedToId?.toString() || "unassigned"}
                  onValueChange={(val) => {
                    if (val !== "unassigned") {
                      handleAssignUser(parseInt(val, 10));
                    }
                  }}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="w-full h-10 bg-white">
                    <SelectValue placeholder={t("select_cleaner")} />
                  </SelectTrigger>
                  <SelectContent {...selectContentProps}>
                    <SelectItem value="unassigned">{t("unassigned")}</SelectItem>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.id.toString()}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={u.logo || undefined} />
                            <AvatarFallback className="text-[10px]">
                              {u.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          {u.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button
                type="button"
                disabled={isUpdating}
                onClick={() => {
                  setShowAssignPicker(false);
                  setShowStatusPicker((open) => !open);
                }}
                className="flex-1 h-10 rounded-xl bg-[#2F80ED] hover:bg-[#2563EB] text-white font-semibold text-[13px] gap-1.5 shadow-none min-w-0"
              >
                <RefreshCw className="w-4 h-4 shrink-0" />
                <span className="truncate">{t("change_cleaning_status")}</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={isUpdating}
                onClick={() => {
                  setShowStatusPicker(false);
                  setShowAssignPicker((open) => !open);
                }}
                className="h-10 px-3 rounded-xl border-[#E2E8F0] text-[#475569] font-medium text-[13px] gap-1.5 shadow-none hover:bg-[#F8FAFC] shrink-0"
              >
                <UserCog className="w-4 h-4" />
                <span className="hidden xl:inline">{t("assign_cleaner")}</span>
              </Button>
            </div>
          </div>
        }
      >
        <div className="pb-2">
          <div className="flex flex-col items-center py-5">
            <div
              className={cn(
                "flex items-center gap-2 text-[28px] font-black leading-none",
                isClean ? "text-[#16A34A]" : "text-[#DC2626]",
              )}
            >
              <CheckCircle2 className="w-7 h-7" />
              {getCleaningStatusLabel(task.status, t)}
            </div>
            {statusDetail && (
              <p className="text-[13px] text-[#64748B] mt-2.5 text-center">
                {statusDetail}
              </p>
            )}
          </div>

          {task.history && task.history.length > 0 ? (
            <>
              <RoomSectionDivider label={t("cleaning_history")} />
              <div className="divide-y divide-[#F1F5F9]">
                {task.history.map((entry, index) => (
                  <div
                    key={`${entry.timestamp}-${index}`}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarFallback className="text-[10px] bg-[#F1F5F9] text-[#64748B]">
                          {(entry.performerName || "?").substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[13px] text-[#1E293B] font-medium truncate text-start">
                        {entry.performerName || entry.action}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#94A3B8] tabular-nums shrink-0 whitespace-nowrap">
                      {formatShortDateTime(entry.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-[13px] text-[#94A3B8] text-center py-4">
              {t("no_recent_activity")}
            </p>
          )}
        </div>
      </RoomColumnLayout>
    );
  },
);

RoomCleaningColumn.displayName = "RoomCleaningColumn";
