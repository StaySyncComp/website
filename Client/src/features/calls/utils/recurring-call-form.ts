/** Normalize API row → react-hook-form defaults for recurring calls */
export function normalizeRecurringRowForForm(
  rowData: Record<string, unknown> | null | undefined,
): Record<string, unknown> | undefined {
  if (!rowData) return rowData;

  const daysOfWeek = Array.isArray(rowData.daysOfWeek)
    ? rowData.daysOfWeek.map((d) => String(d))
    : [];

  const times = Array.isArray(rowData.times)
    ? rowData.times.map((t) => String(t))
    : [];

  return {
    ...rowData,
    locationId:
      rowData.locationId != null ? String(rowData.locationId) : undefined,
    callCategoryId:
      rowData.callCategoryId != null
        ? String(rowData.callCategoryId)
        : undefined,
    daysOfWeek,
    times,
    startDate: toDateInputValue(rowData.startDate),
    endDate: rowData.endDate ? toDateInputValue(rowData.endDate) : undefined,
  };
}

function toDateInputValue(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  return new Date(String(value)).toISOString();
}
