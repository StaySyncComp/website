import { flexRender } from "@tanstack/react-table";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { GetDirection } from "@/lib/i18n";
import Pagination from "./Pagination";
import { useContext } from "react";
import { DataTableContext } from "@/components/common/data-table/data-table-context";

function DataTableHeader() {
  const direction = GetDirection();
  const { table, enhancedActions: actions } = useContext(DataTableContext);
  const firstColumnRounding = direction ? "rounded-r-lg" : "rounded-l-lg";
  const lastColumnRounding = direction ? "rounded-l-lg" : "rounded-r-lg";
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="border-none h-11">
          {headerGroup.headers.map((header, index) => {
            const isFirst = index === 0;
            return (
              <TableHead
                key={header.id}
                className={`bg-foreground text-surface whitespace-nowrap ${
                  isFirst && firstColumnRounding
                }`}
                style={{
                  width: header.getSize(),
                }}
              >
                {!header.isPlaceholder && (
                  <div
                    className={`flex items-center gap-1 ${
                      header.column.getCanSort() && "cursor-pointer select-none"
                    } ${isFirst && "px-8"}`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getCanSort() &&
                      (header.column.getIsSorted() === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : header.column.getIsSorted() === "desc" ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : null)}
                  </div>
                )}
              </TableHead>
            );
          })}
          {actions && actions.length > 0 && (
            <TableHead
              className={`overflow-hidden bg-foreground px-3 text-surface sm:px-4 ${lastColumnRounding}`}
            >
              <div className="flex w-full min-w-[12rem] justify-center">
                <Pagination table={table} />
              </div>
            </TableHead>
          )}
        </TableRow>
      ))}
    </TableHeader>
  );
}

export default DataTableHeader;
