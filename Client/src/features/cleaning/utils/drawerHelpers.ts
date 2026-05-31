import { TFunction } from "i18next";
import { CleaningStatus } from "../types";

export const formatShortDateTime = (input: string | Date): string => {
  const date = typeof input === "string" ? new Date(input) : input;
  if (isNaN(date.getTime())) return "-";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}, ${hours}:${minutes}`;
};

export const formatTimeOnly = (input: string | Date): string => {
  const date = typeof input === "string" ? new Date(input) : input;
  if (isNaN(date.getTime())) return "-";

  return date.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getCleaningStatusLabel = (
  status: CleaningStatus,
  t: TFunction,
): string => {
  switch (status) {
    case "vacant_clean":
    case "occupied_clean":
      return t("clean");
    case "vacant_dirty":
    case "occupied_dirty":
      return t("dirty");
    case "vacant_inspected":
      return t("inspected");
    case "do_not_disturb":
      return t("do_not_disturb");
    default:
      return t("clean");
  }
};

export const isCleanStatus = (status: CleaningStatus): boolean =>
  status === "vacant_clean" ||
  status === "occupied_clean" ||
  status === "vacant_inspected";
