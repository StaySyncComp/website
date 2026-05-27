import type { Viewports } from "@measured/puck";

/** Desktop-first preview — Puck defaults to 360px mobile otherwise. */
export const INFO_PAGE_VIEWPORTS: Viewports = [
  { width: 1280, height: "auto", icon: "Monitor", label: "מחשב" },
  { width: 768, height: "auto", icon: "Tablet", label: "טאבלט" },
  { width: 390, height: "auto", icon: "Smartphone", label: "נייד" },
];

export const INFO_PAGE_PUCK_UI = {
  viewports: {
    current: { width: 1280, height: "auto" as const },
  },
};

/** Full-width live page — no narrow card column */
export const INFO_PAGE_PUBLIC_ROOT_CLASS =
  "w-full min-h-screen bg-background";

/** Editor preview: subtle canvas behind the page */
export const INFO_PAGE_EDITOR_ROOT_OUTER =
  "w-full min-h-screen bg-muted/30 text-foreground";

export const INFO_PAGE_EDITOR_ROOT_INNER =
  "w-full min-h-screen bg-background";
