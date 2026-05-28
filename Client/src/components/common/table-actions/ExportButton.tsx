import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export interface ExportColumn {
  id: string;
  label?: string;
}

interface ExportButtonProps<T extends Record<string, any> = any> {
  data: T[];
  columns?: ExportColumn[];
  filename?: string;
}

function toCsv<T extends Record<string, any>>(
  data: T[],
  columns?: ExportColumn[],
): string {
  if (!data || data.length === 0) return "";
  const keys = columns ? columns.map((col) => col.id) : Object.keys(data[0]);
  const header = columns
    ? columns.map((col) => '"' + (col.label || col.id) + '"').join(",")
    : keys.map((k) => '"' + k + '"').join(",");
  const rows = data.map((row) =>
    keys
      .map((key) => {
        let cell = row[key];
        if (cell === null || cell === undefined) cell = "";
        // Escape quotes
        return '"' + String(cell).replace(/"/g, '""') + '"';
      })
      .join(","),
  );
  return [header, ...rows].join("\r\n");
}

export const ExportButton = <T extends Record<string, any>>({
  data,
  columns,
  filename = "export.csv",
}: ExportButtonProps<T>) => {
  const { t } = useTranslation();
  const isDisabled = !data || data.length === 0;

  return (
    <Button
      type="button"
      variant={"tableButton"}
      tooltip={t("reports.export.csv")}
      className="h-9 w-9 rounded-lg border-0 px-0 text-[#5B6785] hover:bg-[#F4F7FD]"
      onClick={() => {
        if (isDisabled) return;
        const csv = toCsv(data, columns);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }}
      aria-label={t("reports.export.csv")}
      tabIndex={isDisabled ? -1 : 0}
    >
      <Download className="size-4" />
    </Button>
  );
};
