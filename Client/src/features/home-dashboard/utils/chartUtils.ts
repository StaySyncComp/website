import { Call } from "@/types/api/calls";
import type { QuickDatePreset } from "@/types/api/dashboardPreferences";

export interface ChartBucket {
  key: string;
  label: string;
  start: Date;
  end: Date;
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d: Date): Date {
  const x = startOfDay(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

function buildDailyBuckets(
  start: Date,
  end: Date,
  locale: string,
): ChartBucket[] {
  const buckets: ChartBucket[] = [];
  const cur = startOfDay(start);
  const last = startOfDay(end);
  while (cur <= last) {
    const dayStart = new Date(cur);
    buckets.push({
      key: dayStart.toISOString(),
      label: dayStart.toLocaleDateString(locale, {
        weekday: "short",
        day: "numeric",
      }),
      start: dayStart,
      end: endOfDay(dayStart),
    });
    cur.setDate(cur.getDate() + 1);
  }
  return buckets;
}

function buildWeeklyBuckets(
  start: Date,
  end: Date,
  locale: string,
): ChartBucket[] {
  const buckets: ChartBucket[] = [];
  let cur = startOfDay(start);
  const last = endOfDay(end);
  while (cur <= last) {
    const weekStart = new Date(cur);
    const weekEnd = endOfDay(new Date(cur));
    weekEnd.setDate(weekEnd.getDate() + 6);
    const clampedEnd = weekEnd > last ? last : weekEnd;
    buckets.push({
      key: weekStart.toISOString(),
      label: weekStart.toLocaleDateString(locale, {
        day: "numeric",
        month: "short",
      }),
      start: weekStart,
      end: clampedEnd,
    });
    cur.setDate(cur.getDate() + 7);
  }
  return buckets;
}

function buildMonthlyBuckets(
  start: Date,
  end: Date,
  locale: string,
): ChartBucket[] {
  const buckets: ChartBucket[] = [];
  const cur = new Date(start.getFullYear(), start.getMonth(), 1);
  const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
  while (cur <= endMonth) {
    const monthStart = startOfDay(
      new Date(cur.getFullYear(), cur.getMonth(), 1),
    );
    const monthEnd = endOfDay(
      new Date(cur.getFullYear(), cur.getMonth() + 1, 0),
    );
    const clampedStart = monthStart < start ? startOfDay(start) : monthStart;
    const clampedEnd = monthEnd > end ? endOfDay(end) : monthEnd;
    buckets.push({
      key: `${cur.getFullYear()}-${cur.getMonth()}`,
      label: cur.toLocaleDateString(locale, { month: "short" }),
      start: clampedStart,
      end: clampedEnd,
    });
    cur.setMonth(cur.getMonth() + 1);
  }
  return buckets;
}

export function buildChartBuckets(
  selectedPreset: QuickDatePreset,
  rangeStart: Date,
  rangeEnd: Date,
  locale: string,
): ChartBucket[] {
  const start = startOfDay(rangeStart);
  const end = endOfDay(rangeEnd);

  if (selectedPreset === "7d") {
    return buildDailyBuckets(start, end, locale);
  }
  if (selectedPreset === "1m" || selectedPreset === "3m") {
    return buildWeeklyBuckets(start, end, locale);
  }
  return buildMonthlyBuckets(start, end, locale);
}

export function aggregateCallsToChart(
  callList: Call[],
  buckets: ChartBucket[],
): { label: string; open: number; completed: number }[] {
  const isCompleted = (call: Call) =>
    String(call.status || "").toUpperCase() === "COMPLETED";

  return buckets.map((bucket) => {
    let open = 0;
    let completed = 0;
    for (const call of callList) {
      const created = new Date(call.createdAt);
      if (created < bucket.start || created > bucket.end) continue;
      if (isCompleted(call)) completed += 1;
      else open += 1;
    }
    return { label: bucket.label, open, completed };
  });
}

export function computeYTicks(maxValue: number): number[] {
  if (maxValue <= 0) return [0, 5, 10, 15, 20];
  const step =
    maxValue <= 10 ? 2 : maxValue <= 25 ? 5 : maxValue <= 50 ? 10 : 20;
  const top = Math.max(step, Math.ceil(maxValue / step) * step);
  const ticks: number[] = [];
  for (let v = 0; v <= top; v += step) ticks.push(v);
  return ticks;
}

export function buildDateRange(selectedPreset: QuickDatePreset) {
  const end = new Date();
  const start = new Date(end);
  if (selectedPreset === "7d") start.setDate(end.getDate() - 7);
  if (selectedPreset === "1m") start.setMonth(end.getMonth() - 1);
  if (selectedPreset === "3m") start.setMonth(end.getMonth() - 3);
  if (selectedPreset === "6m") start.setMonth(end.getMonth() - 6);
  if (selectedPreset === "9m") start.setMonth(end.getMonth() - 9);
  if (selectedPreset === "1y") start.setFullYear(end.getFullYear() - 1);
  return { start, end };
}
