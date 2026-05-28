import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { ZodEffects, ZodObject } from "zod";
import LanguageInput from "@/components/common/LanguageInput";

import TextCase from "./TextCase";
import CheckBoxCase from "./CheckBoxCase";
import ImageCase from "./ImageCase";
import AutocompleteCase from "./AutocompleteCase";
import DateCase from "./DateCase";
import MultiTime from "./MultiTime";
import MultiCheckBox from "./MultiCheckBox";
import NumberCase from "./NumberCase";
import IconSelect from "./IconSelect";

type LanguageValue = { [lang: string]: string };

type FieldType =
  | "text"
  | "email"
  | "textarea"
  | "language"
  | "image"
  | "select"
  | "autocomplete"
  | "checkbox"
  | "readonly"
  | "custom"
  | "icon-select"
  | "multi-time"
  | "date"
  | "number"
  | "multi-checkbox";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  options?: { label: string; value: string | number }[];
  customRender?: (fieldProps: any) => React.ReactNode;
  defaultValue?: string | number | boolean;
  props?: Record<string, any>;
  onChange?: (value: string) => void;
}

interface DynamicFormProps {
  mode: "create" | "edit";
  fields: FieldConfig[];
  defaultValues?: any;
  validationSchema: ZodObject<any> | ZodEffects<ZodObject<any>>;
  onSubmit: (data: any) => void;
  headerKey?: string;
  extraButtons?: React.ReactNode;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  mode,
  fields,
  defaultValues,
  validationSchema,
  onSubmit,
  headerKey = "",
  extraButtons,
}) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    getValues,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
    mode: "onChange",
    shouldUnregister: false,
  });
  console.log(getValues(), "getValues");
  console.log(defaultValues, "defaultValues");

  const imageField = fields.find((f) => f.type === "image");
  const imageFieldName = imageField?.name;
  const watchedImageFile = watch(imageFieldName || "");

  useEffect(() => {
    if (watchedImageFile instanceof File) {
      const url = URL.createObjectURL(watchedImageFile);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof watchedImageFile === "string") {
      setPreview(watchedImageFile);
    }
  }, [watchedImageFile]);

  const renderField = (field: FieldConfig) => {
    const error = errors[field.name];
    const requiredFields = [
      "description",
      "location",
      "departmentId",
      "status",
      "callCategoryId",
    ];

    switch (field.type) {
      case "text":
      case "email":
      case "textarea":
        return (
          <TextCase
            error={error}
            field={field}
            register={register}
            requiredFields={requiredFields}
          />
        );

      case "checkbox":
        return (
          <CheckBoxCase
            defaultValues={defaultValues}
            error={error}
            field={field}
            register={register}
            requiredFields={requiredFields}
          />
        );

      case "language":
        return (
          <div key={field.name} className="flex flex-col gap-1 w-56">
            <LanguageInput
              label={field.label}
              defaultValue={defaultValues?.[field.name]}
              onLanguageValuesChange={(val: LanguageValue) => {
                setValue(field.name, val, { shouldDirty: true });
              }}
            />
            {error && (
              <span className="text-red-500 text-sm">
                {t("form.error_message")}: {error.message as string}
              </span>
            )}
          </div>
        );

      case "image":
        return (
          <ImageCase
            error={error}
            field={field}
            setValue={setValue}
            preview={preview}
          />
        );
      case "icon-select":
        return (
          <Controller
            control={control}
            name={field.name}
            render={({ field: { value, onChange } }) => (
              <IconSelect
                field={field}
                value={value}
                setValue={(_, newValue) => onChange(newValue)}
              />
            )}
          />
        );

      case "autocomplete":
        return (
          <AutocompleteCase
            control={control}
            field={field}
            error={error}
            defaultValues={defaultValues}
            requiredFields={requiredFields}
          />
        );

      case "date":
        return (
          <DateCase
            field={field}
            error={error}
            control={control}
            requiredFields={requiredFields}
            defaultValues={defaultValues}
          />
        );
      case "multi-time":
        return (
          <MultiTime
            field={field}
            error={error}
            control={control}
            requiredFields={requiredFields}
            defaultValues={defaultValues}
          />
        );

      case "multi-checkbox":
        return (
          <MultiCheckBox
            field={field}
            error={error}
            control={control}
            defaultValues={defaultValues}
            requiredFields={requiredFields}
          />
        );
      case "custom":
        return field.customRender ? (
          <div key={field.name} className="">
            {field.customRender({ register, setValue, error })}
          </div>
        ) : null;

      case "number":
        return (
          <NumberCase
            field={field}
            error={error}
            register={register}
            requiredFields={requiredFields}
            setValue={setValue}
          />
        );

      default:
        return null;
    }
  };

  const handleDynamicSubmit = (
    callback: (data: any) => void | Promise<void>,
  ) => {
    return async (data: any) => {
      const result = callback(data);
      if (result instanceof Promise) {
        await result;
        reset(data);
      }
    };
  };
  return (
    <form
      onSubmit={handleSubmit(handleDynamicSubmit(onSubmit))}
      className="flex flex-col gap-4 bg-surface px-8 py-6 rounded-lg"
    >
      <h2 className="text-base font-semibold text-accent rtl:text-right ltr:text-left">
        {mode === "edit"
          ? t("editing_x", { x: t(headerKey) })
          : t("add_x", { x: t(headerKey) })}
      </h2>

      <div className="flex gap-6 flex-wrap">
        {/* Image Section */}
        {fields.find((f) => f.type === "image" || f.type === "icon-select") && (
          <div className="h-full">
            {renderField(
              fields.find(
                (f) => f.type === "image" || f.type === "icon-select",
              )!,
            )}
          </div>
        )}
        {fields.find((f) => f.type === "language") && (
          <div className="h-full">
            {renderField(fields.find((f) => f.type === "language")!)}
          </div>
        )}

        {/* Other Fields */}
        <div className="flex gap-6 flex-wrap flex-1">
          {fields
            .filter(
              (f) =>
                f.type !== "image" &&
                f.type !== "language" &&
                f.type !== "icon-select",
            )
            .map(renderField)}
        </div>
      </div>

      <div className="flex gap-4 justify-end mt-4">
        {extraButtons}
        <Button
          variant={"default"}
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting || !isDirty}
          className="w-fit px-8 text-surface hover:text-surface"
        >
          {t(mode === "create" ? "create" : "save")}
        </Button>
      </div>
    </form>
  );
};

export default DynamicForm;
