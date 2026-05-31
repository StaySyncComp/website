import { memo, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RoomColumnLayoutProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  showDivider?: boolean;
}

export const RoomColumnLayout = memo<RoomColumnLayoutProps>(
  ({ icon, title, children, footer, className, showDivider = true }) => (
    <div
      className={cn(
        "flex flex-col overflow-hidden min-h-0 bg-white",
        showDivider && "border-s border-[#E8ECF1]",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-5 pt-5 pb-3 shrink-0">
        <h3 className="font-bold text-[#1E293B] text-[15px]">{title}</h3>
        {icon}
      </div>

      <div className="flex-1 overflow-y-auto px-5 min-h-0">{children}</div>

      {footer && (
        <div className="px-5 pb-5 pt-3 shrink-0">{footer}</div>
      )}
    </div>
  ),
);

RoomColumnLayout.displayName = "RoomColumnLayout";

interface RoomSectionDividerProps {
  label: string;
}

export const RoomSectionDivider = memo<RoomSectionDividerProps>(({ label }) => (
  <div className="flex items-center gap-3 my-4">
    <div className="flex-1 h-px bg-[#E2E8F0]" />
    <span className="text-[11px] text-[#94A3B8] font-medium whitespace-nowrap">
      {label}
    </span>
    <div className="flex-1 h-px bg-[#E2E8F0]" />
  </div>
));

RoomSectionDivider.displayName = "RoomSectionDivider";
