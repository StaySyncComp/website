import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const FilterPill = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, className, type = "button", ...props }, ref) => {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-full border border-[#C9D4F6] bg-white px-4 text-[13px] font-medium text-[#5B6378] transition-colors hover:bg-[#F4F7FD]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});

FilterPill.displayName = "FilterPill";
