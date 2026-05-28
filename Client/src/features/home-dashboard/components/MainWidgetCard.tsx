import { MAIN_WIDGET_CARD_MIN_HEIGHT_PX } from "@/features/home-dashboard/constants";
import { cn } from "@/lib/utils";

interface MainWidgetCardProps {
  title: string;
  children: React.ReactNode;
  bodyClassName?: string;
  className?: string;
}

/** Shared shell so main-row widgets share the same height as the chart card. */
export function MainWidgetCard({
  title,
  children,
  bodyClassName,
  className,
}: MainWidgetCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col rounded-2xl border border-[#E7ECF6] bg-white p-5",
        className,
      )}
      style={{ minHeight: MAIN_WIDGET_CARD_MIN_HEIGHT_PX }}
    >
      <h3 className="mb-4 shrink-0 text-right text-[15px] font-bold text-[#2D3A58]">
        {title}
      </h3>
      <div className={cn("min-h-0 flex-1", bodyClassName)}>{children}</div>
    </div>
  );
}
