import { useMemo, useState, useEffect } from "react";
import { Call } from "@/types/api/calls";
import { updateCall } from "@/features/calls/api";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Share2,
  Maximize2,
  MessageCircle,
  X,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRTL } from "@/hooks/useRtl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/api/user";
import { useUser } from "@/features/auth/hooks/useUser";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { CallChat } from "@/features/calls/components/calls-table/CallChat/CallChat";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { formatDateTime } from "@/lib/dateUtils";

interface SideStatsCardProps {
  call: Call | null;
  className?: string;
  users?: User[];
}

export function SideStatsCard({
  call,
  className,
  users = [],
}: SideStatsCardProps) {
  if (!call) {
    return <EmptyState className={className} />;
  }

  // We wrap the card in the Dialog to handle the expand logic
  return (
    <Dialog>
      <Card
        className={cn(
          "flex flex-col bg-white rounded-2xl overflow-hidden border-none shadow-sm",
          className,
        )}
      >
        <CallStatsContent
          call={call}
          users={users}
          headerAction={
            <DialogTrigger asChild>
              <div className="p-2 cursor-pointer hover:bg-slate-50 rounded-lg transition-colors">
                <MessageCircle className="w-5 h-5 text-[#203C87]" />
              </div>
            </DialogTrigger>
          }
        />
      </Card>

      <DialogContent className="w-[90vw] max-w-[1450px] h-[90vh] p-0 gap-0 overflow-hidden border-none bg-slate-50/50">
        <VisuallyHidden>
          <DialogTitle>Call Details And Chat</DialogTitle>
        </VisuallyHidden>

        <DialogClose className="absolute right-12 top-12 z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <CallDetailsWithChat call={call} users={users} className="h-full pt-12" />
      </DialogContent>
    </Dialog>
  );
}

export function CallDetailsWithChat({
  call,
  users,
  className,
}: {
  call: Call;
  users: User[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-[30%_70%] h-full min-h-0",
        className,
      )}
    >
      <div className="h-full bg-white flex flex-col overflow-y-auto border-r border-slate-100">
        <CallStatsContent
          call={call}
          users={users}
          isExpanded={true}
          headerAction={null}
        />
      </div>

      <div className="h-full bg-slate-50 flex flex-col overflow-hidden min-h-0">
        <CallChat
          callId={parseInt(call.id)}
          callStatusHistory={call.CallStatusHistory || []}
          className="flex-1 h-auto border-none shadow-none rounded-none bg-transparent"
        />
      </div>
    </div>
  );
}

// Extracted Content Component
function CallStatsContent({
  call,
  users,
  headerAction,
  isExpanded = false,
}: {
  call: Call;
  users: User[];
  headerAction?: React.ReactNode;
  isExpanded?: boolean;
}) {
  const { t } = useTranslation();
  const { getNameByLanguage, isRtl } = useRTL();
  const { allUsers } = useUser();

  const handleSmartShare = async () => {
    const usersToPickFrom = allUsers && allUsers.length > 0 ? allUsers : users;
    if (!usersToPickFrom || usersToPickFrom.length === 0) return;

    const randomUser =
      usersToPickFrom[Math.floor(Math.random() * usersToPickFrom.length)];

    await updateCall({
      id: String(call.id),
      assignedToId: Number(randomUser.id),
      status: "IN_PROGRESS",
    });
    window.location.reload();
  };

  const handleCloseCall = async () => {
    if (!call?.id) return;
    await updateCall({ id: String(call.id), status: "COMPLETED" });
    // Force a reload of the window to reflect changes since we don't have a callback
    // Or better, assume the user handles the refresh manually or the socket works.
    // The previous implementation in ActionCell used a simple status update.
    window.location.reload();
  };

  return (
    <div
      className={cn(
        "p-5 space-y-5 flex-1 flex flex-col overflow-y-auto",
        isExpanded && "p-6", // Slightly more padding in expanded mode if desired
      )}
    >
      {/* Header - Matches Figma layout */}
      <div className="flex justify-between items-center gap-4">
        <h3
          className="font-bold text-xl leading-tight"
          style={{ color: "#203C87" }}
        >
          {getNameByLanguage(call.callCategory?.name) || t("call_details")}
        </h3>

        {headerAction}
      </div>

      {/* Timer Circle */}
      <div className="flex justify-center py-2">
        <CircularTimer call={call} />
      </div>

      {/* Stats Grid - With BR spacing feel */}
      <div className="divide-y-2 divide-[#EEF1FB]">
        <div className="py-3">
          <StatRow
            label={t("status")}
            customValue={<CustomStatusBadge status={call.status} t={t} />}
          />
        </div>
        <div className="py-3">
          <StatRow
            label={t("opened_time")}
            value={formatDateTime(new Date(call.createdAt))}
          />
        </div>
        <div className="py-3">
          <StatRow
            label={t("department")}
            value={getNameByLanguage(call.Department?.name) || "-"}
          />
        </div>
        <div className="py-3">
          <StatRow
            label={t("location")}
            value={getNameByLanguage(call.location?.name) || "-"}
          />
        </div>
        <div className="flex flex-col py-2 gap-2">
          <span className="text-sm text-[#203C87] font-semibold w-40 flex-shrink-0">
            {t("description")}
          </span>
          <span className="text-sm text-slate-800">
            {call.description || "-"}
          </span>
        </div>
      </div>

      {/* Divider as BR */}
      <div className="border-t-2 border-slate-100 my-1" />

      {/* Assigned Workers or Smart Share Button */}
      {users && users.length > 0 ? (
        <div className="flex flex-col min-h-fit">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-slate-800">
              {t("assign_workers")}
            </span>
            <Button
              variant="ghost"
              className="h-auto p-0 text-xs text-slate-400 font-medium flex items-center gap-1 hover:text-slate-600"
            >
              {isRtl && <span className="text-slate-300">‹</span>}
              {t("all_workers")}
              {!isRtl && <span className="text-slate-300">›</span>}
            </Button>
          </div>

          <div
            className="flex gap-3 overflow-x-auto pb-2 px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {users.slice(0, 3).map((user) => (
              <div
                key={user.id}
                className="w-28 h-28 bg-white border border-slate-50 rounded-2xl p-4 flex flex-col items-center shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] relative group cursor-pointer hover:border-blue-100 transition-all active:scale-95"
              >
                <div className="relative mb-3">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm ring-1 ring-slate-50">
                    <AvatarImage src={user.logo} />
                    <AvatarFallback className="bg-blue-50 text-blue-500 font-bold text-sm">
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">
                    11
                  </div>
                </div>

                <span className="text-[11px] font-bold text-slate-800 text-center leading-tight mb-1 line-clamp-1">
                  {user.name}
                </span>
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-medium text-slate-400 text-center leading-tight">
                    1
                  </span>
                  <span className="text-[9px] text-slate-300 text-center leading-tight">
                    {t("calls_in_treatment")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-auto pt-4 space-y-3">
          {call.status === "IN_PROGRESS" && (
            <div className="mt-auto pt-4">
              <Button
                onClick={handleCloseCall}
                className="w-full bg-green-500 hover:bg-green-600 text-white rounded-2xl py-6 shadow-green-100 shadow-xl border-none transition-all active:scale-[0.98] font-bold text-base"
                size="lg"
              >
                <CheckCircle2 className="w-5 h-5 mx-2" />
                {t("close_call")}
              </Button>
            </div>
          )}
          {call.status !== "IN_PROGRESS" && call.status !== "COMPLETED" && (
            <>
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-2xl py-6 shadow-blue-100 shadow-xl border-none transition-all active:scale-[0.98] font-bold text-base"
                size="lg"
                onClick={handleSmartShare}
              >
                <Share2 className="w-5 h-5 mx-2" />
                {t("smart_share")}
              </Button>
              <div className="text-center">
                <span className="text-[10px] text-slate-300 font-medium block opacity-80">
                  * {t("smart_share_disclaimer")}
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function CustomStatusBadge({ status, t }: { status: Call["status"]; t: any }) {
  const config =
    {
      OPENED: "bg-blue-50/50 text-blue-500 border-blue-100",
      IN_PROGRESS: "bg-amber-50/50 text-amber-500 border-amber-100",
      COMPLETED: "bg-emerald-50/50 text-emerald-500 border-emerald-100",
      FAILED: "bg-red-50/50 text-red-500 border-red-100",
      ON_HOLD: "bg-slate-50/50 text-slate-500 border-slate-100",
    }[status] || "bg-slate-50 text-slate-500 border-slate-100";

  return (
    <div
      className={cn(
        "px-4 py-1 rounded-full text-xs font-bold border flex items-center gap-2",
        config,
      )}
    >
      <div
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          status === "OPENED"
            ? "bg-blue-500"
            : status === "IN_PROGRESS"
              ? "bg-amber-500"
              : "bg-slate-400",
        )}
      />
      {t(`status_${status.toLowerCase()}`)}
    </div>
  );
}

function StatRow({
  label,
  value,
  customValue,
}: {
  label: string;
  value?: string;
  customValue?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-[#203C87] font-semibold w-40 flex-shrink-0">
        {label}
      </span>

      <div className="flex-1 flex justify-start">
        {value && (
          <span className="text-sm text-[#2B344E] leading-tight">{value}</span>
        )}
        {customValue}
      </div>
    </div>
  );
}

function EmptyState({ className }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <Card
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center h-full min-h-[600px] bg-white rounded-2xl border-none shadow-sm",
        className,
      )}
    >
      <div className="w-full flex flex-col items-center space-y-10">
        <div className="relative">
          <Skeleton className="h-40 w-40 rounded-full bg-slate-50 ring-8 ring-slate-50/30" />
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <Maximize2 className="w-12 h-12 text-slate-300" />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-slate-800">
            {t("select_call")}
          </h3>
          <p className="text-sm text-slate-400 max-w-[240px] mx-auto leading-relaxed font-medium">
            {t("select_call_description")}
          </p>
        </div>

        <div className="w-full space-y-5 mt-6 px-6">
          <div className="flex justify-between items-center w-full">
            <Skeleton className="h-4 w-20 bg-slate-50" />
            <Skeleton className="h-6 w-24 rounded-full bg-slate-50/50" />
          </div>
          <div className="flex justify-between items-center w-full">
            <Skeleton className="h-4 w-20 bg-slate-50" />
            <Skeleton className="h-4 w-32 bg-slate-50/50" />
          </div>
          <div className="flex justify-between items-center w-full">
            <Skeleton className="h-4 w-20 bg-slate-50" />
            <Skeleton className="h-4 w-16 bg-slate-50/50" />
          </div>
          <div className="pt-8 w-full">
            <Skeleton className="h-14 w-full rounded-2xl bg-slate-50/80" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function CircularTimer({ call }: { call: Call }) {
  const { t } = useTranslation();

  const expectedMinutes = call.callCategory?.expectedTime || 48;
  const createdAt = new Date(call.createdAt).getTime();

  const endTime = useMemo(() => {
    const isClosed = call.status === "COMPLETED" || call.status === "FAILED";
    if (isClosed && call.CallStatusHistory?.length) {
      // Find the latest status change to the current closed status
      const closureEvent = [...call.CallStatusHistory]
        .filter((h) => h.toStatus === call.status)
        .sort(
          (a, b) =>
            new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime(),
        )[0];

      if (closureEvent) {
        return new Date(closureEvent.changedAt).getTime();
      }
    }
    // If open or no history found, use current time
    return isClosed ? Date.now() : Date.now();
  }, [call.status, call.CallStatusHistory, call.createdAt]); // Added dependencies

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    // Only tick if not closed
    if (call.status !== "COMPLETED" && call.status !== "FAILED") {
      const interval = setInterval(() => setNow(Date.now()), 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [call.status]);

  /* Use the calculated end time if closed, otherwise use live 'now' */
  const effectiveNow =
    call.status === "COMPLETED" || call.status === "FAILED" ? endTime : now;

  const elapsedMinutes = Math.floor((effectiveNow - createdAt) / (1000 * 60));

  const isOverdue = elapsedMinutes > expectedMinutes;

  const timeLeft = isOverdue
    ? elapsedMinutes - expectedMinutes
    : Math.max(0, expectedMinutes - elapsedMinutes);

  /* Logic for Completed Calls */
  const isCompleted = call.status === "COMPLETED";

  /* 
     If completed:
     - Always full circle (percentage = 1)
     - Show total elapsed time
     - Color: Green if on time, Red if overdue
  */

  const percentage = isCompleted
    ? 1
    : isOverdue
      ? 1
      : elapsedMinutes / expectedMinutes;

  /* Colors */
  let strokeColor = isOverdue ? "#ef4444" : "#203C87";
  let textColor = isOverdue ? "text-red-600" : "text-[#203C87]";
  let labelText = isOverdue ? t("time_exceeded") : t("minutes_left");
  let subTextColor = isOverdue ? "text-red-400" : "text-blue-400";
  let mainDisplayValue = isOverdue ? `+${timeLeft}` : timeLeft;
  let bottomMessage = t("out_of_time", { time: expectedMinutes });

  if (isCompleted) {
    if (isOverdue) {
      // Completed but late -> Red, show total time? Or show overload?
      // User asked for "total time the mission took".
      mainDisplayValue = elapsedMinutes;
      labelText = t("minutes");
      // Keep Red colors from default isOverdue logic
    } else {
      // Completed on time -> Green, show total time
      strokeColor = "#10b981"; // Emerald-500
      textColor = "text-emerald-600";
      subTextColor = "text-emerald-400";
      mainDisplayValue = elapsedMinutes;
      labelText = t("minutes");
      bottomMessage = t("completed_on_time");
    }
  }

  const radius = 75; // Increased radius to push the line closer to the edge
  const circumference = 2 * Math.PI * radius;

  // For completed, we want full circle (offset 0).
  // For others, calculate based on percentage.
  const strokeDashoffsetReverse =
    isOverdue || isCompleted ? 0 : circumference * (1 - (1 - percentage));

  return (
    /* Reduced container size from w-48 to w-40 */
    <div className="relative w-40 h-40 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
        {/* Background Track - Thinner stroke (4) */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#F1F5F9"
          strokeWidth="4"
        />
        {/* Progress Circle - Thinner stroke (4) */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffsetReverse}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      <div className="absolute flex flex-col items-center text-center">
        <div className="flex flex-col items-center">
          <span className={`text-4xl font-black ${textColor}`}>
            {mainDisplayValue}
          </span>
          <span className={`text-sm font-bold ${subTextColor} -mt-1`}>
            {labelText}
          </span>
        </div>
        <span className="text-[10px] font-medium text-slate-300 mt-3 whitespace-nowrap">
          {bottomMessage}
        </span>
      </div>
    </div>
  );
}
