import { Plus, FileText, Trash2, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { OrganizationInfoPageRecord } from "@/types/api/infoPage";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  pages: OrganizationInfoPageRecord[];
  maxPages: number;
  selectedPageId: number | null;
  onSelect: (pageId: number) => void;
  onCreate: () => void;
  onDelete: (pageId: number) => void;
  isCreating?: boolean;
}

export default function InfoPageTabs({
  pages,
  maxPages,
  selectedPageId,
  onSelect,
  onCreate,
  onDelete,
  isCreating,
}: Props) {
  const { t } = useTranslation();
  const canAdd = pages.length < maxPages;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-semibold text-lg">{t("info_pages_list_title")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("info_pages_list_subtitle", { count: pages.length, max: maxPages })}
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          disabled={!canAdd || isCreating}
          loading={isCreating}
          onClick={onCreate}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          {t("info_page_add")}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {pages.map((page) => {
          const active = page.id === selectedPageId;
          return (
            <div
              key={page.id}
              className={cn(
                "group flex items-center gap-1 rounded-lg border transition-all",
                active
                  ? "border-accent bg-accent/10 shadow-sm"
                  : "border-border bg-surface hover:border-accent/40"
              )}
            >
              <button
                type="button"
                onClick={() => onSelect(page.id)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium min-w-0"
              >
                <FileText
                  className={cn(
                    "w-4 h-4 shrink-0",
                    active ? "text-accent" : "text-muted-foreground"
                  )}
                />
                <span className="truncate max-w-[140px]">{page.title}</span>
                {page.isPublished && (
                  <Globe
                    className="w-3.5 h-3.5 text-green-600 shrink-0"
                    aria-label={t("published")}
                  />
                )}
              </button>

              {pages.length > 1 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className="p-2 mr-1 rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all"
                      aria-label={t("delete")}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent dir="rtl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {t("info_page_delete_title")}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("info_page_delete_desc", { title: page.title })}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:gap-0">
                      <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => onDelete(page.id)}
                      >
                        {t("delete")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
