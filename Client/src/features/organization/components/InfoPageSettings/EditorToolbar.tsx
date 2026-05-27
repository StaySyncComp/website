import type { Data } from "@measured/puck";
import { LayoutTemplate, Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/Input";
import TemplatePicker from "./TemplatePicker";
import type { InfoPageTemplateContext } from "./puck/templates";
import { cn } from "@/lib/utils";

interface Props {
  pageTitle: string;
  onTitleChange: (title: string) => void;
  hasExistingContent: boolean;
  onApplyTemplate: (data: Data) => void;
  organizationName: string;
  templateContext?: InfoPageTemplateContext;
}

export default function EditorToolbar({
  pageTitle,
  onTitleChange,
  hasExistingContent,
  onApplyTemplate,
  organizationName,
  templateContext,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 py-3 border-b border-border bg-gradient-to-l from-accent/5 via-surface to-surface">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent/15 text-accent shrink-0">
          <Pencil className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1 max-w-md">
          <label className="text-xs font-medium text-muted-foreground block mb-1">
            {t("info_page_title_label")}
          </label>
          <Input
            value={pageTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder={t("info_page_title_placeholder")}
            className="h-9 bg-background"
          />
        </div>
      </div>

      <div
        className={cn(
          "flex items-center gap-2 shrink-0 rounded-xl border border-accent/25 bg-accent/5 px-3 py-2",
          "shadow-sm hover:border-accent/40 hover:bg-accent/10 transition-colors"
        )}
      >
        <LayoutTemplate className="w-4 h-4 text-accent shrink-0" />
        <div className="text-right hidden sm:block min-w-0">
          <p className="text-xs font-semibold text-foreground leading-tight">
            {t("info_page_templates_short")}
          </p>
          <p className="text-[10px] text-muted-foreground leading-tight truncate max-w-[160px]">
            {organizationName}
          </p>
        </div>
        <TemplatePicker
          variant="toolbar"
          hasExistingContent={hasExistingContent}
          onApply={onApplyTemplate}
          templateContext={templateContext}
        />
      </div>
    </div>
  );
}
