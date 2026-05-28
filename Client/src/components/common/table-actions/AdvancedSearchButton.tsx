import { Filter } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface AdvancedSearchButtonProps {
  onClick: () => void;
}

export const AdvancedSearchButton: React.FC<AdvancedSearchButtonProps> = ({
  onClick,
}) => {
  const { t } = useTranslation();

  return (
    <Button
      type="button"
      tooltip={t("reports.filters.apply")}
      variant={"tableButton"}
      onClick={onClick}
      className="h-9 w-9 rounded-lg border-0 px-0 text-[#5B6785] hover:bg-[#F4F7FD]"
      aria-label={t("reports.filters.apply")}
    >
      <Filter className="size-4" />
    </Button>
  );
};
