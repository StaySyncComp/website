import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { normalizeTimeValue } from "@/lib/utils/time";

interface TimeSlotInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function splitTime(value: string): { hours: string; minutes: string } {
  const normalized = normalizeTimeValue(value);
  if (!normalized) return { hours: "", minutes: "" };
  const [hours, minutes] = normalized.split(":");
  return { hours, minutes };
}

function clampHours(raw: string): number {
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n)) return 0;
  return Math.min(23, Math.max(0, n));
}

function clampMinutes(raw: string): number {
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n)) return 0;
  return Math.min(59, Math.max(0, n));
}

function formatCommitted(hours: string, minutes: string): string {
  const h = clampHours(hours === "" ? "0" : hours);
  const m = clampMinutes(minutes === "" ? "0" : minutes);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function sanitizePart(raw: string, maxLen = 2): string {
  return raw.replace(/\D/g, "").slice(0, maxLen);
}

/**
 * HH:mm editor with local draft while typing.
 * Root issue fixed: do not pad/commit on every keystroke (e.g. "4" → "04" blocked typing "46").
 */
export function TimeSlotInput({ value, onChange, className }: TimeSlotInputProps) {
  const hoursRef = useRef<HTMLInputElement>(null);
  const minutesRef = useRef<HTMLInputElement>(null);
  const [hours, setHours] = useState(() => splitTime(value).hours);
  const [minutes, setMinutes] = useState(() => splitTime(value).minutes);

  const isFocused = () =>
    document.activeElement === hoursRef.current ||
    document.activeElement === minutesRef.current;

  const syncFromProp = useCallback((nextValue: string) => {
    const parts = splitTime(nextValue);
    setHours(parts.hours);
    setMinutes(parts.minutes);
  }, []);

  useEffect(() => {
    if (isFocused()) return;
    syncFromProp(value);
  }, [value, syncFromProp]);

  const commit = () => {
    if (hours === "" && minutes === "") {
      onChange("");
      return;
    }
    onChange(formatCommitted(hours, minutes));
  };

  const handleHoursChange = (raw: string) => {
    setHours(sanitizePart(raw));
  };

  const handleMinutesChange = (raw: string) => {
    setMinutes(sanitizePart(raw));
  };

  const handleBlur = (e: React.FocusEvent) => {
    const related = e.relatedTarget as Node | null;
    const container = e.currentTarget;
    if (related && container.contains(related)) {
      return;
    }
    commit();
  };

  return (
    <div
      dir="ltr"
      onBlur={handleBlur}
      className={cn(
        "flex h-10 items-center gap-0.5 rounded-lg border border-gray-300 bg-white px-2",
        "focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500",
        className,
      )}
    >
      <input
        ref={hoursRef}
        type="text"
        inputMode="numeric"
        maxLength={2}
        placeholder="HH"
        aria-label="Hours"
        value={hours}
        onChange={(e) => handleHoursChange(e.target.value)}
        className="w-8 min-w-8 border-0 bg-transparent p-0 text-center text-sm tabular-nums text-[#2D3A58] outline-none"
      />
      <span className="px-0.5 text-sm font-semibold text-[#9AA6C5]">:</span>
      <input
        ref={minutesRef}
        type="text"
        inputMode="numeric"
        maxLength={2}
        placeholder="mm"
        aria-label="Minutes"
        value={minutes}
        onChange={(e) => handleMinutesChange(e.target.value)}
        className="w-8 min-w-8 border-0 bg-transparent p-0 text-center text-sm tabular-nums text-[#2D3A58] outline-none"
      />
    </div>
  );
}
