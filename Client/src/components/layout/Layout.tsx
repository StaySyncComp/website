import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Helmet } from "react-helmet";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { OrganizationsContext } from "@/features/organization/context/organization-context";
import { useRoutes } from "@/hooks/useRoutes";
import { useTranslation } from "react-i18next";
import { useRTL } from "@/hooks/useRtl";
import { AppSidebar } from "./sidebar/Sidebar";
import { WidgetTemplateSidebar } from "./sidebar/WidgetTemplateSidebar";
import Navigation from "./topbar/Navigation";
import {
  DashboardEditProvider,
  useDashboardEditOptional,
} from "@/features/home-dashboard/DashboardEditContext";

interface LayoutProps {
  children: React.ReactNode;
}

function LayoutSidebars({ side }: { side: "left" | "right" }) {
  const location = useLocation();
  const edit = useDashboardEditOptional();
  const isHomeEdit =
    location.pathname === "/home" && (edit?.isEditMode ?? false);

  if (isHomeEdit) {
    return <WidgetTemplateSidebar side={side} />;
  }

  return <AppSidebar side={side} />;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isRtl } = useRTL();
  const { organization } = useContext(OrganizationsContext);
  const { currentRoute } = useRoutes();
  const { t } = useTranslation();
  const title = `${organization?.name} - ${t(
    // @ts-ignore
    currentRoute?.handle.documentTitle,
  )}`;
  const sidebarSide = isRtl ? "right" : "left";

  return (
    <>
      <Helmet>
        <title>{organization && title}</title>
      </Helmet>
      <div className="flex h-screen flex-col relative">
        <DashboardEditProvider>
          <SidebarProvider>
            <LayoutSidebars side={sidebarSide} />

            <SidebarInset>
              <Navigation />

              <div className="flex flex-col gap-4 flex-1 overflow-auto">
                <div className="w-full overflow-y-auto p-2 min-h-full ">
                  {children}
                </div>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </DashboardEditProvider>
      </div>
    </>
  );
};
