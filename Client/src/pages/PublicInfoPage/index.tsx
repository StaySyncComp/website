import { lazy, Suspense, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Loader2 } from "lucide-react";
import { fetchPublicInfoPage } from "@/features/organization/api/infoPage";
import { applyOrganizationTheme } from "@/lib/utils/hooks/UseOrganizationUtils";
import type { Data } from "@measured/puck";
import { useTranslation } from "react-i18next";
import { emptyPuckData } from "@/features/organization/components/InfoPageSettings/puck/config";

const PublicPuckRender = lazy(() => import("./PublicPuckRender"));

function normalizePublishedData(raw: unknown): Data {
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

export default function PublicInfoPage() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const { t, i18n } = useTranslation();
  const orgId = Number(organizationId);

  const query = useQuery({
    queryKey: ["public-info-page", orgId],
    queryFn: () => fetchPublicInfoPage(orgId),
    enabled: Number.isInteger(orgId) && orgId > 0,
    retry: false,
  });

  useEffect(() => {
    if (query.data?.organization) {
      applyOrganizationTheme({
        customStyles: query.data.organization.customStyles,
      } as Parameters<typeof applyOrganizationTheme>[0]);
    }
  }, [query.data]);

  useEffect(() => {
    document.documentElement.dir = i18n.dir();
  }, [i18n]);

  if (!Number.isInteger(orgId) || orgId <= 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-muted-foreground">{t("info_page_invalid_link")}</p>
      </div>
    );
  }

  if (query.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-2">
        <h1 className="text-xl font-semibold">{t("info_page_not_found_title")}</h1>
        <p className="text-muted-foreground">{t("info_page_not_found_description")}</p>
      </div>
    );
  }

  const { organization, publishedContent } = query.data;
  const pageData = normalizePublishedData(publishedContent);
  const hasBlocks = pageData.content.length > 0;

  return (
    <>
      <Helmet>
        <title>{organization.name}</title>
      </Helmet>
      <div className="min-h-screen bg-background" dir={i18n.dir()}>
        {organization.logo ? (
          <header className="flex justify-center py-6 px-4 border-b border-border">
            <img
              src={organization.logo}
              alt={organization.name}
              className="h-14 w-auto object-contain"
            />
          </header>
        ) : null}
        <main>
          {hasBlocks ? (
            <Suspense
              fallback={
                <div className="flex justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-accent" />
                </div>
              }
            >
              <PublicPuckRender data={pageData} />
            </Suspense>
          ) : (
            <p className="text-center text-muted-foreground py-16 px-6">
              {t("info_page_empty_public")}
            </p>
          )}
        </main>
        <footer className="py-8 text-center text-sm text-muted-foreground">
          {organization.name}
        </footer>
      </div>
    </>
  );
}
