export const INFO_PAGE_PREVIEW_WEB_WIDTH = 1280;
/** Puck layout width — matches visible phone frame */
export const INFO_PAGE_PREVIEW_MOBILE_WIDTH = 390;
export const INFO_PAGE_PREVIEW_MOBILE_MAX_WIDTH = 500;

export const INFO_PAGE_IPHONE_FRAME_WIDTH = INFO_PAGE_PREVIEW_MOBILE_WIDTH;
export const INFO_PAGE_IPHONE_SCREEN_HEIGHT = 736;

export function isMobilePreviewWidth(width: number): boolean {
  return width <= INFO_PAGE_PREVIEW_MOBILE_MAX_WIDTH;
}
