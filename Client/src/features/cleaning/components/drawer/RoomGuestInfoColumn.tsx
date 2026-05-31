import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CleaningRoom } from "@/features/cleaning/types";
import { RoomModalStats, RoomStay } from "@/features/cleaning/types/roomModal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CheckInGuestDialog } from "./CheckInGuestDialog";
import { CheckInGuestPayload } from "@/features/cleaning/types/roomModal";

interface RoomGuestInfoColumnProps {
  room: CleaningRoom;
  stay: RoomStay | null;
  stayCount: number;
  stats: RoomModalStats | null;
  isLoading?: boolean;
  onCheckIn: (
    payload: Omit<CheckInGuestPayload, "organizationId">,
  ) => Promise<void>;
  onCheckOut: () => Promise<void>;
}

const StatCard = memo<{ value: number; label: string }>(({ value, label }) => (
  <div className="bg-[#FAFBFC] rounded-xl border border-[#E8ECF1] p-3 flex flex-col items-center justify-center text-center min-h-[80px]">
    <span className="text-[28px] font-black text-[#2F80ED] leading-none">
      {value}
    </span>
    <span className="text-[11px] text-[#64748B] mt-1.5 font-medium leading-tight text-center">
      {label}
    </span>
  </div>
));

StatCard.displayName = "StatCard";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export const RoomGuestInfoColumn = memo<RoomGuestInfoColumnProps>(
  ({ stay, stayCount, stats, isLoading, onCheckIn, onCheckOut }) => {
    const { t } = useTranslation();
    const [checkInOpen, setCheckInOpen] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const initials = stay?.guestName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2);

    const preferenceLabel = (pref: string) => {
      const known: Record<string, string> = {
        gluten_free: t("gluten_free"),
        low_floor: t("low_floor"),
      };
      return known[pref] || pref;
    };

    const handleCheckOut = async () => {
      setIsCheckingOut(true);
      try {
        await onCheckOut();
      } finally {
        setIsCheckingOut(false);
      }
    };

    return (
      <>
        <div className="flex flex-col min-h-0 overflow-hidden bg-white">
          <div className="flex-1 overflow-y-auto px-5 pt-5 pb-4 min-h-0">
            <div className="flex flex-col items-center text-center mb-5">
              <Avatar className="h-[60px] w-[60px] mb-2.5">
                <AvatarFallback className="text-base bg-[#EFF6FF] text-[#2F80ED] font-bold">
                  {stay ? initials : "—"}
                </AvatarFallback>
              </Avatar>
              <h4 className="font-black text-[#1E293B] text-[17px] leading-tight">
                {stay ? stay.guestName : t("vacant")}
              </h4>
              {stay && stayCount > 0 && (
                <p className="text-[13px] text-[#64748B] mt-1">
                  {t("nth_stay_at_hotel_count", { count: stayCount })}
                </p>
              )}
            </div>

            {isLoading ? (
              <p className="text-[13px] text-[#94A3B8] text-center py-4">...</p>
            ) : stay ? (
              <>
                <div className="space-y-2.5 mb-5">
                  <DetailRow
                    label={t("dates_label")}
                    value={`${formatDate(stay.checkIn)} - ${formatDate(stay.checkOut)}`}
                  />
                  <DetailRow
                    label={t("guests_label")}
                    value={t("guests_count", {
                      adults: stay.adults,
                      children: stay.children,
                    })}
                  />
                  {stay.guestPhone && (
                    <DetailRow label={t("phone_label")} value={stay.guestPhone} />
                  )}
                  {stay.guestEmail && (
                    <DetailRow label={t("email_label")} value={stay.guestEmail} />
                  )}
                </div>

                {stay.preferences.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[13px] font-bold text-[#1E293B] mb-2 text-start">
                      {t("special_preferences")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {stay.preferences.map((pref) => (
                        <span
                          key={pref}
                          className="px-3 py-1 rounded-full bg-[#F1F5F9] text-[#475569] text-[11px] font-medium"
                        >
                          {preferenceLabel(pref)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full rounded-xl border-[#E2E8F0]"
                  onClick={handleCheckOut}
                  disabled={isCheckingOut}
                >
                  {t("check_out_guest")}
                </Button>
              </>
            ) : (
              <div className="text-center space-y-3">
                <p className="text-[13px] text-[#94A3B8]">{t("no_guest_info")}</p>
                <Button
                  className="rounded-xl bg-[#2F80ED] hover:bg-[#2563EB]"
                  onClick={() => setCheckInOpen(true)}
                >
                  {t("check_in_guest")}
                </Button>
              </div>
            )}
          </div>

          <div className="px-5 pb-5 pt-3 border-t border-[#E8ECF1] shrink-0">
            <h4 className="font-bold text-[#1E293B] text-[15px] mb-3 text-start">
              {t("room_data")}
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <StatCard
                value={stats?.closedCalls ?? 0}
                label={t("closed_requests")}
              />
              <StatCard
                value={stats?.openCalls ?? 0}
                label={t("open_requests")}
              />
              <StatCard
                value={stats?.cleaningHistoryCount ?? 0}
                label={t("cleaning_history")}
              />
              <StatCard
                value={stats?.notesCount ?? 0}
                label={t("room_notes")}
              />
            </div>
          </div>
        </div>

        <CheckInGuestDialog
          open={checkInOpen}
          onOpenChange={setCheckInOpen}
          onSubmit={onCheckIn}
        />
      </>
    );
  },
);

RoomGuestInfoColumn.displayName = "RoomGuestInfoColumn";

const DetailRow = memo<{ label: string; value: string }>(
  ({ label, value }) => (
    <div className="flex items-center justify-between gap-3 text-[13px]">
      <span className="text-[#94A3B8] shrink-0">{label}</span>
      <span className="text-[#1E293B] font-medium text-end">{value}</span>
    </div>
  ),
);

DetailRow.displayName = "DetailRow";
