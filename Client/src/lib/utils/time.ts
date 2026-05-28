/** Normalize API / browser time values to HH:mm for <input type="time"> */
export function normalizeTimeValue(value: unknown): string {
  if (value == null || value === "") return "";
  const raw = String(value).trim();
  const match = raw.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return "";
  const hours = Math.min(23, Math.max(0, Number.parseInt(match[1], 10)));
  const minutes = Math.min(59, Math.max(0, Number.parseInt(match[2], 10)));
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function defaultTimeSlot(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export function normalizeTimeList(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return values
    .map((v) => normalizeTimeValue(v))
    .filter((t) => t.length > 0);
}

export const TIME_HH_MM_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;
