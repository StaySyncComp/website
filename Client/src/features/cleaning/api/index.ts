import apiClient from "@/lib/api-client";
import { getSelectedOrganization } from "@/lib/utils/hooks/UseOrganizationUtils";
import { CleaningTask, CleaningStatus } from "@/features/cleaning/types";

export const mapServerCleaningToTask = (state: any): CleaningTask => ({
  id: state.id,
  locationId: state.locationId,
  status: state.status as CleaningStatus,
  assignedToId: state.assignedToId ?? undefined,
  lastCleanedAt: state.lastCleanedAt ?? undefined,
  priority: state.priority ?? "normal",
  history: (state.history || []).map((entry: any) => ({
    action: entry.action,
    timestamp: entry.createdAt,
    performerName: entry.performedBy?.name,
  })),
});

export const parseCleaningStatesResponse = (response: unknown): CleaningTask[] => {
  let raw: unknown[] = [];

  if (Array.isArray(response)) {
    raw = response;
  } else if (response && typeof response === "object" && "data" in response) {
    const data = (response as { data: unknown }).data;
    if (Array.isArray(data)) raw = data;
  }

  return raw.map(mapServerCleaningToTask);
};

export const fetchAllCleaningStates = async (): Promise<CleaningTask[]> => {
  const organizationId = getSelectedOrganization();
  const { data } = await apiClient.get("/cleaning", {
    params: { organizationId },
  });
  return parseCleaningStatesResponse(data);
};

export const fetchLocationCleaning = async (
  locationId: number,
  organizationId: number,
): Promise<CleaningTask> => {
  const { data } = await apiClient.get(`/locations/${locationId}/cleaning`, {
    params: { organizationId },
  });
  return mapServerCleaningToTask(data);
};

export const patchLocationCleaning = async (
  locationId: number,
  payload: {
    status?: CleaningStatus;
    assignedToId?: number | null;
    organizationId?: number;
  },
): Promise<CleaningTask> => {
  const organizationId =
    payload.organizationId ?? getSelectedOrganization();
  const { data } = await apiClient.patch(
    `/locations/${locationId}/cleaning`,
    { ...payload, organizationId },
  );
  return mapServerCleaningToTask(data);
};

/** @deprecated Prefer patchLocationCleaning — kept for backward compatibility */
export const updateCleaningTaskStatus = async (
  stateId: number,
  status: CleaningStatus,
): Promise<CleaningTask> => {
  const res = await apiClient.put(`/cleaning/${stateId}/status`, { status });
  return mapServerCleaningToTask(res.data);
};

/** @deprecated Prefer patchLocationCleaning */
export const assignWorkerToTask = async (
  stateId: number,
  userId: number,
): Promise<CleaningTask> => {
  const res = await apiClient.put(`/cleaning/${stateId}/assign`, { userId });
  return mapServerCleaningToTask(res.data);
};

export const initializeCleaningStates = async (organizationId?: number) => {
  await apiClient.post("/cleaning/init", {
    organizationId: organizationId ?? getSelectedOrganization(),
  });
};

/** @deprecated Use initializeCleaningStates */
export const initializeMockData = initializeCleaningStates;
