import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { DashboardWidgetType } from "@/types/api/dashboardPreferences";

interface SortableWidgetShellProps {
  id: DashboardWidgetType;
  isEditMode: boolean;
  onRemove: () => void;
  className?: string;
  children: React.ReactNode;
}

export function SortableWidgetShell({
  id,
  isEditMode,
  onRemove,
  className,
  children,
}: SortableWidgetShellProps) {
  const { t } = useTranslation();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isEditMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative h-full",
        isDragging && "z-30 opacity-90",
        className,
      )}
    >
      {isEditMode && (
        <>
          <button
            type="button"
            onClick={onRemove}
            className="absolute -left-1 -top-1 z-40 flex size-6 items-center justify-center rounded-full border border-[#E1E6F3] bg-white text-[#8B95AD] shadow-sm hover:bg-[#FFF0F0] hover:text-[#E74C3C]"
            aria-label={t("home_dashboard.remove_widget")}
          >
            <X className="size-3.5" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            className="absolute -right-1 top-1/2 z-40 flex size-7 -translate-y-1/2 cursor-grab items-center justify-center rounded-full border border-[#E1E6F3] bg-white text-[#8B95AD] shadow-sm active:cursor-grabbing"
            aria-label={t("home_dashboard.drag_to_reorder")}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-4" />
          </button>
        </>
      )}
      <div
        className={cn(
          "h-full",
          isEditMode &&
            "animate-[widget-shake_0.35s_ease-in-out_infinite]",
        )}
      >
        {children}
      </div>
    </div>
  );
}
