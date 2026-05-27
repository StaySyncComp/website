import { Monitor, Smartphone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export type PreviewMode = "web" | "mobile";

interface Props {
  mode: PreviewMode;
  onModeChange: (mode: PreviewMode) => void;
}

export default function PreviewModeSwitch({ mode, onModeChange }: Props) {
  const { t } = useTranslation();

  return (
    <div
      className="info-page-preview-mode-bar flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5"
      role="group"
      aria-label={t("info_page_preview_mode_label")}
    >
      <div className="min-w-0">
        <p className="text-base font-semibold text-foreground">
          {t("info_page_preview_mode_label")}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "mobile"
            ? t("info_page_preview_mobile_hint")
            : t("info_page_preview_web_hint")}
        </p>
      </div>

      <div className="inline-flex w-full shrink-0 rounded-xl border border-accent/30 bg-muted/50 p-1 shadow-sm sm:w-auto">
        <button
          type="button"
          onClick={() => onModeChange("web")}
          className={cn(
            "inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all sm:flex-initial sm:px-6",
            mode === "web"
              ? "bg-accent text-white shadow-md ring-1 ring-accent/40"
              : "text-foreground/70 hover:bg-background hover:text-foreground"
          )}
        >
          <Monitor className="h-5 w-5" />
          {t("info_page_preview_web")}
        </button>
        <button
          type="button"
          onClick={() => onModeChange("mobile")}
          className={cn(
            "inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all sm:flex-initial sm:px-6",
            mode === "mobile"
              ? "bg-accent text-white shadow-md ring-1 ring-accent/40"
              : "text-foreground/70 hover:bg-background hover:text-foreground"
          )}
        >
          <Smartphone className="h-5 w-5" />
          {t("info_page_preview_mobile")}
        </button>
      </div>
    </div>
  );
}
