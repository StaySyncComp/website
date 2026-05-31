import { useContext, useEffect, useState } from "react";
import { Call } from "@/types/api/calls";
import { fetchCallsParams } from "@/features/calls/api";
import { OrganizationsContext } from "@/features/organization/context/organization-context";
import { ApiResponse } from "@/types/ui/data-table-types";

const parseCallsResponse = (response: unknown): Call[] => {
  if (Array.isArray(response)) return response;
  if (
    response &&
    typeof response === "object" &&
    "data" in response &&
    Array.isArray((response as ApiResponse<Call>).data)
  ) {
    return (response as ApiResponse<Call>).data;
  }
  return [];
};

export const useRoomCalls = (
  locationId: number | undefined,
  isOpen: boolean,
  refreshKey = 0,
) => {
  const { organization } = useContext(OrganizationsContext);
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!locationId || !isOpen || !organization?.id) return;

    const loadCalls = async () => {
      setIsLoading(true);
      try {
        const response = await fetchCallsParams({
          locationId,
          organizationId: organization.id,
          page: 1,
          pageSize: 100,
        });
        setCalls(parseCallsResponse(response));
      } catch (error) {
        console.error("Failed to load room calls", error);
        setCalls([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCalls();
  }, [locationId, isOpen, organization?.id, refreshKey]);

  const activeCalls = calls.filter((call) =>
    ["OPENED", "IN_PROGRESS", "ON_HOLD"].includes(call.status),
  );

  const historyCalls = calls
    .filter((call) => ["COMPLETED", "FAILED"].includes(call.status))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const openCount = activeCalls.length;
  const closedCount = calls.filter((call) => call.status === "COMPLETED").length;

  return { calls, activeCalls, historyCalls, openCount, closedCount, isLoading };
};
