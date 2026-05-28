import { useContext, useEffect, useMemo, useState } from "react";
import { createApiService } from "@/lib/api-utils/apiFactory";
import { Call } from "@/types/api/calls";
import { User } from "@/types/api/user";
import { Department } from "@/types/api/departments";
import { OrganizationsContext } from "@/features/organization/context/organization-context";
import { useDashboardFilters } from "@/features/home-dashboard/DashboardEditContext";
import type { DashboardWidgetType } from "@/types/api/dashboardPreferences";
import {
  aggregateCallsToChart,
  buildChartBuckets,
  buildDateRange,
} from "@/features/home-dashboard/utils/chartUtils";
import {
  countEmployeesInDepartment,
  extractArray,
  userInDepartment,
} from "@/features/home-dashboard/utils/dataUtils";
import { useTranslation } from "react-i18next";

const callsApi = createApiService<Call>("/calls", { includeOrgId: true });
const usersApi = createApiService<User>("/users", { includeOrgId: true });

export interface KpiMetric {
  title: string;
  value: number;
  delta: string;
  compare: string;
}

export interface EmployeeRow {
  id: number;
  name: string;
  score: number;
  logo?: string;
}

const KPI_WIDGET_TYPES: DashboardWidgetType[] = [
  "kpi_active",
  "kpi_in_progress",
  "kpi_completed",
  "kpi_total",
  "kpi_employees",
];

export function useHomeDashboardData() {
  const { t, i18n } = useTranslation();
  const { departments } = useContext(OrganizationsContext);
  const { preset, departmentId: selectedDepartmentId } = useDashboardFilters();

  const [calls, setCalls] = useState<Call[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await usersApi.fetchAll({});
        setUsers(extractArray<User>(response.data));
      } catch (err) {
        console.error("Error fetching users", err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await callsApi.fetchAll({});
        setCalls(extractArray<Call>(response.data));
      } catch (err) {
        console.error("Error fetching calls", err);
      }
    })();
  }, []);

  const currentRange = useMemo(() => buildDateRange(preset), [preset]);

  const filteredCalls = useMemo(
    () =>
      calls.filter((c) => {
        const created = new Date(c.createdAt);
        return created >= currentRange.start && created <= currentRange.end;
      }),
    [calls, currentRange.end, currentRange.start],
  );

  const departmentList = useMemo(
    () => extractArray<Department>(departments),
    [departments],
  );

  const scopedCalls = useMemo(() => {
    if (selectedDepartmentId == null) return filteredCalls;
    return filteredCalls.filter(
      (c) => String(c.departmentId) === String(selectedDepartmentId),
    );
  }, [filteredCalls, selectedDepartmentId]);

  const filterByDepartment = (callList: Call[]) => {
    if (selectedDepartmentId == null) return callList;
    return callList.filter(
      (c) => String(c.departmentId) === String(selectedDepartmentId),
    );
  };

  const kpiMetricsList = useMemo<KpiMetric[]>(() => {
    const currentPeriodStart = currentRange.start;
    const currentPeriodEnd = currentRange.end;
    const periodDurationMs =
      currentPeriodEnd.getTime() - currentPeriodStart.getTime();
    const previousPeriodStart = new Date(
      currentPeriodStart.getTime() - periodDurationMs,
    );
    const previousPeriodEnd = new Date(currentPeriodStart);

    const statusUpper = (call: Call) => String(call.status || "").toUpperCase();
    const isActive = (call: Call) =>
      statusUpper(call) === "OPENED" || statusUpper(call) === "IN_PROGRESS";
    const isInProgress = (call: Call) => statusUpper(call) === "IN_PROGRESS";
    const isCompleted = (call: Call) => statusUpper(call) === "COMPLETED";

    const inRange = (call: Call, from: Date, to: Date) => {
      const created = new Date(call.createdAt);
      return created >= from && created < to;
    };

    const currentCalls = scopedCalls;
    const previousCalls = filterByDepartment(
      calls.filter((c) => inRange(c, previousPeriodStart, previousPeriodEnd)),
    );

    const toDelta = (current: number, previous: number) => {
      if (previous <= 0) {
        return current > 0 ? "+100%" : "0%";
      }
      const percent = Math.round(((current - previous) / previous) * 100);
      return `${percent >= 0 ? "+" : ""}${percent}%`;
    };

    const compareText = (previous: number) =>
      t("home_dashboard.kpi_compare", { count: previous });

    const periodCalls = filterByDepartment(
      calls.filter((c) => {
        const created = new Date(c.createdAt);
        return created >= currentPeriodStart && created <= currentPeriodEnd;
      }),
    );
    const totalActive = periodCalls.filter(isActive).length;
    const totalInProgress = periodCalls.filter(isInProgress).length;
    const totalCompleted = periodCalls.filter(isCompleted).length;
    const totalCalls = periodCalls.length;

    const recentActive = currentCalls.filter(isActive).length;
    const previousActive = previousCalls.filter(isActive).length;

    const recentInProgress = currentCalls.filter(isInProgress).length;
    const previousInProgress = previousCalls.filter(isInProgress).length;

    const recentCompleted = currentCalls.filter(isCompleted).length;
    const previousCompleted = previousCalls.filter(isCompleted).length;

    const recentTotal = currentCalls.length;
    const previousTotal = previousCalls.length;

    const employeesCount = countEmployeesInDepartment(
      selectedDepartmentId,
      users,
      departmentList,
    );
    const activeUsersCurrent = new Set(
      currentCalls
        .flatMap((c) => [c.assignedToId, c.createdById])
        .filter((id): id is number => Number.isFinite(id)),
    ).size;
    const activeUsersPrevious = new Set(
      previousCalls
        .flatMap((c) => [c.assignedToId, c.createdById])
        .filter((id): id is number => Number.isFinite(id)),
    ).size;

    const metrics = [
      {
        type: "kpi_active" as const,
        value: totalActive > 0 ? totalActive : recentActive,
        delta: toDelta(recentActive, previousActive),
        compare: compareText(previousActive),
      },
      {
        type: "kpi_in_progress" as const,
        value: totalInProgress > 0 ? totalInProgress : recentInProgress,
        delta: toDelta(recentInProgress, previousInProgress),
        compare: compareText(previousInProgress),
      },
      {
        type: "kpi_completed" as const,
        value: totalCompleted > 0 ? totalCompleted : recentCompleted,
        delta: toDelta(recentCompleted, previousCompleted),
        compare: compareText(previousCompleted),
      },
      {
        type: "kpi_total" as const,
        value: totalCalls > 0 ? totalCalls : recentTotal,
        delta: toDelta(recentTotal, previousTotal),
        compare: compareText(previousTotal),
      },
      {
        type: "kpi_employees" as const,
        value: employeesCount,
        delta: toDelta(activeUsersCurrent, activeUsersPrevious),
        compare: compareText(activeUsersPrevious),
      },
    ];

    return metrics.map((m) => ({
      title: t(`home_dashboard.widgets.${m.type}`),
      value: m.value,
      delta: m.delta,
      compare: m.compare,
    }));
  }, [
    calls,
    currentRange.end,
    currentRange.start,
    departmentList,
    scopedCalls,
    selectedDepartmentId,
    users,
    t,
  ]);

  const kpiMetricsByType = useMemo(() => {
    const map = {} as Record<DashboardWidgetType, KpiMetric>;
    KPI_WIDGET_TYPES.forEach((type, idx) => {
      map[type] = kpiMetricsList[idx];
    });
    return map;
  }, [kpiMetricsList]);

  const topEmployees = useMemo<EmployeeRow[]>(() => {
    const scoreByUser = new Map<number, number>();
    for (const call of scopedCalls) {
      if (!call.assignedToId) continue;
      scoreByUser.set(
        call.assignedToId,
        (scoreByUser.get(call.assignedToId) || 0) + 1,
      );
    }
    const eligibleUsers =
      selectedDepartmentId == null
        ? users
        : users.filter((u) => userInDepartment(u, selectedDepartmentId));

    return eligibleUsers
      .map((u) => ({
        id: Number(u.id),
        name: u.name || u.email || `User ${u.id}`,
        logo: u.logo,
        score: scoreByUser.get(Number(u.id)) || 0,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [users, scopedCalls, selectedDepartmentId]);

  const chartData = useMemo(() => {
    const locale = i18n.language || "he";
    const buckets = buildChartBuckets(
      preset,
      currentRange.start,
      currentRange.end,
      locale,
    );
    return aggregateCallsToChart(scopedCalls, buckets);
  }, [
    scopedCalls,
    preset,
    currentRange.start,
    currentRange.end,
    i18n.language,
  ]);

  const hasEmployeeData = useMemo(
    () => topEmployees.length > 0 && topEmployees.some((e) => e.score > 0),
    [topEmployees],
  );
  const hasChartData = useMemo(
    () => chartData.some((m) => m.open > 0 || m.completed > 0),
    [chartData],
  );

  const demoEmployees = useMemo<EmployeeRow[]>(() => {
    const demoName = t("home_dashboard.demo_employee_name");
    return [
      { id: -1, name: demoName, score: 42 },
      { id: -2, name: demoName, score: 40 },
      { id: -3, name: demoName, score: 38 },
      { id: -4, name: demoName, score: 36 },
    ];
  }, [t]);

  const rangeLabel = useMemo(() => {
    const format = (d: Date) =>
      d.toLocaleDateString(i18n.language || "he", {
        month: "short",
        day: "numeric",
      });
    return `${format(currentRange.start)} - ${format(currentRange.end)}`;
  }, [currentRange.end, currentRange.start, i18n.language]);

  return {
    preset,
    selectedDepartmentId,
    currentRange,
    rangeLabel,
    kpiMetricsByType,
    topEmployees,
    demoEmployees,
    chartData,
    hasEmployeeData,
    hasChartData,
    departmentList,
  };
}
