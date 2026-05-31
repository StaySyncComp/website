import { useState, useEffect, useCallback, useRef } from "react";
import { fetchAllCleaningStates } from "@/features/cleaning/api";
import { CleaningTask } from "@/features/cleaning/types";

/**
 * Fetches all room cleaning states for the current organization.
 * Server auto-initializes missing states on GET /cleaning.
 * Refetches are silent so open modals/overlays are not unmounted.
 */
export const useCleaningStates = () => {
  const [cleaningStates, setCleaningStates] = useState<CleaningTask[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const hasLoadedRef = useRef(false);

  const fetchStates = useCallback(async () => {
    setError(null);
    if (!hasLoadedRef.current) {
      setIsInitialLoading(true);
    }

    try {
      const states = await fetchAllCleaningStates();
      setCleaningStates(states);
      hasLoadedRef.current = true;
    } catch (err) {
      console.error("Failed to load cleaning states", err);
      setError(err as Error);
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  return {
    cleaningStates,
    isInitialLoading,
    fetchStates,
    error,
  };
};
