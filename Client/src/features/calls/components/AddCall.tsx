import { useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { OrganizationsContext } from "@/features/organization/context/organization-context";
import { useLocations } from "@/features/organization/hooks/useLocations";
import { useUser } from "@/features/auth/hooks/useUser";
import { getCallFields } from "@/features/calls/config/call-fields";
import { callFormSchema } from "@/features/calls/schemas/call-form-schema";
import DynamicForm from "@/components/common/dynamic-form/DynamicForm";
import { createCall } from "@/features/calls/api";
import {
  asEntityList,
  resolveCallDepartmentId,
} from "@/features/calls/utils/resolveCallDepartment";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CallCategory } from "@/types/api/calls";
import { User } from "@/types/api/user";

interface AddCallProps {
  defaultLocationId?: number;
  lockLocationId?: boolean;
  variant?: "page" | "room-modal";
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddCall({
  defaultLocationId,
  lockLocationId = false,
  variant = "page",
  onSuccess,
  onCancel,
}: AddCallProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { callCategories } = useContext(OrganizationsContext);
  const { locations } = useLocations();
  const { allUsers } = useUser();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isRoomModal = variant === "room-modal";

  const categories = useMemo(
    () => asEntityList<CallCategory>(callCategories),
    [callCategories],
  );

  const users = useMemo(() => asEntityList<User>(allUsers), [allUsers]);

  const statusOptions = Object.entries({
    OPENED: t("status_open"),
    IN_PROGRESS: t("status_in_progress"),
    COMPLETED: t("status_completed"),
    FAILED: t("status_failed"),
    ON_HOLD: t("status_on_hold"),
  }).map(([value, label]) => ({ value, label }));

  const fields = useMemo(
    () =>
      getCallFields(
        t,
        i18n.language as "he" | "en" | "ar",
        locations,
        categories,
        users,
        statusOptions,
      )
        .filter((field) => {
          if (field.name === "status") return false;
          if (lockLocationId && field.name === "locationId") return false;
          return true;
        })
        .map((field) =>
          isRoomModal && field.type === "autocomplete"
            ? {
                ...field,
                props: {
                  ...field.props,
                  popoverClassName: "z-[150]",
                },
              }
            : field,
        ),
    [
      t,
      i18n.language,
      locations,
      categories,
      users,
      statusOptions,
      lockLocationId,
      isRoomModal,
    ],
  );

  const formSchema = lockLocationId
    ? callFormSchema.omit({ locationId: true })
    : callFormSchema;

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setError(null);
    try {
      const assignedToId = data.assignedToId
        ? parseInt(data.assignedToId.toString())
        : undefined;

      const departmentId = resolveCallDepartmentId(
        data.callCategoryId,
        categories,
        assignedToId,
        users,
      );

      if (!departmentId) throw new Error(t("missing_department"));

      const status = assignedToId ? "IN_PROGRESS" : "OPENED";
      const locationId =
        lockLocationId && defaultLocationId
          ? defaultLocationId
          : parseInt(data.locationId.toString());

      const payload = {
        ...data,
        departmentId,
        status: status as "OPENED" | "IN_PROGRESS",
        locationId,
        callCategoryId: parseInt(data.callCategoryId.toString()),
        assignedToId,
      };
      await createCall(payload);
      setSuccess(true);

      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => {
          setSuccess(false);
          navigate("/calls");
        }, 1500);
      }
    } catch (e: any) {
      setError(e?.message || "Unknown error");
    }
  };

  const formContent = (
    <>
      <DynamicForm
        mode="create"
        headerKey="call"
        fields={fields}
        validationSchema={formSchema}
        onSubmit={handleSubmit}
        hideHeader={isRoomModal}
        formClassName={cn(
          "flex flex-col gap-4",
          isRoomModal
            ? "bg-transparent p-0 [&_.w-56]:w-full [&_.flex-wrap]:flex-col [&_.flex-wrap]:gap-4"
            : "bg-surface px-8 py-6 rounded-lg",
        )}
        submitClassName={
          isRoomModal
            ? "h-10 px-6 rounded-xl bg-[#2F80ED] hover:bg-[#2563EB] text-white font-semibold shadow-none"
            : undefined
        }
        submitLabel={isRoomModal ? t("create_new_request") : undefined}
        defaultValues={{
          status: "OPENED",
          ...(defaultLocationId
            ? { locationId: defaultLocationId.toString() }
            : undefined),
        }}
        extraButtons={
          onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className={
                isRoomModal
                  ? "h-10 rounded-xl border-[#E2E8F0] text-[#475569] shadow-none"
                  : undefined
              }
            >
              {t("cancel")}
            </Button>
          )
        }
      />
      {success && !isRoomModal && (
        <div className="text-green-600 text-center mt-2 text-sm">
          {t("call_created_success")}
        </div>
      )}
      {error && (
        <div className="text-destructive text-center mt-2 text-sm">{error}</div>
      )}
    </>
  );

  if (isRoomModal) {
    return formContent;
  }

  return (
    <div
      className={
        onSuccess
          ? ""
          : "flex justify-center items-center min-h-[80vh] bg-muted/50"
      }
    >
      <Card
        className={
          onSuccess ? "border-0 shadow-none" : "w-full max-w-2xl shadow-lg"
        }
      >
        {!onSuccess && (
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {t("add_call")}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>{formContent}</CardContent>
      </Card>
    </div>
  );
}
