import { z } from "zod";
import { TIME_HH_MM_REGEX, normalizeTimeList } from "@/lib/utils/time";

const VALID_DAYS = ["0", "1", "2", "3", "4", "5", "6"] as const;

function normalizeDaysOfWeek(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  for (const item of value) {
    const day = String(item);
    if (VALID_DAYS.includes(day as (typeof VALID_DAYS)[number])) {
      seen.add(day);
    }
  }
  return [...seen];
}

export const recurringCallFormSchema = z
  .object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    locationId: z.coerce
      .number({ invalid_type_error: "Location is required" })
      .min(1, { message: "Location is required" }),
    callCategoryId: z.coerce
      .number({ invalid_type_error: "Call category is required" })
      .min(1, { message: "Call category is required" }),
    startDate: z.string().min(1, { message: "Start date is required" }),
    endDate: z.string().optional(),
    frequency: z.string().min(1, { message: "Frequency is required" }),
    daysOfWeek: z.preprocess(
      (value) => normalizeDaysOfWeek(value),
      z.array(z.string()),
    ),
    times: z
      .array(z.string())
      .transform((values) => normalizeTimeList(values))
      .refine((values) => values.length > 0, {
        message: "At least one time is required",
      })
      .refine((values) => values.every((t) => TIME_HH_MM_REGEX.test(t)), {
        message: "Each time must be in HH:mm format",
      }),
  })
  .superRefine((data, ctx) => {
    if (data.frequency === "WEEKLY" && data.daysOfWeek.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["daysOfWeek"],
        message: "At least one day of the week must be selected",
      });
    }

    if (data.endDate && data.startDate) {
      const end = new Date(data.endDate);
      const start = new Date(data.startDate);
      if (!Number.isNaN(end.getTime()) && !Number.isNaN(start.getTime()) && end < start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endDate"],
          message: "End date must be the same day or later than the start date",
        });
      }
    }
  });
