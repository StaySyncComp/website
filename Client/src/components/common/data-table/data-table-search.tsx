import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

interface DataTableSearchProps {
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
}

export const DataTableSearch = ({
  globalFilter,
  setGlobalFilter,
}: DataTableSearchProps) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(globalFilter);

  const debouncedValue = useDebounce(inputValue, 500);

  useEffect(() => {
    setGlobalFilter(debouncedValue);
  }, [debouncedValue, setGlobalFilter]);

  useEffect(() => {
    setInputValue(globalFilter);
  }, [globalFilter]);

  return (
    <Input
      placeholder={t("search") + "..."}
      value={inputValue ?? ""}
      icon={<Search className="text-muted-foreground" />}
      onChange={(e) => setInputValue(e.target.value)}
      className="w-[220px] sm:w-[280px] lg:w-[360px]"
      style={{ height: 40 }}
    />
  );
};
