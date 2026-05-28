import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DEFAULT_DASHBOARD_CONFIG } from "@/features/home-dashboard/constants";
import { normalizeDashboardConfig } from "@/features/home-dashboard/normalizeConfig";
import {
  useDashboardPreferencesQuery,
  useSaveDashboardPreferences,
} from "@/features/home-dashboard/hooks/useDashboardPreferences";
import type {
  DashboardConfig,
  DashboardWidgetType,
  QuickDatePreset,
} from "@/types/api/dashboardPreferences";

interface DashboardEditContextValue {
  config: DashboardConfig;
  isEditMode: boolean;
  isLoading: boolean;
  isSaving: boolean;
  enterEditMode: () => void;
  cancelEdit: () => void;
  saveLayout: () => Promise<void>;
  removeWidget: (type: DashboardWidgetType) => void;
  addWidget: (type: DashboardWidgetType) => void;
  setKpiOrder: (order: DashboardWidgetType[]) => void;
  setMainOrder: (order: DashboardWidgetType[]) => void;
  updateFilters: (filters: Partial<DashboardConfig["filters"]>) => void;
  hiddenWidgets: DashboardWidgetType[];
}

const DashboardEditContext = createContext<DashboardEditContextValue | null>(
  null,
);

function cloneConfig(config: DashboardConfig): DashboardConfig {
  return JSON.parse(JSON.stringify(config));
}

export function DashboardEditProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: loadedConfig, isLoading } = useDashboardPreferencesQuery();
  const saveMutation = useSaveDashboardPreferences();

  const [savedConfig, setSavedConfig] = useState<DashboardConfig>(
    DEFAULT_DASHBOARD_CONFIG,
  );
  const [draftConfig, setDraftConfig] = useState<DashboardConfig>(
    DEFAULT_DASHBOARD_CONFIG,
  );
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (!loadedConfig) return;
    setSavedConfig(loadedConfig);
    if (!isEditMode) {
      setDraftConfig(cloneConfig(loadedConfig));
    }
  }, [loadedConfig, isEditMode]);

  const activeConfig = isEditMode ? draftConfig : savedConfig;

  const setActiveConfig = useCallback(
    (updater: (prev: DashboardConfig) => DashboardConfig) => {
      if (isEditMode) {
        setDraftConfig((prev) => updater(prev));
      } else {
        setSavedConfig((prev) => {
          const next = updater(prev);
          saveMutation.mutate(next);
          return next;
        });
      }
    },
    [isEditMode, saveMutation],
  );

  const enterEditMode = useCallback(() => {
    setDraftConfig(cloneConfig(savedConfig));
    setIsEditMode(true);
  }, [savedConfig]);

  const cancelEdit = useCallback(() => {
    setDraftConfig(cloneConfig(savedConfig));
    setIsEditMode(false);
  }, [savedConfig]);

  const saveLayout = useCallback(async () => {
    const normalized = normalizeDashboardConfig(draftConfig);
    await saveMutation.mutateAsync(normalized);
    setSavedConfig(normalized);
    setDraftConfig(cloneConfig(normalized));
    setIsEditMode(false);
  }, [draftConfig, saveMutation]);

  const removeWidget = useCallback(
    (type: DashboardWidgetType) => {
      setActiveConfig((prev) => {
        const hidden = prev.hidden.includes(type)
          ? prev.hidden
          : [...prev.hidden, type];
        return {
          ...prev,
          hidden,
          kpiOrder: prev.kpiOrder.filter((id) => id !== type),
          mainOrder: prev.mainOrder.filter((id) => id !== type),
        };
      });
    },
    [setActiveConfig],
  );

  const addWidget = useCallback(
    (type: DashboardWidgetType) => {
      setActiveConfig((prev) => {
        const isKpi = type.startsWith("kpi_");
        const hidden = prev.hidden.filter((id) => id !== type);
        const kpiOrder =
          isKpi && !prev.kpiOrder.includes(type)
            ? [...prev.kpiOrder, type]
            : prev.kpiOrder;
        const mainOrder =
          !isKpi && !prev.mainOrder.includes(type)
            ? [...prev.mainOrder, type]
            : prev.mainOrder;
        return { ...prev, hidden, kpiOrder, mainOrder };
      });
    },
    [setActiveConfig],
  );

  const setKpiOrder = useCallback(
    (order: DashboardWidgetType[]) => {
      setActiveConfig((prev) => ({ ...prev, kpiOrder: order }));
    },
    [setActiveConfig],
  );

  const setMainOrder = useCallback(
    (order: DashboardWidgetType[]) => {
      setActiveConfig((prev) => ({ ...prev, mainOrder: order }));
    },
    [setActiveConfig],
  );

  const updateFilters = useCallback(
    (filters: Partial<DashboardConfig["filters"]>) => {
      setActiveConfig((prev) => ({
        ...prev,
        filters: { ...prev.filters, ...filters },
      }));
    },
    [setActiveConfig],
  );

  const hiddenWidgets = activeConfig.hidden;

  const value = useMemo(
    () => ({
      config: activeConfig,
      isEditMode,
      isLoading,
      isSaving: saveMutation.isPending,
      enterEditMode,
      cancelEdit,
      saveLayout,
      removeWidget,
      addWidget,
      setKpiOrder,
      setMainOrder,
      updateFilters,
      hiddenWidgets,
    }),
    [
      activeConfig,
      isEditMode,
      isLoading,
      saveMutation.isPending,
      enterEditMode,
      cancelEdit,
      saveLayout,
      removeWidget,
      addWidget,
      setKpiOrder,
      setMainOrder,
      updateFilters,
      hiddenWidgets,
    ],
  );

  return (
    <DashboardEditContext.Provider value={value}>
      {children}
    </DashboardEditContext.Provider>
  );
}

export function useDashboardEdit() {
  const ctx = useContext(DashboardEditContext);
  if (!ctx) {
    throw new Error("useDashboardEdit must be used within DashboardEditProvider");
  }
  return ctx;
}

export function useDashboardEditOptional() {
  return useContext(DashboardEditContext);
}

export function useDashboardFilters() {
  const { config, updateFilters } = useDashboardEdit();
  const setPreset = (preset: QuickDatePreset) => updateFilters({ preset });
  const setDepartmentId = (departmentId: number | null) =>
    updateFilters({ departmentId });
  return {
    preset: config.filters.preset,
    departmentId: config.filters.departmentId,
    setPreset,
    setDepartmentId,
  };
}
