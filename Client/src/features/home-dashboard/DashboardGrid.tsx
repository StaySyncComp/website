import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useDashboardEdit } from "@/features/home-dashboard/DashboardEditContext";
import { SortableWidgetShell } from "@/features/home-dashboard/components/SortableWidgetShell";
import { KpiWidget } from "@/features/home-dashboard/widgets/KpiWidget";
import { ChartWidget } from "@/features/home-dashboard/widgets/ChartWidget";
import { TopEmployeesWidget } from "@/features/home-dashboard/widgets/TopEmployeesWidget";
import type { DashboardWidgetType } from "@/types/api/dashboardPreferences";
import { getMainWidgetColClass } from "@/features/home-dashboard/constants";
import { cn } from "@/lib/utils";

function renderWidget(type: DashboardWidgetType, isRtl: boolean) {
  if (type.startsWith("kpi_")) {
    return <KpiWidget type={type} isRtl={isRtl} />;
  }
  if (type === "chart_open_completed") {
    return <ChartWidget />;
  }
  if (type === "top_employees") {
    return <TopEmployeesWidget />;
  }
  return null;
}

interface DashboardGridProps {
  isRtl: boolean;
}

export function DashboardGrid({ isRtl }: DashboardGridProps) {
  const {
    config,
    isEditMode,
    removeWidget,
    setKpiOrder,
    setMainOrder,
  } = useDashboardEdit();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const kpiVisible = config.kpiOrder;
  const mainVisible = config.mainOrder;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id as DashboardWidgetType;
    const overId = over.id as DashboardWidgetType;

    if (kpiVisible.includes(activeId) && kpiVisible.includes(overId)) {
      const oldIndex = kpiVisible.indexOf(activeId);
      const newIndex = kpiVisible.indexOf(overId);
      setKpiOrder(arrayMove(kpiVisible, oldIndex, newIndex));
      return;
    }

    if (mainVisible.includes(activeId) && mainVisible.includes(overId)) {
      const oldIndex = mainVisible.indexOf(activeId);
      const newIndex = mainVisible.indexOf(overId);
      setMainOrder(arrayMove(mainVisible, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={kpiVisible}
        strategy={horizontalListSortingStrategy}
      >
        <div
          className={cn(
            "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
            isEditMode && "touch-none",
          )}
        >
          {kpiVisible.map((type) => (
            <SortableWidgetShell
              key={type}
              id={type}
              isEditMode={isEditMode}
              onRemove={() => removeWidget(type)}
            >
              {renderWidget(type, isRtl)}
            </SortableWidgetShell>
          ))}
        </div>
      </SortableContext>

      {mainVisible.length > 0 && (
        <SortableContext items={mainVisible} strategy={rectSortingStrategy}>
          <div
            className={cn(
              "mt-4 grid grid-cols-1 gap-4 lg:grid-cols-10 lg:items-stretch",
              isEditMode && "touch-none",
            )}
          >
            {mainVisible.map((type) => (
              <SortableWidgetShell
                key={type}
                id={type}
                isEditMode={isEditMode}
                onRemove={() => removeWidget(type)}
                className={cn(
                  "h-full",
                  getMainWidgetColClass(type, mainVisible.length),
                )}
              >
                {renderWidget(type, isRtl)}
              </SortableWidgetShell>
            ))}
          </div>
        </SortableContext>
      )}
    </DndContext>
  );
}
