import React, { useState } from "react";
import { AdvancedSearchFieldConfig } from "@/types/advanced-search";
import { AdvancedSearchButton } from "@/components/common/table-actions/AdvancedSearchButton";
import { AdvancedSearchDialog } from "./AdvancedSearchDialog";
import { AdvancedSearchForm } from "./AdvancedSearchForm";

interface AdvancedSearchModalProps {
  fields: AdvancedSearchFieldConfig[];
  onApply: (values: Record<string, any>) => void;
  initialValues?: Record<string, any>;
  title?: string;
  renderTrigger?: (open: () => void) => React.ReactNode;
}

export const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = ({
  fields,
  onApply,
  initialValues = {},
  title,
  renderTrigger,
}) => {
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, any>>(initialValues);

  const handleApply = (values: Record<string, any>) => {
    setFormValues(values);
    setOpen(false);
    onApply(values);
  };

  const handleReset = () => {
    setFormValues({});
    onApply({});
    setOpen(false);
  };

  return (
    <>
      {renderTrigger ? (
        renderTrigger(() => setOpen(true))
      ) : (
        <AdvancedSearchButton onClick={() => setOpen(true)} />
      )}
      <AdvancedSearchDialog open={open} onOpenChange={setOpen} title={title || "סינון מתקדם"}>
        <AdvancedSearchForm
          fields={fields}
          initialValues={formValues}
          onApply={handleApply}
          onReset={handleReset}
        />
      </AdvancedSearchDialog>
    </>
  );
};