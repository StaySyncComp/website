import {
  lazy,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Data } from "@measured/puck";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { OrganizationsContext } from "@/features/organization/context/organization-context";
import { useInfoPage } from "@/features/organization/hooks/useInfoPage";
import { emptyPuckData } from "./puck/config";
import InfoPageSharePanel from "./InfoPageSharePanel";
import { Loader2, AlertCircle } from "lucide-react";

const PuckEditor = lazy(() => import("./PuckEditor"));

function normalizeData(raw: unknown): Data {
  if (
    raw &&
    typeof raw === "object" &&
    "content" in raw &&
    Array.isArray((raw as Data).content)
  ) {
    return raw as Data;
  }
  return emptyPuckData as Data;
}

export default function InfoPageEditor() {
  const { t, ready: i18nReady } = useTranslation();
  const { organization } = useContext(OrganizationsContext);
  const {
    infoPage,
    isLoading,
    isError,
    refetch,
    saveDraft,
    isSaving,
    publish,
    isPublishing,
    unpublish,
    isUnpublishing,
  } = useInfoPage();

  const serverDraft = useMemo(
    () => normalizeData(infoPage?.draftContent),
    [infoPage?.draftContent]
  );

  const [editorData, setEditorData] = useState<Data>(serverDraft);
  const [isDirty, setIsDirty] = useState(false);
  useEffect(() => {
    setEditorData(serverDraft);
    setIsDirty(false);
  }, [serverDraft]);

  const handleChange = useCallback((data: Data) => {
    setEditorData(data);
    setIsDirty(true);
  }, []);

  const handleSaveDraft = async () => {
    await saveDraft(editorData);
    setIsDirty(false);
  };

  const handlePublish = async () => {
    await publish(editorData);
    setIsDirty(false);
  };

  const handleUnpublish = async () => {
    await unpublish();
  };

  if (!i18nReady || !organization) {
    return (
      <div className="flex items-center justify-center py-20">
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
      <div className="flex flex-col items-center justify-center py-16 gap-4 max-w-md mx-auto text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-sm text-muted-foreground">
          {t("info_page_load_error")}
        </p>
        <Button type="button" variant="outline" onClick={() => refetch()}>
          {t("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <InfoPageSharePanel
        organizationId={organization.id}
        isPublished={!!infoPage?.isPublished}
      />

      <div className="border border-border rounded-lg overflow-hidden min-h-[600px] [&_.Puck]:!min-h-[600px]">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[600px]">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          }
        >
          <PuckEditor
            data={editorData}
            onChange={handleChange}
            headerTitle={t("information_page")}
            headerPath={organization.name}
          />
        </Suspense>
      </div>

      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-surface rounded-2xl shadow-xl px-4 py-3 w-fit border z-50">
        <div className="flex flex-wrap items-center gap-3 md:gap-6">
          {isDirty && (
            <span className="text-sm font-medium">
              {t("info_page_unsaved_changes")}
            </span>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={!isDirty || isSaving}
              loading={isSaving}
              onClick={handleSaveDraft}
            >
              {t("save_draft")}
            </Button>
            <Button
              type="button"
              disabled={isPublishing}
              loading={isPublishing}
              onClick={handlePublish}
            >
              {t("publish")}
            </Button>
            {infoPage?.isPublished && (
              <Button
                type="button"
                variant="ghost"
                className="text-destructive"
                disabled={isUnpublishing}
                loading={isUnpublishing}
                onClick={handleUnpublish}
              >
                {t("unpublish")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
