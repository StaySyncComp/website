import { useTranslation } from "react-i18next";
import { Call } from "@/types/api/calls";
import {
  updateCall,
  createCall,
  deleteCall,
  fetchCallsParams,
} from "@/features/calls/api";
import DataTable from "@/components/common/data-table";
import { useContext, useState } from "react";
import { OrganizationsContext } from "@/features/organization/context/organization-context";
import { TableAction } from "@/types/ui/data-table-types";
import { getCallColumns } from "@/features/calls/config/call-columns";
import { useLocations } from "@/features/organization/hooks/useLocations";
import { getCallFields } from "@/features/calls/config/call-fields";
import { callFormSchema } from "@/features/calls/schemas/call-form-schema";
import DynamicForm from "@/components/common/dynamic-form/DynamicForm";
import { z } from "zod";
import { useUser } from "@/features/auth/hooks/useUser";
import { AdvancedSearchFieldConfig } from "@/types/advanced-search";
import { CallsTab, CallsTopBar } from "@/features/calls/components/CallsTopBar";

interface CallTableProps {
  selectedCall: Call | null;
  onSelect: (call: Call | null) => void;
  activeTab: CallsTab;
  onTabChange: (tab: CallsTab) => void;
}

export default function CallTable({
  selectedCall,
  onSelect,
  activeTab,
  onTabChange,
}: CallTableProps) {
  const { departments, callCategories } = useContext(OrganizationsContext);
  const { locations } = useLocations();
  const { allUsers } = useUser();
  const { t, i18n } = useTranslation();

  const statusOptions = Object.entries({
    OPENED: t("status_open"),
    IN_PROGRESS: t("status_in_progress"),
    COMPLETED: t("status_completed"),
    FAILED: t("status_failed"),
    ON_HOLD: t("status_on_hold"),
  }).map(([value, label]) => ({ value, label }));

  const [refreshKey, setRefreshKey] = useState(0);
  const [sorting, setSorting] = useState([{ id: "status", desc: false }]);
  const [advancedFilters, setAdvancedFilters] = useState<
    Record<string, unknown>
  >({});

  const columns = getCallColumns(t, i18n, statusOptions);
  const fields = getCallFields(
    t,
    i18n.language as "he" | "en" | "ar",
    locations,
    callCategories,
    allUsers,
    statusOptions,
  );

  const actions: TableAction<Call>[] = [
    { label: "Edit", type: "edit" },
    { type: "delete", label: "Delete" },
  ];

  const advancedFields: AdvancedSearchFieldConfig[] = [
    {
      name: "status",
      label: t("status"),
      type: "select",
      options: statusOptions,
      placeholder: t("select_status"),
    },
    {
      name: "callCategoryId",
      label: t("call_category"),
      type: "select",
      options: callCategories.map((cat) => ({
        value: cat.id,
        label:
          typeof cat.name === "object"
            ? cat.name[i18n.language as "he" | "en" | "ar"] || cat.name.en || ""
            : cat.name || "",
      })),
      placeholder: t("select_category"),
    },
    {
      name: "departmentId",
      label: t("department"),
      type: "select",
      options: departments.map((dep) => ({
        value: dep.id,
        label:
          typeof dep.name === "object"
            ? dep.name[i18n.language as "he" | "en" | "ar"] || dep.name.en || ""
            : dep.name || "",
      })),
      placeholder: t("select_department"),
    },
    {
      name: "locationId",
      label: t("location"),
      type: "select",
      options: locations.map((loc) => ({
        value: loc.id,
        label:
          typeof loc.name === "object"
            ? loc.name[i18n.language as "he" | "en" | "ar"] || loc.name.en || ""
            : loc.name || "",
      })),
      placeholder: t("select_location"),
    },
    {
      name: "createdAtFrom",
      label: t("created_at_from"),
      type: "date",
    },
    {
      name: "createdAtTo",
      label: t("created_at_to"),
      type: "date",
    },
    {
      name: "description",
      label: t("description"),
      type: "text",
      placeholder: t("search_description"),
    },
  ];

  const fetchData = async (params: Record<string, unknown>) => {
    const mergedParams = { ...params, ...advancedFilters };
    Object.keys(mergedParams).forEach(
      (key) =>
        (mergedParams[key] === "" || mergedParams[key] == null) &&
        delete mergedParams[key],
    );

    const response = await fetchCallsParams(mergedParams);
    if (Array.isArray(response)) {
      return { data: response };
    }
    return response;
  };

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
    <div className="flex-1 flex flex-col">
      <DataTable<Call>
        columns={columns}
        websocketUrl="/ws/calls"
        //@ts-expect-error fix later
        fetchData={fetchData}
        addData={createCall}
        updateData={updateCall}
        deleteData={deleteCall}
        actions={actions}
        idField="id"
        showAddButton={false}
        key={refreshKey}
        sorting={sorting}
        onSortingChange={setSorting}
        advancedFilters={advancedFilters}
        setAdvancedFilters={setAdvancedFilters}
        onRowClick={(row) => onSelect(row.original)}
        selectedRowId={selectedCall?.id}
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
            exportFilename="calls.csv"
            exportColumns={exportColumns}
          />
        )}
        renderEditContent={({ rowData, handleSave, handleEdit }) => {
          const mode = rowData?.id ? "edit" : "create";
          const filteredFields = fields.filter((f) => f.name !== "status");
          return (
            <DynamicForm
              mode={mode}
              headerKey="call"
              fields={filteredFields}
              validationSchema={callFormSchema.omit({ status: true })}
              defaultValues={rowData}
              onSubmit={async (data: z.infer<typeof callFormSchema>) => {
                const department = callCategories.find(
                  (category) =>
                    Number(category.id) === Number(data.callCategoryId),
                )?.departmentId;
                const status = data.assignedToId ? "IN_PROGRESS" : "OPENED";
                const payload = {
                  ...data,
                  departmentId: department,
                  status,
                  id: rowData?.id,
                  locationId: Number(data.locationId),
                  callCategoryId: Number(data.callCategoryId),
                  assignedToId: data.assignedToId
                    ? Number(data.assignedToId)
                    : undefined,
                } as unknown as Partial<Call>;
                if (handleSave && mode === "create") await handleSave(payload);
                if (handleEdit && mode === "edit") await handleEdit(payload);
                if (mode === "create") setRefreshKey((k) => k + 1);
              }}
            />
          );
        }}
      />
    </div>
  );
}
