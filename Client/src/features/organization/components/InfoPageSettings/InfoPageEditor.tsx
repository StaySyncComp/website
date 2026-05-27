import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Data } from "@measured/puck";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useInfoPage } from "@/features/organization/hooks/useInfoPage";
import { normalizePuckData } from "./puck/normalizePuckData";
import InfoPageSharePanel from "./InfoPageSharePanel";
import EditorToolbar from "./EditorToolbar";
import PreviewModeSwitch, { type PreviewMode } from "./PreviewModeSwitch";
import TemplatePicker from "./TemplatePicker";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PuckEditor = lazy(() => import("./PuckEditor"));

interface Props {
  pageId: number;
  organizationId: number;
  organizationName: string;
  organizationLogo?: string;
}

export default function InfoPageEditor({
  pageId,
  organizationId,
  organizationName,
  organizationLogo,
}: Props) {
  const { t, ready: i18nReady } = useTranslation();
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
  } = useInfoPage(pageId);

  const serverDraft = useMemo(
    () => normalizePuckData(infoPage?.draftContent),
    [infoPage?.draftContent]
  );

  const [editorData, setEditorData] = useState<Data>(serverDraft);
  const [pageTitle, setPageTitle] = useState(infoPage?.title ?? "");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("web");
  const [isDirty, setIsDirty] = useState(false);
  const [titleDirty, setTitleDirty] = useState(false);

  useEffect(() => {
    setEditorData(serverDraft);
    setPageTitle(infoPage?.title ?? "");
    setIsDirty(false);
    setTitleDirty(false);
  }, [serverDraft, infoPage?.title, pageId]);

  const handleChange = useCallback((data: Data) => {
    setEditorData(data);
    setIsDirty(true);
  }, []);

  const handleTitleChange = (title: string) => {
    setPageTitle(title);
    setTitleDirty(true);
  };

  const handleSaveDraft = async () => {
    const normalized = normalizePuckData(editorData);
    setEditorData(normalized);
    await saveDraft({
      draftContent: normalized,
      ...(titleDirty ? { title: pageTitle } : {}),
    });
    setIsDirty(false);
    setTitleDirty(false);
  };

  const handlePublish = async () => {
    const normalized = normalizePuckData(editorData);
    setEditorData(normalized);
    if (isDirty || titleDirty) {
      await saveDraft({
        draftContent: normalized,
        ...(titleDirty ? { title: pageTitle } : {}),
      });
    }
    await publish(normalized);
    setIsDirty(false);
    setTitleDirty(false);
  };

  const handleUnpublish = async () => {
    await unpublish();
  };

  const hasExistingContent = editorData.content.length > 0;
  const hasUnsaved = isDirty || titleDirty;

  const templateContext = useMemo(
    () => ({
      organizationName,
      organizationLogo,
    }),
    [organizationName, organizationLogo]
  );

  const handleApplyTemplate = useCallback(
    (data: Data) => {
      setEditorData(normalizePuckData(data));
      setIsDirty(true);
      toast.success(t("info_page_template_applied"));
    },
    [t]
  );

  if (!i18nReady) {
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

  if (isError || !infoPage) {
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
        organizationId={organizationId}
        pageId={pageId}
        pageTitle={pageTitle}
        isPublished={!!infoPage.isPublished}
      />

      {!hasExistingContent && (
        <TemplatePicker
          variant="inline"
          hasExistingContent={false}
          onApply={handleApplyTemplate}
          templateContext={templateContext}
        />
      )}

      <div className="border border-border rounded-xl overflow-hidden shadow-sm bg-surface">
        <EditorToolbar
          pageTitle={pageTitle}
          onTitleChange={handleTitleChange}
          hasExistingContent={hasExistingContent}
          onApplyTemplate={handleApplyTemplate}
          organizationName={organizationName}
          templateContext={templateContext}
        />

        <PreviewModeSwitch
          mode={previewMode}
          onModeChange={setPreviewMode}
        />

        <div
          className={cn(
            "info-page-puck-editor",
            previewMode === "mobile" && "info-page-puck-editor--mobile"
          )}
        >
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[calc(100vh-240px)]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            }
          >
            <PuckEditor
              key={`${pageId}-${editorData.content.map((c) => c.props.id).join("-") || "empty"}`}
              data={editorData}
              onChange={handleChange}
              headerTitle={pageTitle}
              headerPath={organizationName}
              previewMode={previewMode}
            />
          </Suspense>
        </div>
      </div>

      <div
        className={cn(
          "bg-surface rounded-2xl shadow-xl px-4 py-3 border z-50",
          previewMode === "mobile"
            ? "relative mx-auto mt-4 flex w-full justify-center"
            : "fixed bottom-6 left-1/2 -translate-x-1/2 w-fit"
        )}
      >
        <div className="flex flex-wrap items-center gap-3 md:gap-6">
          {hasUnsaved && (
            <span className="text-sm font-medium">
              {t("info_page_unsaved_changes")}
            </span>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={!hasUnsaved || isSaving}
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
            {infoPage.isPublished && (
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
