import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { PuckPageData } from "@/types/api/infoPage";
import {
  fetchInfoPage,
  publishInfoPage,
  saveInfoPageDraft,
  unpublishInfoPage,
} from "@/features/organization/api/infoPage";

export const INFO_PAGE_QUERY_KEY = ["organization-info-page"];

export function useInfoPage() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const query = useQuery({
    queryKey: INFO_PAGE_QUERY_KEY,
    queryFn: fetchInfoPage,
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const saveDraftMutation = useMutation({
    mutationFn: (draftContent: PuckPageData) => saveInfoPageDraft(draftContent),
    onSuccess: (data) => {
      queryClient.setQueryData(INFO_PAGE_QUERY_KEY, data);
      toast.success(t("info_page_draft_saved"));
    },
    onError: () => toast.error(t("info_page_save_error")),
  });

  const publishMutation = useMutation({
    mutationFn: (draftContent: PuckPageData) => publishInfoPage(draftContent),
    onSuccess: (data) => {
      queryClient.setQueryData(INFO_PAGE_QUERY_KEY, data);
      toast.success(t("info_page_published"));
    },
    onError: () => toast.error(t("info_page_publish_error")),
  });

  const unpublishMutation = useMutation({
    mutationFn: unpublishInfoPage,
    onSuccess: (data) => {
      queryClient.setQueryData(INFO_PAGE_QUERY_KEY, data);
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
