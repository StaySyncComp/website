import { MultiSelect } from "@/components/common/data-table/multi-select";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FieldConfig } from "./DynamicForm";

interface Props {
  field: FieldConfig;
  error: any;
  control: any;
  requiredFields: string[];
  defaultValues: any;
}

function MultiCheckBox({
  field,
  error,
  control,
  requiredFields,
  defaultValues,
}: Props) {
  const { t } = useTranslation();
  return (
    <div key={field.name} className="flex flex-col gap-1 w-56">
      <label>
        {t(field.label)}
        {requiredFields.includes(field.name) && (
          <span className="text-red-500 ml-1">{t("form.required_field")}</span>
        )}
      </label>
      <Controller
        name={field.name}
        control={control}
        defaultValue={defaultValues?.[field.name] || []} // Ensure default value is an array
        render={({ field: controllerField }) => (
          <MultiSelect
            // @ts-ignore
            options={field.options || []} // Pass the options to MultiSelect
            selected={controllerField.value} // Bind selected values
            onChange={(selected) => controllerField.onChange(selected)} // Update form state
            placeholder={t("select_option")} // Placeholder text
            emptyText={t("no_options_found")} // Text when no options are available
          />
        )}
      />
      {error && (
        <span className="text-red-500 text-sm">
          {t("form.error_message")}:{" "}
          {typeof error.message === "string"
            ? error.message
            : Array.isArray(error.message)
              ? error.message.map((m: { message?: string }) => m?.message).join(", ")
              : String(error.message ?? "")}
        </span>
      )}
    </div>
  );
}

export default MultiCheckBox;
