import { CallCategory } from "@/types/api/calls";
import { User } from "@/types/api/user";

export function asEntityList<T>(value: unknown): T[] {
  if (!value) return [];
  if (Array.isArray(value)) return value as T[];
  if (typeof value === "object" && value !== null && "data" in value) {
    const data = (value as { data?: unknown }).data;
    if (Array.isArray(data)) return data as T[];
  }
  return [];
}

export function resolveCallDepartmentId(
  callCategoryId: string | number,
  callCategories: CallCategory[],
  assignedToId?: string | number,
  users: User[] = [],
): number | undefined {
  const category = callCategories.find(
    (cat) => Number(cat.id) === Number(callCategoryId),
  );

  if (category?.departmentId) {
    return Number(category.departmentId);
  }

  if (assignedToId) {
    const user = users.find((u) => Number(u.id) === Number(assignedToId));
    const roleDepartmentId = user?.organizationRoles?.find(
      (role) => role.departmentId,
    )?.departmentId;
    if (roleDepartmentId) {
      return Number(roleDepartmentId);
    }
  }

  return undefined;
}
