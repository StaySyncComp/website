import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { OrganizationsContext } from "@/features/organization/context/organization-context";
import { useInfoPagesList } from "@/features/organization/hooks/useInfoPage";
import InfoPageTabs from "./InfoPageTabs";
import InfoPageEditor from "./InfoPageEditor";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, FilePlus } from "lucide-react";

export default function InfoPagesManager() {
  const { t } = useTranslation();
  const { organization } = useContext(OrganizationsContext);
  const {
    pages,
    maxPages,
    isLoading,
    isError,
    refetch,
    createPage,
    isCreating,
    deletePage,
  } = useInfoPagesList();

  const [selectedPageId, setSelectedPageId] = useState<number | null>(null);

  useEffect(() => {
    if (pages.length === 0) {
      setSelectedPageId(null);
      return;
    }
    if (
      selectedPageId === null ||
      !pages.some((p) => p.id === selectedPageId)
    ) {
      setSelectedPageId(pages[0].id);
    }
  }, [pages, selectedPageId]);

  const handleCreate = useCallback(async () => {
    const page = await createPage();
    setSelectedPageId(page.id);
  }, [createPage]);

  const handleDelete = useCallback(
    async (pageId: number) => {
      await deletePage(pageId);
      if (selectedPageId === pageId) {
        const remaining = pages.filter((p) => p.id !== pageId);
        setSelectedPageId(remaining[0]?.id ?? null);
      }
    },
    [deletePage, pages, selectedPageId]
  );

  if (!organization) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{t("info_page_loading")}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center py-16 gap-4 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-sm text-muted-foreground">{t("info_page_load_error")}</p>
        <Button variant="outline" onClick={() => refetch()}>
          {t("retry")}
        </Button>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 border border-dashed border-border rounded-xl bg-surface/50">
        <FilePlus className="w-12 h-12 text-muted-foreground" />
        <div className="text-center max-w-sm">
          <h3 className="font-semibold text-lg">{t("info_pages_empty_title")}</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {t("info_pages_empty_subtitle")}
          </p>
        </div>
        <Button loading={isCreating} onClick={handleCreate}>
          {t("info_page_create_first")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <InfoPageTabs
        pages={pages}
        maxPages={maxPages}
        selectedPageId={selectedPageId}
        onSelect={setSelectedPageId}
        onCreate={handleCreate}
        onDelete={handleDelete}
        isCreating={isCreating}
      />

      {selectedPageId && (
        <InfoPageEditor
          key={selectedPageId}
          pageId={selectedPageId}
          organizationId={organization.id}
          organizationName={organization.name}
          organizationLogo={
            typeof organization.logo === "string" ? organization.logo : undefined
          }
        />
      )}
    </div>
  );
}
