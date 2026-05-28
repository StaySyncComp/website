import { useState, useEffect } from "react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table";
import { Table } from "@/components/ui/table";
import DataTableBody from "./data-table-body/data-table-body";
import DataTableHeader from "./data-table-header";
import { DataTableSearch } from "./data-table-search";
import { DataTableAddButton } from "./data-table-add-button";
import { DataTableProps } from "@/types/ui/data-table-types";
import { DataTableContext } from "@/components/common/data-table/data-table-context";
import { useTableWebSocket } from "@/hooks/table/useTableWebSocket";
import { useTableCRUD } from "@/hooks/table/useTableCRUD";
import { useDataTableFetch } from "@/hooks/table/useDataTableFetch";
import { useDataTableActions } from "@/hooks/table/useDataTableActions";

export function DataTable<TData>({
  fetchData,
  addData,
  updateData,
  deleteData,
  columns = [],
  searchable = true,
  // @ts-ignore
  isPagination = true,
  showAddButton = false,
  actions = null,
  defaultPageSize = 10,
  renderExpandedContent,
  renderEditContent,
  idField,
  onRowClick,
  selectedRowId,
  initialData,
  rightHeaderContent,
  renderToolbar,
  websocketUrl,
  advancedFilters = {},
}: DataTableProps<TData> & {
  advancedFilters?: Record<string, any>;
  setAdvancedFilters?: (filters: Record<string, any>) => void;
}) {
  const [hasMounted, setHasMounted] = useState(false);
  const [tableData, setTableData] = useState<TData[]>(
    (initialData || []).map((row) => ({ ...row, isEditMode: false }))
  );
  const [totalCount, setTotalCount] = useState<number>(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });
  const [specialRow, setSpecialRow] = useState<"add" | null>(null);
  const [now, setNow] = useState(Date.now());

  // @ts-ignore
  useTableWebSocket(websocketUrl, idField, setTableData);
  const {
    handleAdd,
    handleUpdate,
    handleDelete,
    toggleEditMode,
    // @ts-ignore
    isLoading: crudLoading,
  } = useTableCRUD<TData>({
    idField,
    addData,
    updateData,
    deleteData,
    setTableData,
  });

  const table = useReactTable({
    data: tableData,
    columns,
    columnResizeMode: "onChange",
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    meta: {
      handleAdd,
      handleEdit: handleUpdate,
      handleDelete: handleDelete,
      toggleEditMode,
    },
  });

  const { loadData, isLoading: fetchLoading } = useDataTableFetch<TData>({
    fetchData,
    pagination,
    sorting,
    globalFilter,
    advancedFilters,
    setTableData,
    setTotalCount,
  });
  const isLoading = fetchLoading;

  useEffect(() => {
    const isInitialLoad = !hasMounted && !!initialData;
    loadData(!isInitialLoad);
    if (!hasMounted) setHasMounted(true);
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    globalFilter,
    advancedFilters,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60000); // every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (hasMounted) loadData(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleAddRow = () => {
    setSpecialRow((prev) => (prev === "add" ? null : "add"));
  };

  const { enhancedActions, dropdownActions, externalActions } =
    useDataTableActions<TData>({
      idField,
      // @ts-ignore
      actions,
      handleDelete,
      toggleEditMode,
    });

  return (
    <DataTableContext.Provider
      value={{
        globalFilter,
        pagination,
        setPagination,
        setGlobalFilter,
        setSorting,
        sorting,
        columns,
        table,
        // @ts-ignore
        enhancedActions,
        dropdownActions,
        externalActions,
        renderExpandedContent,
        specialRow,
        handleAdd,
        handleUpdate,
        onRowClick,
        selectedRowId,
        isLoading,
        setSpecialRow,
        renderEditContent,
        toggleEditMode, 
        // @ts-ignore
        idField,
      }}
    >
      <div className="space-y-4">
        {renderToolbar ? (
          renderToolbar({ globalFilter, setGlobalFilter, toggleAddRow })
        ) : (
          <div
            className={`${
              searchable ? "justify-between" : "justify-end"
            } flex flex-wrap items-center gap-3`}
          >
            {searchable && (
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <DataTableSearch
                  globalFilter={globalFilter}
                  setGlobalFilter={setGlobalFilter}
                />
                {rightHeaderContent}
              </div>
            )}
            <DataTableAddButton
              showAddButton={showAddButton}
              onToggleAddRow={toggleAddRow}
            />
          </div>
        )}

        <div className="rounded-lg w-full">
          <Table className="w-full min-w-full border-collapse border-spacing-2 text-right">
            <DataTableHeader />
            <DataTableBody<TData> />
            <span style={{ display: "none" }}>{now}</span>
          </Table>
        </div>
      </div>
    </DataTableContext.Provider>
  );
}

export default DataTable;
