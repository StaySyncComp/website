import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RoomStay } from "@/features/cleaning/types/roomModal";
import { getGuestInitials } from "@/features/cleaning/utils/chatHelpers";

interface RoomChatGuestSidebarProps {
  stay: RoomStay | null;
  stayCount: number;
  previousStays: RoomStay[];
  isLoading?: boolean;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const formatStayRange = (checkIn: string, checkOut: string) =>
  `${formatDate(checkIn)} - ${formatDate(checkOut)}`;

export const RoomChatGuestSidebar = memo<RoomChatGuestSidebarProps>(
  ({ stay, stayCount, previousStays, isLoading }) => {
    const { t } = useTranslation();

    const initials = stay?.guestName
      ? getGuestInitials(stay.guestName)
      : "—";

    const preferenceLabel = (pref: string) => {
      const known: Record<string, string> = {
        gluten_free: t("gluten_free"),
        low_floor: t("low_floor"),
      };
      return known[pref] || pref;
    };

    return (
      <aside className="w-[320px] shrink-0 border-s border-[#E8ECF1] bg-[#F8FAFC] overflow-y-auto">
        <div className="p-5 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-[#E8ECF1] p-5">
            {isLoading ? (
              <p className="text-[13px] text-[#94A3B8] text-center py-6">...</p>
            ) : stay ? (
              <>
                <div className="flex flex-col items-center text-center mb-5">
                  <Avatar className="h-[72px] w-[72px] mb-3">
                    <AvatarFallback className="text-lg bg-[#EFF6FF] text-[#2F80ED] font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <h4 className="font-black text-[#1E293B] text-[18px] leading-tight">
                    {stay.guestName}
                  </h4>
                  {stayCount > 0 && (
                    <p className="text-[13px] text-[#64748B] mt-1">
                      {t("nth_stay_at_hotel_count", { count: stayCount })}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <DetailRow
                    label={t("dates_label")}
                    value={formatStayRange(stay.checkIn, stay.checkOut)}
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
                  <div className="mt-5 pt-4 border-t border-[#F1F5F9]">
                    <p className="text-[13px] font-bold text-[#1E293B] mb-2.5 text-start">
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
              </>
            ) : (
              <div className="text-center py-6">
                <Avatar className="h-[72px] w-[72px] mx-auto mb-3">
                  <AvatarFallback className="text-lg bg-[#F1F5F9] text-[#94A3B8]">
                    —
                  </AvatarFallback>
                </Avatar>
                <p className="font-bold text-[#1E293B]">{t("vacant")}</p>
                <p className="text-[13px] text-[#94A3B8] mt-1">
                  {t("no_guest_info")}
                </p>
              </div>
            )}
          </div>

          {previousStays.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E8ECF1] p-5">
              <h4 className="font-bold text-[#1E293B] text-[15px] mb-4 text-start">
                {t("previous_stays")}
              </h4>
              <div className="space-y-3">
                {previousStays.map((pastStay) => (
                  <div
                    key={pastStay.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 text-start">
                      <p className="text-[13px] font-semibold text-[#1E293B] truncate">
                        {pastStay.guestName}
                      </p>
                      <p className="text-[11px] text-[#94A3B8] mt-0.5">
                        {formatDate(pastStay.checkOut)}
                      </p>
                    </div>
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="text-[10px] bg-[#EFF6FF] text-[#2F80ED] font-bold">
                        {getGuestInitials(pastStay.guestName)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    );
  },
);

RoomChatGuestSidebar.displayName = "RoomChatGuestSidebar";

const DetailRow = memo<{ label: string; value: string }>(({ label, value }) => (
  <div className="flex items-start justify-between gap-3 text-[13px]">
    <span className="text-[#94A3B8] shrink-0">{label}</span>
    <span className="text-[#1E293B] font-medium text-end">{value}</span>
  </div>
));

DetailRow.displayName = "DetailRow";
