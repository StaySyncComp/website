import { Button } from "@/components/ui/button";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  defaultTimeSlot,
  normalizeTimeList,
} from "@/lib/utils/time";
import { TimeSlotInput } from "./TimeSlotInput";
import { FieldConfig } from "./DynamicForm";

interface Props {
  field: FieldConfig;
  error: unknown;
  control: unknown;
  requiredFields: string[];
  defaultValues?: Record<string, unknown>;
}

function MultiTime({
  field,
  error,
  control,
  requiredFields,
  defaultValues,
}: Props) {
  const { t } = useTranslation();
  const initialTimes = normalizeTimeList(defaultValues?.[field.name]);

  return (
    <div key={field.name} className="flex w-56 flex-col gap-1">
      <label>
        {t(field.label)}
        {requiredFields.includes(field.name) && (
          <span className="ml-1 text-red-500">{t("form.required_field")}</span>
        )}
      </label>
      <Controller
        name={field.name}
        control={control}
        defaultValue={initialTimes.length > 0 ? initialTimes : []}
        render={({ field: controllerField }) => {
          const times = Array.isArray(controllerField.value)
            ? (controllerField.value as string[])
            : normalizeTimeList(controllerField.value);

          const setTimes = (next: string[]) => {
            controllerField.onChange(normalizeTimeList(next));
          };

          return (
            <div className="flex flex-col gap-2">
              {times.length === 0 ? (
                <p className="text-xs text-muted-foreground">{t("add_time")}</p>
              ) : null}
              {times.map((time, idx) => (
                <div
                  key={`${field.name}-${idx}`}
                  className="flex items-center gap-2"
                >
                  <TimeSlotInput
                    value={time}
                    onChange={(next) => {
                      const updated = [...times];
                      if (!next) {
                        updated.splice(idx, 1);
                      } else {
                        updated[idx] = next;
                      }
                      setTimes(updated);
                    }}
                    className="min-w-[7.5rem] flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-red-500 hover:text-red-700"
                    aria-label={t("remove")}
                    onClick={() => {
                      const next = [...times];
                      next.splice(idx, 1);
                      setTimes(next);
                    }}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-fit"
                onClick={() => setTimes([...times, defaultTimeSlot()])}
              >
                {t("add_time")}
              </Button>
            </div>
          );
        }}
      />
      {error && typeof error === "object" && "message" in error ? (
        <span className="text-sm text-red-500">
          {t("form.error_message")}:{" "}
          {String((error as { message: string }).message)}
        </span>
      ) : null}
    </div>
  );
}

export default MultiTime;
