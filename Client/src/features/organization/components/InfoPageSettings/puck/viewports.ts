import type { Viewports } from "@measured/puck";
import {
  INFO_PAGE_IPHONE_SCREEN_HEIGHT,
  INFO_PAGE_PREVIEW_MOBILE_MAX_WIDTH,
  INFO_PAGE_PREVIEW_MOBILE_WIDTH,
  INFO_PAGE_PREVIEW_WEB_WIDTH,
} from "./previewConstants";

/** Web + mobile only — toggled via PreviewModeSwitch in the editor */
export const INFO_PAGE_VIEWPORTS: Viewports = [
  { width: INFO_PAGE_PREVIEW_WEB_WIDTH, height: "auto", icon: "Monitor", label: "Web" },
  {
    width: INFO_PAGE_PREVIEW_MOBILE_WIDTH,
    height: INFO_PAGE_IPHONE_SCREEN_HEIGHT,
    icon: "Smartphone",
    label: "Mobile",
  },
];

export function buildInfoPageViewports(width: number) {
  const isMobile = width <= INFO_PAGE_PREVIEW_MOBILE_MAX_WIDTH;
  return {
    current: {
      width,
      height: isMobile ? INFO_PAGE_IPHONE_SCREEN_HEIGHT : ("auto" as const),
    },
    controlsVisible: false,
    options: INFO_PAGE_VIEWPORTS,
  };
}

export const INFO_PAGE_PUCK_UI = {
  viewports: buildInfoPageViewports(INFO_PAGE_PREVIEW_WEB_WIDTH),
};

/** Full-width live page — no narrow card column */
export const INFO_PAGE_PUBLIC_ROOT_CLASS =
  "w-full min-h-screen bg-background";

/** Editor preview: subtle canvas behind the page */
export const INFO_PAGE_EDITOR_ROOT_OUTER =
  "w-full bg-muted/30 text-foreground";

export const INFO_PAGE_EDITOR_ROOT_INNER =
  "w-full bg-background";
