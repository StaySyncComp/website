import { useContext, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Download,
  LayoutGrid,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { OrganizationsContext } from "@/features/organization/context/organization-context";
import { FilterPill } from "@/features/home-dashboard/components/FilterPill";
import {
  useDashboardEdit,
  useDashboardFilters,
} from "@/features/home-dashboard/DashboardEditContext";
import { extractArray } from "@/features/home-dashboard/utils/dataUtils";
import { Department } from "@/types/api/departments";
import type { QuickDatePreset } from "@/types/api/dashboardPreferences";
import { cn } from "@/lib/utils";

const PRESET_KEYS: Record<QuickDatePreset, string> = {
  "7d": "home_dashboard.preset_7d",
  "1m": "home_dashboard.preset_1m",
  "3m": "home_dashboard.preset_3m",
  "6m": "home_dashboard.preset_6m",
  "9m": "home_dashboard.preset_9m",
  "1y": "home_dashboard.preset_1y",
};

interface HomeToolbarProps {
  rangeLabel: string;
}

export function HomeToolbar({ rangeLabel }: HomeToolbarProps) {
  const { t, i18n } = useTranslation();
  const { departments } = useContext(OrganizationsContext);
  const { preset, departmentId, setPreset, setDepartmentId } =
    useDashboardFilters();
  const {
    isEditMode,
    isSaving,
    enterEditMode,
    cancelEdit,
    saveLayout,
  } = useDashboardEdit();

  const [departmentSearch, setDepartmentSearch] = useState("");
  const [isDepartmentsOpen, setIsDepartmentsOpen] = useState(false);

  const departmentList = useMemo(
    () => extractArray<Department>(departments),
    [departments],
  );

  const departmentOptions = useMemo(
    () =>
      departmentList.map((dep) => ({
        id: dep.id,
        name:
          dep.name[i18n.language as "he" | "en" | "ar"] ||
          dep.name.en ||
          dep.name.he ||
          "",
      })),
    [departmentList, i18n.language],
  );

  const filteredDepartments = useMemo(() => {
    const query = departmentSearch.trim().toLowerCase();
    if (!query) return departmentOptions;
    return departmentOptions.filter((dep) =>
      dep.name.toLowerCase().includes(query),
    );
  }, [departmentOptions, departmentSearch]);

  const departmentsLabel =
    departmentId == null
      ? t("home_dashboard.all_departments")
      : departmentOptions.find((d) => String(d.id) === String(departmentId))
          ?.name || t("home_dashboard.department");

  const chooseDepartment = (id: number | null) => {
    setDepartmentId(id);
    setIsDepartmentsOpen(false);
    setDepartmentSearch("");
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-[#E7ECF6] bg-white px-3 py-3">
      <div className="flex items-center gap-2">
        <div className="inline-flex h-9 items-center overflow-hidden rounded-full border border-[#C9D4F6] bg-white text-[13px] font-medium text-[#5B6378]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex h-full items-center gap-2 px-4 transition-colors hover:bg-[#F4F7FD]"
              >
                <span>{t(PRESET_KEYS[preset])}</span>
                <ChevronDown className="size-[14px] text-[#A4ADC2]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[170px]">
              {(Object.keys(PRESET_KEYS) as QuickDatePreset[]).map((key) => (
                <DropdownMenuItem key={key} onClick={() => setPreset(key)}>
                  {t(PRESET_KEYS[key])}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="h-5 w-px bg-[#E2E8F3]" />
          <span className="inline-flex h-full items-center gap-2 px-4">
            <span>{rangeLabel}</span>
            <CalendarDays className="size-[14px] text-[#8593AE]" />
          </span>
        </div>
        <Popover
          open={isDepartmentsOpen}
          onOpenChange={(open) => {
            setIsDepartmentsOpen(open);
            if (!open) setDepartmentSearch("");
          }}
        >
          <PopoverAnchor asChild>
            <FilterPill onClick={() => setIsDepartmentsOpen((open) => !open)}>
              <span>{departmentsLabel}</span>
              <ChevronDown
                className="size-[14px] text-[#A4ADC2]"
                strokeWidth={2}
              />
            </FilterPill>
          </PopoverAnchor>
          <PopoverContent align="end" className="w-[260px] p-2">
            <div className="px-1 pb-2">
              <input
                value={departmentSearch}
                onChange={(e) => setDepartmentSearch(e.target.value)}
                placeholder={t("home_dashboard.department_search_placeholder")}
                className="h-8 w-full rounded-md border border-[#D8DFEF] bg-white px-2 text-sm outline-none focus:border-[#2F80ED]"
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
            <div className="max-h-56 overflow-auto px-1">
              <button
                type="button"
                onClick={() => chooseDepartment(null)}
                className={cn(
                  "mb-1 flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted",
                  departmentId == null && "bg-muted/60 font-medium",
                )}
              >
                <span>{t("home_dashboard.all_departments")}</span>
                {departmentId == null ? (
                  <span className="text-xs text-[#2F80ED]">
                    {t("home_dashboard.selected")}
                  </span>
                ) : null}
              </button>
              {filteredDepartments.length === 0 ? (
                <div className="px-2 py-2 text-xs text-muted-foreground">
                  {t("home_dashboard.no_departments")}
                </div>
              ) : (
                filteredDepartments.map((department) => {
                  const selected =
                    departmentId != null &&
                    String(departmentId) === String(department.id);
                  return (
                    <button
                      type="button"
                      key={department.id}
                      onClick={() => chooseDepartment(Number(department.id))}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted",
                        selected && "bg-muted/60 font-medium",
                      )}
                    >
                      <span>{department.name}</span>
                      {selected ? (
                        <span className="text-xs text-[#2F80ED]">
                          {t("home_dashboard.selected")}
                        </span>
                      ) : null}
                    </button>
                  );
                })
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-2">
        {isEditMode ? (
          <>
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex h-9 items-center rounded-full border border-[#E1E6F3] bg-white px-4 text-[13px] font-medium text-[#5D6884] hover:bg-[#F7F9FE]"
            >
              {t("home_dashboard.cancel")}
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => void saveLayout()}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-[#2F80ED] px-4 text-[13px] font-medium text-white shadow-[0_4px_10px_-3px_rgba(47,128,237,0.45)] hover:bg-[#1f6fd8] disabled:opacity-60"
            >
              {isSaving
                ? t("home_dashboard.saving")
                : t("home_dashboard.done")}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={enterEditMode}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-[#E1E6F3] bg-white px-4 text-[13px] font-medium text-[#5D6884] hover:bg-[#F7F9FE]"
            >
              <span>{t("home_dashboard.edit_widgets")}</span>
              <LayoutGrid
                className="size-[14px] text-[#95A2BD]"
                strokeWidth={2}
              />
            </button>
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-full bg-[#2F80ED] px-4 text-[13px] font-medium text-white shadow-[0_4px_10px_-3px_rgba(47,128,237,0.45)] hover:bg-[#1f6fd8]"
            >
              <span>{t("home_dashboard.export_excel")}</span>
              <Download className="size-[14px]" strokeWidth={2.2} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
