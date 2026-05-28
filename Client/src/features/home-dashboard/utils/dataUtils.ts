import { Department } from "@/types/api/departments";
import { User } from "@/types/api/user";

export function extractArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const maybeData = (payload as { data?: unknown }).data;
    if (Array.isArray(maybeData)) return maybeData as T[];
  }
  return [];
}

export function userInDepartment(
  user: User,
  departmentId: string | number,
): boolean {
  return (
    user.organizationRoles?.some(
      (role) => String(role.departmentId) === String(departmentId),
    ) ?? false
  );
}

export function countEmployeesInDepartment(
  departmentId: string | number | null,
  userList: User[],
  depts: Department[],
): number {
  if (departmentId == null) {
    const totalFromDepts = depts.reduce(
      (sum, d) => sum + (d._count?.OrganizationRole ?? 0),
      0,
    );
    return totalFromDepts > 0 ? totalFromDepts : userList.length;
  }

  const dept = depts.find((d) => String(d.id) === String(departmentId));
  if (dept?._count?.OrganizationRole != null) {
    return dept._count.OrganizationRole;
  }

  return userList.filter((u) => userInDepartment(u, departmentId)).length;
}
