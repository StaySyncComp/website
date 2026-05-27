import { useEffect, type ReactNode } from "react";
import { Hand } from "lucide-react";
import { useTranslation } from "react-i18next";
import { createUsePuck } from "@measured/puck";
import type { PreviewMode } from "./PreviewModeSwitch";
import {
  INFO_PAGE_PREVIEW_MOBILE_WIDTH,
  INFO_PAGE_PREVIEW_WEB_WIDTH,
} from "./puck/previewConstants";
import { buildInfoPageViewports } from "./puck/viewports";

const usePuckApi = createUsePuck();

interface Props {
  children: ReactNode;
  mode: PreviewMode;
}

/**
 * Puck renders this INSIDE #puck-canvas-root (the white preview box).
 * The iPhone chassis is styled on #puck-canvas-root via
 * .info-page-puck-editor--mobile in infoPagePreview.css.
 */
export default function InfoPagePreview({ children, mode }: Props) {
  const { t } = useTranslation();
  const dispatch = usePuckApi((s) => s.dispatch);
  const isMobile = mode === "mobile";

  useEffect(() => {
    const width = isMobile
      ? INFO_PAGE_PREVIEW_MOBILE_WIDTH
      : INFO_PAGE_PREVIEW_WEB_WIDTH;

    dispatch({
      type: "setUi",
      ui: {
        viewports: buildInfoPageViewports(width),
      },
    });
  }, [dispatch, isMobile]);

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="info-page-iphone-chrome" aria-hidden>
        <div className="info-page-iphone-island">
          <span className="info-page-iphone-island-camera" />
        </div>
        <div className="info-page-iphone-home-bar" />
      </div>
      <div className="info-page-iphone-screen">
        <div className="info-page-iphone-screen-scroll">
          <div className="info-page-iphone-content-scale">{children}</div>
        </div>
        <div className="info-page-mobile-scroll-hint" aria-hidden>
          <Hand className="h-7 w-7 stroke-[1.5]" />
          <span className="text-center text-[10px] font-medium leading-tight">
            {t("info_page_preview_scroll")}
          </span>
        </div>
      </div>
    </>
  );
}
