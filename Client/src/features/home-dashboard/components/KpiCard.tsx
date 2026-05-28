import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KpiCardProps {
  title: string;
  value: number;
  delta: string;
  compare: string;
  isRtl: boolean;
}

export function KpiCard({ title, value, delta, compare, isRtl }: KpiCardProps) {
  const contentIsRtl =
    isRtl || /[\u0590-\u08FF]/.test(`${title} ${compare}`);

  return (
    <div
      dir={contentIsRtl ? "rtl" : "ltr"}
      className="rounded-[24px] border border-[#D8E5FF] bg-white px-6 py-5"
    >
      <div className="mb-4 flex items-start justify-between">
        <h4 className="text-[11px] leading-[18px] text-[#22386E]">{title}</h4>
        <Phone className="size-[16px] text-[#0078FF]" strokeWidth={2.1} />
      </div>
      <div
        className={cn(
          "mb-2 flex w-full",
          contentIsRtl ? "text-right" : "text-left",
        )}
      >
        {contentIsRtl ? (
          <div className="ml-auto flex items-end gap-2">
            <div className="text-[22px] font-bold leading-[24px] text-[#2B344E]">
              {value}
            </div>
            <div className="rounded-[8px] bg-[#EDFFED] px-2 py-[1px] text-[12px] leading-[18px] text-[#12C24D]">
              {delta}
            </div>
          </div>
        ) : (
          <div className="mr-auto flex items-end gap-2">
            <div className="rounded-[8px] bg-[#EDFFED] px-2 py-[1px] text-[13px] font-semibold leading-[18px] text-[#12C24D]">
              {delta}
            </div>
            <div className="text-[22px] font-extrabold leading-[24px] text-[#2B344E]">
              {value}
            </div>
          </div>
        )}
      </div>
      <p
        className={cn(
          "text-[11px] font-medium leading-[16px] text-[#9AA6C5]",
          contentIsRtl ? "text-right" : "text-left",
        )}
      >
        {compare}
      </p>
    </div>
  );
}
