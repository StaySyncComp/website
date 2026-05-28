// components/data-table/data-table-add-button.tsx
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface DataTableAddButtonProps {
  onToggleAddRow: () => void;
  showAddButton?: boolean;
}

export const DataTableAddButton = ({
  onToggleAddRow,
  showAddButton,
}: DataTableAddButtonProps) => {
  const { t } = useTranslation();
  return showAddButton ? (
    <Button
      variant={"accentGhost"}
      onClick={onToggleAddRow}
      className="h-10 rounded-lg px-3 text-[#2D7EF8] hover:bg-[#F2F6FF]"
    >
      <PlusCircle className="ml-2 size-4" />
      {t("add")}
    </Button>
  ) : null;
};
