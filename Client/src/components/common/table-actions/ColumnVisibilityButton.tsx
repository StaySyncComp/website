import { Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useContext, useState } from "react";
import { DataTableContext } from "@/components/common/data-table/data-table-context";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function ColumnVisibilityButton() {
  const { table } = useContext(DataTableContext);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          tooltip={t("column_visibility")}
          variant={"tableButton"}
          type="button"
          className="h-9 w-9 rounded-lg border-0 px-0 text-[#5B6785] hover:bg-[#F4F7FD]"
          aria-label={t("column_visibility")}
        >
          <Settings className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {t(`fields.${column.id}`, { defaultValue: column.id })}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
