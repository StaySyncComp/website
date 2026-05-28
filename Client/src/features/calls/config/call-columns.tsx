import { ColumnDef } from "@tanstack/react-table";
import { Call } from "@/types/api/calls";
import { i18n, TFunction } from "i18next";
import { formatDateTime } from "@/lib/dateUtils";
import { StatusBadge } from "@/components/common/data-table/StatusBadge";
import { Repeat } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function isFromRecurringSchedule(call: Call): boolean {
  return call.recurringCallId != null && Number(call.recurringCallId) > 0;
}

export const getCallColumns = (
  t: TFunction,
  i18n: i18n,
  statusOptions: { label: string; value: string }[],
): ColumnDef<Call>[] => [
  {
    accessorKey: "callCategoryId",
    header: t("call_category"),
    cell: ({ row }) => {
      const call = row.original;
      const fromRecurring = isFromRecurringSchedule(call);
      //@ts-ignore
      const categoryName =
        call.callCategory?.name?.[i18n.language as "he" | "en" | "ar"] || "-";

      return (
        <div className="flex items-center gap-1.5">
          {fromRecurring ? (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-[#2F80ED]"
                    aria-label={t("call_from_recurring")}
                  >
                    <Repeat className="size-3.5" strokeWidth={2.2} />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {t("call_from_recurring")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
          <span>{categoryName}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "description",
    header: t("description"),
    cell: ({ row }) => {
      const description = row.original.description || "-";
      return (
        <div className="w-32 truncate" title={description}>
          {description}
        </div>
      );
    },
  },
  {
    accessorKey: "locationId",
    header: t("location"),
    cell: ({ row }) =>
      //@ts-ignore
      row.original.location?.name?.[i18n.language as "he" | "en" | "ar"] || "-",
  },
  {
    accessorKey: "departmentId",
    header: t("department"),
    cell: ({ row }) => (
      <div className="bg-background w-fit px-3 rounded-md">
        {/* @ts-ignore */}
        {row.original.Department?.name?.[i18n.language as "he" | "en" | "ar"] ||
          "-"}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: t("created_at"),
    // @ts-ignore
    cell: ({ row }) => formatDateTime(row.original.createdAt),
  },
  {
    accessorKey: "status",
    header: t("status"),
    cell: ({ row }) => {
      const option = statusOptions.find(
        (s) => s.value === row.original.status,
      ) || { label: "-", value: "" };
      return <StatusBadge option={option} />;
    },
  },

  {
    id: "timeStatus",
    header: t("time_status"),
    cell: ({ row }) => {
      const call = row.original;
      //@ts-ignore
      if (!call.callCategory?.expectedTime || !call.createdAt) return null;

      // @ts-ignore
      const createdAt = new Date(call.createdAt);
      //@ts-ignore
      const expectedTime = call.callCategory.expectedTime;
      const now = new Date();

      let elapsed, percent, text;

      // Calculate elapsed time
      // @ts-ignore
      if (call.status === "COMPLETED" && call.closedAt) {
        elapsed = Math.floor(
          // @ts-ignore
          (new Date(call.closedAt).getTime() - createdAt.getTime()) /
            (1000 * 60),
        );
      } else {
        elapsed = Math.floor(
          (now.getTime() - createdAt.getTime()) / (1000 * 60),
        );
      }

      // Calculate progress percentage (0-100%)
      const progressPercent = (elapsed / expectedTime) * 100;
      const isFinished =
        call.status === "COMPLETED" || call.status === "FAILED";
      const isOverdue = elapsed > expectedTime;
      const isNearLimit = progressPercent > 85 && !isOverdue;

      // Determine colors based on time progress (like the half circle)
      let colorConfig;
      if (isFinished) {
        colorConfig = isOverdue
          ? {
              barColor: "bg-red-500",
              dotColor: "bg-red-600",
              textColor: "text-red-700",
            }
          : {
              barColor: "bg-emerald-500",
              dotColor: "bg-emerald-600",
              textColor: "text-emerald-700",
            };
      } else if (isOverdue) {
        colorConfig = {
          barColor: "bg-red-500",
          dotColor: "bg-red-600",
          textColor: "text-red-700",
        };
      } else if (isNearLimit) {
        colorConfig = {
          barColor: "bg-amber-500",
          dotColor: "bg-amber-600",
          textColor: "text-amber-700",
        };
      } else {
        colorConfig = {
          barColor: "bg-blue-500",
          dotColor: "bg-blue-600",
          textColor: "text-blue-700",
        };
      }

      // Determine text based on status and time
      if (call.status === "COMPLETED") {
        const diff = elapsed - expectedTime;
        text = `${t("time_took")}: ${elapsed} ${t("minutes")}`;
        if (diff > 0) {
          text = `${diff} ${t("minutes_over_expected")}`;
        }
      } else if (call.status === "ON_HOLD") {
        text = `${t("call_on_hold_after")}: ${elapsed} ${t("minutes")}`;
      } else if (call.status === "FAILED") {
        const diff = elapsed - expectedTime;
        text = `${t("call_failed_after")}: ${elapsed} ${t("minutes")}`;
        if (diff > 0) {
          text += ` (+${diff} ${t("minutes_over_expected")})`;
        }
      } else {
        // Active calls
        if (elapsed <= expectedTime) {
          const remaining = expectedTime - elapsed;
          text =
            remaining > 0
              ? `${remaining} ${t("minutes")} ${t("left")}`
              : `${elapsed} ${t("minutes")}`;
        } else {
          const overtime = elapsed - expectedTime;
          text = `${t("time_exceeded")}: +${overtime} ${t("minutes")}`;
        }
      }

      // Set progress bar percentage
      if (isFinished) {
        percent = 100;
      } else {
        percent = Math.min(progressPercent, 100);
      }

      return (
        <div className="flex flex-col min-w-[120px]">
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full ${colorConfig.dotColor}`} />
            <span className={`text-xs font-medium ${colorConfig.textColor}`}>
              {text}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded">
            <div
              className={`h-2 rounded ${colorConfig.barColor}`}
              style={{ width: `${percent}%`, transition: "width 0.5s" }}
            />
          </div>
        </div>
      );
    },
  },
];
