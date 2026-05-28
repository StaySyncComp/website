import {
  createRecurringCall,
  deleteRecurringCall,
  fetchRecurringCallsParams,
  updateRecurringCall,
} from "@/features/calls/api/recurring";
import { getRecurringCallColumns } from "@/features/calls/config/recurring-call-columns";
import { getRecurringCallFields } from "@/features/calls/config/recurring-call-fields";
import { recurringCallFormSchema } from "@/features/calls/schemas/recurring-call-form-schema";
import DataTable from "@/components/common/data-table";
import { OrganizationsContext } from "@/features/organization/context/organization-context";
import { useLocations } from "@/features/organization/hooks/useLocations";
import { useLocalizedMap } from "@/hooks/useLocalizedMap";
import DynamicForm from "@/components/common/dynamic-form/DynamicForm";
import { RecurringCall } from "@/types/api/calls";
import { TableAction } from "@/types/ui/data-table-types";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { CallsTab, CallsTopBar } from "@/features/calls/components/CallsTopBar";

interface RecurringCallTableProps {
  activeTab: CallsTab;
  onTabChange: (tab: CallsTab) => void;
}

export default function RecurringCallTable({
  activeTab,
  onTabChange,
}: RecurringCallTableProps) {
  const { departments, callCategories } = useContext(OrganizationsContext);
  const { locations } = useLocations();
  const { t, i18n } = useTranslation();

  const departmentsMap = useLocalizedMap(departments);
  const categoriesMap = useLocalizedMap(callCategories);
  const locationsMap = useLocalizedMap(locations);
  const columns = getRecurringCallColumns(
    t,
    categoriesMap,
    departmentsMap,
    locationsMap,
  );
  const fields = getRecurringCallFields(
    t,
    i18n.language as "he" | "en" | "ar",
    locations,
    callCategories,
  );
  const actions: TableAction<RecurringCall>[] = [
    { label: "Edit", type: "edit" },
    { type: "delete", label: "Delete" },
  ];
  const [advancedFilters, setAdvancedFilters] = useState<Record<string, any>>(
    {},
  );

  const allowedTypes = ["select", "date", "text", "number", "checkbox"];
  const advancedFields = fields
    .filter((f) => allowedTypes.includes(f.type))
    .map((f) => ({
      name: f.name,
      label: f.label,
      type: f.type as "select" | "date" | "text" | "number" | "checkbox",
      options: f.options,
      placeholder: f.label,
    }));

  const exportColumns = columns.map((col: any) => ({
    id: col.accessorKey || col.id,
    label: typeof col.header === "string" ? col.header : undefined,
  }));

  const departmentOptions = departments.map((dep) => ({
    id: dep.id,
    name:
      typeof dep.name === "object"
        ? dep.name[i18n.language as "he" | "en" | "ar"] || dep.name.en || ""
        : dep.name || "",
  }));

  return (
    <DataTable
      fetchData={fetchRecurringCallsParams}
      addData={createRecurringCall}
      updateData={updateRecurringCall}
      deleteData={deleteRecurringCall}
      idField="id"
      columns={columns}
      actions={actions}
      showAddButton={false}
      advancedFilters={advancedFilters}
      setAdvancedFilters={setAdvancedFilters}
      renderToolbar={({ globalFilter, setGlobalFilter, toggleAddRow }) => (
        <CallsTopBar
          activeTab={activeTab}
          onTabChange={onTabChange}
          onCreate={toggleAddRow}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          advancedFields={advancedFields}
          onAdvancedApply={setAdvancedFilters}
          onQuickDateApply={({ createdAtFrom, createdAtTo }) =>
            setAdvancedFilters((prev) => ({
              ...prev,
              createdAtFrom,
              createdAtTo,
            }))
          }
          departments={departmentOptions}
          onDepartmentsApply={(departmentIds) =>
            setAdvancedFilters((prev) => {
              const next = { ...prev } as Record<string, unknown>;
              if (departmentIds.length === 0) {
                delete next.departmentId;
              } else {
                next.departmentId = Number(departmentIds[0]);
              }
              return next;
            })
          }
          exportFilename="recurring_calls.csv"
          exportColumns={exportColumns}
        />
      )}
      renderExpandedContent={({ rowData, handleEdit, handleSave }) => {
        const mode = rowData?.id ? "edit" : "create";
        return (
          <DynamicForm
            mode={mode}
            fields={fields}
            validationSchema={recurringCallFormSchema}
            defaultValues={rowData}
            onSubmit={async (data: z.infer<typeof recurringCallFormSchema>) => {
              const department = callCategories.find(
                // @ts-ignore
                (category) => category.id === data.callCategoryId,
              )?.departmentId;
              const payload = {
                ...data,
                departmentId: department,
                id: rowData?.id,
              } as any;
              if (mode === "create" && handleSave) await handleSave(payload);
              else if (mode === "edit" && handleEdit) await handleEdit(payload);
            }}
          />
        );
      }}
    />
  );
}
