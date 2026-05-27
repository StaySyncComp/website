import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { PuckPageData } from "@/types/api/infoPage";
import {
  createInfoPage,
  deleteInfoPage,
  fetchInfoPage,
  fetchInfoPages,
  publishInfoPage,
  saveInfoPageDraft,
  unpublishInfoPage,
} from "@/features/organization/api/infoPage";

export const INFO_PAGES_LIST_KEY = ["organization-info-pages"];
export const infoPageDetailKey = (pageId: number) => [
  "organization-info-page",
  pageId,
];

export function useInfoPagesList() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: INFO_PAGES_LIST_KEY,
    queryFn: fetchInfoPages,
    staleTime: 1000 * 60,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: (title?: string) => createInfoPage(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INFO_PAGES_LIST_KEY });
      toast.success(t("info_page_created"));
    },
    onError: () => toast.error(t("info_page_create_error")),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteInfoPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INFO_PAGES_LIST_KEY });
      toast.success(t("info_page_deleted"));
    },
    onError: () => toast.error(t("info_page_delete_error")),
  });

  return {
    pages: query.data?.pages ?? [],
    maxPages: query.data?.maxPages ?? 5,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    createPage: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deletePage: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export function useInfoPage(pageId: number | null) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const query = useQuery({
    queryKey: infoPageDetailKey(pageId ?? 0),
    queryFn: () => fetchInfoPage(pageId!),
    enabled: !!pageId && pageId > 0,
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: INFO_PAGES_LIST_KEY });
    if (pageId) {
      queryClient.invalidateQueries({ queryKey: infoPageDetailKey(pageId) });
    }
  };

  const saveDraftMutation = useMutation({
    mutationFn: ({
      draftContent,
      title,
    }: {
      draftContent: PuckPageData;
      title?: string;
    }) => saveInfoPageDraft(pageId!, draftContent, title),
    onSuccess: (data) => {
      if (pageId) queryClient.setQueryData(infoPageDetailKey(pageId), data);
      invalidateAll();
      toast.success(t("info_page_draft_saved"));
    },
    onError: () => toast.error(t("info_page_save_error")),
  });

  const publishMutation = useMutation({
    mutationFn: (draftContent: PuckPageData) =>
      publishInfoPage(pageId!, draftContent),
    onSuccess: (data) => {
      if (pageId) queryClient.setQueryData(infoPageDetailKey(pageId), data);
      invalidateAll();
      toast.success(t("info_page_published"));
    },
    onError: () => toast.error(t("info_page_publish_error")),
  });

  const unpublishMutation = useMutation({
    mutationFn: () => unpublishInfoPage(pageId!),
    onSuccess: (data) => {
      if (pageId) queryClient.setQueryData(infoPageDetailKey(pageId), data);
      invalidateAll();
      toast.success(t("info_page_unpublished"));
    },
    onError: () => toast.error(t("info_page_unpublish_error")),
  });

  return {
    infoPage: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    saveDraft: saveDraftMutation.mutateAsync,
    isSaving: saveDraftMutation.isPending,
    publish: publishMutation.mutateAsync,
    isPublishing: publishMutation.isPending,
    unpublish: unpublishMutation.mutateAsync,
    isUnpublishing: unpublishMutation.isPending,
  };
}
