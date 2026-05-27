import { useState } from "react";
import type { Data } from "@measured/puck";
import { useTranslation } from "react-i18next";
import { Check, LayoutTemplate, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  INFO_PAGE_TEMPLATES,
  cloneTemplateData,
  type InfoPageTemplateContext,
  type InfoPageTemplateId,
} from "./puck/templates";
import { cn } from "@/lib/utils";

const DIALOG_CONTENT_CLASS = "max-w-4xl p-0 gap-0 overflow-hidden";
const DIALOG_BODY_CLASS = "px-6 sm:px-8 py-5 sm:py-6";
const DIALOG_FOOTER_CLASS =
  "px-6 sm:px-8 py-4 border-t border-border flex flex-row justify-center items-center gap-3";

interface Props {
  hasExistingContent: boolean;
  onApply: (data: Data) => void;
  variant?: "inline" | "button" | "toolbar";
  templateContext?: InfoPageTemplateContext;
}

function DirectionalActionButtons({
  dir,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  confirmDisabled,
  variant = "button",
}: {
  dir: "rtl" | "ltr";
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmDisabled?: boolean;
  variant?: "button" | "alert";
}) {
  const cancelButton =
    variant === "alert" ? (
      <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
    ) : (
      <Button type="button" variant="outline" onClick={onCancel}>
        {cancelLabel}
      </Button>
    );

  const confirmButton =
    variant === "alert" ? (
      <AlertDialogAction
        disabled={confirmDisabled}
        onClick={onConfirm}
      >
        {confirmLabel}
      </AlertDialogAction>
    ) : (
      <Button
        type="button"
        disabled={confirmDisabled}
        onClick={onConfirm}
      >
        {confirmLabel}
      </Button>
    );

  return dir === "rtl" ? (
    <>
      {confirmButton}
      {cancelButton}
    </>
  ) : (
    <>
      {cancelButton}
      {confirmButton}
    </>
  );
}

export default function TemplatePicker({
  hasExistingContent,
  onApply,
  variant = "inline",
  templateContext,
}: Props) {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir() as "rtl" | "ltr";
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<InfoPageTemplateId | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const applyTemplate = (id: InfoPageTemplateId) => {
    const template = INFO_PAGE_TEMPLATES.find((x) => x.id === id);
    if (!template) return;
    onApply(cloneTemplateData(template, templateContext));
    setDialogOpen(false);
    setSelectedId(null);
    setConfirmOpen(false);
  };

  const handleUseTemplate = () => {
    if (!selectedId) return;
    if (hasExistingContent) {
      setConfirmOpen(true);
      return;
    }
    applyTemplate(selectedId);
  };

  const templateGrid = (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
      {INFO_PAGE_TEMPLATES.map((template) => {
        const selected = selectedId === template.id;
        return (
          <button
            key={template.id}
            type="button"
            onClick={() => setSelectedId(template.id)}
            className={cn(
              "text-start rounded-xl border-2 p-4 transition-all hover:border-accent/50 hover:shadow-md",
              selected
                ? "border-accent bg-accent/5 shadow-md ring-2 ring-accent/20"
                : "border-border bg-surface"
            )}
          >
            <div className="flex flex-col gap-1.5 mb-3 rounded-lg overflow-hidden border border-border bg-muted/30 p-3 min-h-[100px]">
              {template.previewLayout.map((bar, i) => (
                <div
                  key={i}
                  className={cn(bar.h, bar.className, bar.w, "rounded-sm")}
                />
              ))}
            </div>
            <p className="font-semibold text-sm">{t(template.nameKey)}</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {t(template.descriptionKey)}
            </p>
            {selected && (
              <div className="flex items-center gap-1 mt-2 text-accent text-xs font-medium">
                <Check className="w-3.5 h-3.5" />
                {t("info_page_template_selected")}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );

  const replaceConfirmDialog = (
    <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
      <AlertDialogContent dir={dir} className="text-start">
        <AlertDialogHeader className="space-y-2 text-start sm:text-start">
          <AlertDialogTitle>
            {t("info_page_template_replace_title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("info_page_template_replace_desc")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className={cn(DIALOG_FOOTER_CLASS, "border-t-0 pt-2 pb-0 px-0")}>
          <DirectionalActionButtons
            dir={dir}
            variant="alert"
            cancelLabel={t("cancel")}
            confirmLabel={t("info_page_template_replace_confirm")}
            onCancel={() => setConfirmOpen(false)}
            onConfirm={() => selectedId && applyTemplate(selectedId)}
          />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );

  const templateDialogBody = (
    <>
      <div className="relative px-6 sm:px-8 pt-6 pb-4 border-b border-border">
        <DialogClose className="absolute top-4 end-4 rtl:end-auto rtl:start-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <X className="h-4 w-4" />
          <span className="sr-only">{t("cancel")}</span>
        </DialogClose>
        <div className="text-start pe-10 space-y-1.5">
          <DialogTitle>{t("info_page_templates_title")}</DialogTitle>
          <DialogDescription>{t("info_page_templates_subtitle")}</DialogDescription>
        </div>
      </div>
      <div className={DIALOG_BODY_CLASS}>{templateGrid}</div>
      <div className={DIALOG_FOOTER_CLASS}>
        <DirectionalActionButtons
          dir={dir}
          cancelLabel={t("cancel")}
          confirmLabel={t("info_page_template_use")}
          onCancel={() => setDialogOpen(false)}
          onConfirm={handleUseTemplate}
          confirmDisabled={!selectedId}
        />
      </div>
    </>
  );

  if (variant === "toolbar") {
    return (
      <>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              size="sm"
              className="gap-1.5 h-8 bg-accent hover:bg-accent/90 text-white shadow-sm"
            >
              <LayoutTemplate className="w-3.5 h-3.5" />
              {t("info_page_templates_choose")}
            </Button>
          </DialogTrigger>
          <DialogContent className={DIALOG_CONTENT_CLASS} dir={dir}>
            {templateDialogBody}
          </DialogContent>
        </Dialog>
        {replaceConfirmDialog}
      </>
    );
  }

  if (variant === "inline" && !hasExistingContent) {
    return (
      <div className="border border-border rounded-lg p-6 bg-surface space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-accent/10 text-accent shrink-0">
            <LayoutTemplate className="w-5 h-5" />
          </div>
          <div className="text-start min-w-0">
            <h3 className="font-semibold">{t("info_page_templates_title")}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t("info_page_templates_subtitle")}
            </p>
          </div>
        </div>
        <div className="px-1">{templateGrid}</div>
        <div className="flex justify-center pt-2">
          <Button
            type="button"
            disabled={!selectedId}
            onClick={handleUseTemplate}
          >
            {t("info_page_template_use")}
          </Button>
        </div>
        {replaceConfirmDialog}
      </div>
    );
  }

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm" className="gap-2">
            <LayoutTemplate className="w-4 h-4" />
            {t("info_page_templates_choose")}
          </Button>
        </DialogTrigger>
        <DialogContent className={DIALOG_CONTENT_CLASS} dir={dir}>
          {templateDialogBody}
        </DialogContent>
      </Dialog>
      {replaceConfirmDialog}
    </>
  );
}
