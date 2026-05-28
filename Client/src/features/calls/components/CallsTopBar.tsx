import { forwardRef, useContext, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Download,
  PlusCircle,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import {
  AdvancedSearchModal,
} from "@/components/common/advanced-search/AdvancedSearchModal";
import { AdvancedSearchFieldConfig } from "@/types/advanced-search";
import { DataTableContext } from "@/components/common/data-table/data-table-context";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type CallsTab = "active" | "recurring";
type QuickDatePreset = "7d" | "1m" | "3m" | "6m" | "9m" | "1y";

interface CallsTopBarProps {
  activeTab: CallsTab;
  onTabChange: (tab: CallsTab) => void;
  onCreate: () => void;
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  advancedFields: AdvancedSearchFieldConfig[];
  onAdvancedApply: (values: Record<string, unknown>) => void;
  onQuickDateApply?: (values: { createdAtFrom: string; createdAtTo: string }) => void;
  departments?: { id: string | number; name: string }[];
  onDepartmentsApply?: (departmentIds: Array<string | number>) => void;
  exportFilename?: string;
  exportColumns?: { id: string; label?: string }[];
}

export function CallsTopBar({
  activeTab,
  onTabChange,
  onCreate,
  globalFilter,
  setGlobalFilter,
  advancedFields,
  onAdvancedApply,
  onQuickDateApply,
  departments = [],
  onDepartmentsApply,
  exportFilename = "calls.csv",
  exportColumns,
}: CallsTopBarProps) {
  const { t, i18n } = useTranslation();
  const [preset, setPreset] = useState<QuickDatePreset>("7d");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    string | number | null
  >(null);
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [isDepartmentsOpen, setIsDepartmentsOpen] = useState(false);

  const presetLabels: Record<QuickDatePreset, string> = {
    "7d": "7 ימים אחרונים",
    "1m": "חודש אחרון",
    "3m": "3 חודשים אחרונים",
    "6m": "6 חודשים אחרונים",
    "9m": "9 חודשים אחרונים",
    "1y": "שנה אחרונה",
  };

  const formatRangeDate = (date: Date) =>
    date.toLocaleDateString(i18n.language || "he", {
      month: "short",
      day: "numeric",
    });

  const buildRange = (selectedPreset: QuickDatePreset) => {
    const end = new Date();
    const start = new Date(end);
    if (selectedPreset === "7d") start.setDate(end.getDate() - 7);
    if (selectedPreset === "1m") start.setMonth(end.getMonth() - 1);
    if (selectedPreset === "3m") start.setMonth(end.getMonth() - 3);
    if (selectedPreset === "6m") start.setMonth(end.getMonth() - 6);
    if (selectedPreset === "9m") start.setMonth(end.getMonth() - 9);
    if (selectedPreset === "1y") start.setFullYear(end.getFullYear() - 1);

    return {
      label: `${formatRangeDate(start)} - ${formatRangeDate(end)}`,
      createdAtFrom: start.toISOString(),
      createdAtTo: end.toISOString(),
    };
  };

  const currentRange = buildRange(preset);

  const applyPreset = (nextPreset: QuickDatePreset) => {
    setPreset(nextPreset);
    const range = buildRange(nextPreset);
    onQuickDateApply?.({
      createdAtFrom: range.createdAtFrom,
      createdAtTo: range.createdAtTo,
    });
  };

  const filteredDepartments = useMemo(() => {
    const query = departmentSearch.trim().toLowerCase();
    if (!query) return departments;
    return departments.filter((dep) =>
      String(dep.name || "")
        .toLowerCase()
        .includes(query),
    );
  }, [departments, departmentSearch]);

  const departmentsLabel =
    selectedDepartmentId == null
      ? "כל המחלקות"
      : departments.find((d) => String(d.id) === String(selectedDepartmentId))
          ?.name || "מחלקה";

  const chooseDepartment = (departmentId: string | number | null) => {
    setSelectedDepartmentId(departmentId);
    onDepartmentsApply?.(departmentId == null ? [] : [departmentId]);
    setIsDepartmentsOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Row 1 — filters (right in RTL) + create button (left in RTL) */}
      <div className="mx-3 flex flex-wrap-reverse items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex h-9 items-center overflow-hidden rounded-full border border-[#C9D4F6] bg-white text-[13px] font-medium text-[#5B6378]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-full items-center gap-2 px-4 transition-colors hover:bg-[#F4F7FD]"
                >
                  <span>{presetLabels[preset]}</span>
                  <ChevronDown className="size-[14px] text-[#A4ADC2]" strokeWidth={2} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[170px]">
                <DropdownMenuItem onClick={() => applyPreset("7d")}>
                  7 ימים אחרונים
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => applyPreset("1m")}>
                  חודש אחרון
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => applyPreset("3m")}>
                  3 חודשים אחרונים
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => applyPreset("6m")}>
                  6 חודשים אחרונים
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => applyPreset("9m")}>
                  9 חודשים אחרונים
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => applyPreset("1y")}>
                  שנה אחרונה
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="h-5 w-px bg-[#E2E8F3]" />
            <span className="inline-flex h-full items-center gap-2 px-4">
              <span>{currentRange.label}</span>
              <CalendarDays className="size-[14px] text-[#8593AE]" strokeWidth={1.75} />
            </span>
          </div>
          <Popover
            open={isDepartmentsOpen}
            onOpenChange={(open) => {
              setIsDepartmentsOpen(open);
              if (!open) setDepartmentSearch("");
            }}
          >
            <PopoverTrigger asChild>
              <Pill>
                <span>{departmentsLabel}</span>
                <ChevronDown className="size-[14px] text-[#A4ADC2]" strokeWidth={2} />
              </Pill>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[260px] p-2">
              <div className="px-1 pb-2">
                <input
                  value={departmentSearch}
                  onChange={(e) => setDepartmentSearch(e.target.value)}
                  placeholder="חיפוש מחלקה..."
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
                    selectedDepartmentId == null && "bg-muted/60 font-medium",
                  )}
                >
                  <span>כל המחלקות</span>
                  {selectedDepartmentId == null ? (
                    <span className="text-xs text-[#2F80ED]">נבחר</span>
                  ) : null}
                </button>
                {filteredDepartments.length === 0 ? (
                  <div className="px-2 py-2 text-xs text-muted-foreground">
                    לא נמצאו מחלקות
                  </div>
                ) : (
                  filteredDepartments.map((department) => {
                    const selected =
                      selectedDepartmentId != null &&
                      String(selectedDepartmentId) === String(department.id);
                    return (
                      <button
                        type="button"
                        key={department.id}
                        onClick={() => chooseDepartment(department.id)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted",
                          selected && "bg-muted/60 font-medium",
                        )}
                      >
                        <span>{department.name}</span>
                        {selected ? (
                          <span className="text-xs text-[#2F80ED]">נבחר</span>
                        ) : null}
                      </button>
                    );
                  })
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <button
          type="button"
          onClick={onCreate}
          className="inline-flex h-9 items-center gap-2 rounded-full bg-[#2F80ED] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1f6fd8]"
        >
          <span>{t("create_new") !== "create_new" ? t("create_new") : "צור חדש"}</span>
          <PlusCircle className="size-[18px]" strokeWidth={1.75} />
        </button>
      </div>

      {/* Row 2 — tabs + search (right in RTL) + filter/export (left in RTL) */}
      <div className="flex flex-wrap-reverse items-center justify-between gap-3 rounded-[30px] border border-[#E9EDF5] bg-white p-3">
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            placeholder={
              t("search_calls_placeholder") !== "search_calls_placeholder"
                ? t("search_calls_placeholder")
                : "חיפוש פניות"
            }
          />
          <TabButton
            active={activeTab === "active"}
            onClick={() => onTabChange("active")}
          >
            {t("active_calls")}
          </TabButton>
          <TabButton
            active={activeTab === "recurring"}
            onClick={() => onTabChange("recurring")}
          >
            {t("recurring_calls")}
          </TabButton>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <AdvancedSearchModal
            fields={advancedFields}
            onApply={onAdvancedApply}
            renderTrigger={(open) => (
              <Pill onClick={open}>
                <span>{t("filter") !== "filter" ? t("filter") : "סינון"}</span>
                <ChevronDown className="size-[14px] text-[#A4ADC2]" strokeWidth={2} />
              </Pill>
            )}
          />
          <ExportPill filename={exportFilename} columns={exportColumns} />
        </div>
      </div>
    </div>
  );
}

const Pill = forwardRef<
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

Pill.displayName = "Pill";

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center rounded-full px-4 text-[13px] transition-colors",
        active
          ? "bg-[#2F80ED] font-medium text-white"
          : "border border-[#C9D4F6] bg-white font-normal text-[#7C8CA8] hover:text-[#1F2937]",
      )}
    >
      {children}
    </button>
  );
}

function SearchInput({
  globalFilter,
  setGlobalFilter,
  placeholder,
}: {
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
}) {
  const [value, setValue] = useState(globalFilter);
  const debounced = useDebounce(value, 500);

  useEffect(() => {
    setGlobalFilter(debounced);
  }, [debounced, setGlobalFilter]);

  useEffect(() => {
    setValue(globalFilter);
  }, [globalFilter]);

  return (
    <div className="relative h-9 w-[240px] sm:w-[260px] lg:w-[300px]">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="h-full w-full rounded-full border border-[#E9EDF5] bg-white ps-9 pe-16 text-[13px] text-[#1F2937] placeholder:text-[#9AA3BA] focus:border-[#2F80ED] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]/15 rtl:text-right ltr:text-left"
      />
      <Search className="pointer-events-none absolute top-1/2 size-[14px] -translate-y-1/2 text-[#9AA3BA] rtl:right-3 ltr:left-3" />
      <div className="pointer-events-none absolute top-1/2 flex -translate-y-1/2 items-center gap-1 text-[11px] text-[#A4ADC2] rtl:left-3 ltr:right-3">
        <span className="font-medium text-[#7C8CA8]">/</span>
        <span>לחצו על</span>
      </div>
    </div>
  );
}

function ExportPill({
  filename,
  columns,
}: {
  filename: string;
  columns?: { id: string; label?: string }[];
}) {
  const { table } = useContext(DataTableContext);

  const handleExport = () => {
    const rows = table.getRowModel().rows.map((row: any) => row.original);
    if (!rows || rows.length === 0) return;
    const keys = columns ? columns.map((col) => col.id) : Object.keys(rows[0]);
    const header = columns
      ? columns.map((col) => '"' + (col.label || col.id) + '"').join(",")
      : keys.map((k) => '"' + k + '"').join(",");
    const body = rows
      .map((row: Record<string, unknown>) =>
        keys
          .map((key) => {
            let cell = row[key] as unknown;
            if (cell === null || cell === undefined) cell = "";
            return '"' + String(cell).replace(/"/g, '""') + '"';
          })
          .join(","),
      )
      .join("\r\n");
    const csv = [header, body].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Pill onClick={handleExport}>
      <Download className="size-[14px] text-[#8593AE]" strokeWidth={1.75} />
      <span>ייצוא לאקסל</span>
    </Pill>
  );
}
