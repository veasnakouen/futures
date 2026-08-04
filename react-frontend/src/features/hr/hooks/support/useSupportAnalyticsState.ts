import { useState, useEffect, useMemo } from "react";

export const COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Rose
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
];

export function useSupportAnalyticsState(defaultTickets: any[], users: any[]) {
  const [isMounted, setIsMounted] = useState(false);
  const [analyticsDept, setAnalyticsDept] = useState<string>("ALL");
  const [analyticsDatePeriod, setAnalyticsDatePeriod] = useState<string>("ALL");
  const [analyticsTab, setAnalyticsTab] = useState<"STAFF" | "DEPT" | "PRIORITY" | "STATUS">(
    "STAFF"
  );
  const [analyticsChartStyle, setAnalyticsChartStyle] = useState<"pie" | "donut">("pie");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const deptTickets = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    return defaultTickets.filter((t) => {
      if (analyticsDept !== "ALL") {
        const tDept = (t.department || t.category || "").toUpperCase();
        if (
          analyticsDept === "IT" &&
          !(tDept.includes("IT") || tDept.includes("HARDWARE") || tDept.includes("NETWORK"))
        )
          return false;
        if (
          analyticsDept === "MAINTENANCE" &&
          !(tDept.includes("MAINT") || tDept.includes("FACILIT") || tDept.includes("HVAC"))
        )
          return false;
        if (
          analyticsDept === "OUTREACH" &&
          !(tDept.includes("OUTREACH") || tDept.includes("FIELD") || tDept.includes("LOGISTIC"))
        )
          return false;
        if (
          analyticsDept === "CLINIC" &&
          !(tDept.includes("CLINIC") || tDept.includes("MEDICAL") || tDept.includes("HEALTH"))
        )
          return false;
        if (
          analyticsDept === "HR" &&
          !(tDept.includes("HR") || tDept.includes("ADMIN") || tDept.includes("PEOPLE"))
        )
          return false;
      }

      if (analyticsDatePeriod !== "ALL" && t.createdAt) {
        const ticketDate = new Date(t.createdAt);
        if (analyticsDatePeriod === "TODAY" && ticketDate < startOfToday) return false;
        if (analyticsDatePeriod === "THIS_WEEK" && ticketDate < startOfWeek) return false;
        if (analyticsDatePeriod === "THIS_MONTH" && ticketDate < startOfMonth) return false;
        if (
          analyticsDatePeriod === "LAST_MONTH" &&
          (ticketDate < startOfLastMonth || ticketDate > endOfLastMonth)
        )
          return false;
      }

      return true;
    });
  }, [defaultTickets, analyticsDept, analyticsDatePeriod]);

  const deptAggData = useMemo(() => {
    const map: Record<string, number> = {};
    deptTickets.forEach((t) => {
      const d = t.department || t.category || "General Support";
      map[d] = (map[d] || 0) + 1;
    });
    const total = deptTickets.length || 1;
    return Object.entries(map).map(([name, count]) => ({
      name,
      count,
      value: Math.round((count / total) * 100),
    }));
  }, [deptTickets]);

  const staffAggData = useMemo(() => {
    const map: Record<string, number> = {};
    deptTickets.forEach((t) => {
      let name = "Unassigned Staff";
      if (t.assigneeId) {
        const u = users.find((usr: any) => String(usr.id) === String(t.assigneeId));
        if (u) {
          name = `${u.firstName || ""} ${u.lastName || u.username || u.userName || ""}`.trim();
        } else {
          name = `Staff #${t.assigneeId}`;
        }
      }
      map[name] = (map[name] || 0) + 1;
    });
    const total = deptTickets.length || 1;
    return Object.entries(map).map(([name, count]) => ({
      name,
      count,
      value: Math.round((count / total) * 100),
    }));
  }, [deptTickets, users]);

  const priorityAggData = useMemo(() => {
    const map: Record<string, number> = {};
    deptTickets.forEach((t) => {
      const p = t.priority || "NORMAL";
      map[p] = (map[p] || 0) + 1;
    });
    const total = deptTickets.length || 1;
    return Object.entries(map).map(([name, count]) => ({
      name,
      count,
      value: Math.round((count / total) * 100),
    }));
  }, [deptTickets]);

  const statusAggData = useMemo(() => {
    const map: Record<string, number> = {};
    deptTickets.forEach((t) => {
      const s = t.status || "OPEN";
      map[s] = (map[s] || 0) + 1;
    });
    const total = deptTickets.length || 1;
    return Object.entries(map).map(([name, count]) => ({
      name,
      count,
      value: Math.round((count / total) * 100),
    }));
  }, [deptTickets]);

  const staffEvaluationData = useMemo(() => {
    const map: Record<
      string,
      {
        staffId: string;
        staffName: string;
        department: string;
        totalAssigned: number;
        completedCount: number;
        suspendedCount: number;
        onHoldCount: number;
        reopenCount: number;
      }
    > = {};

    deptTickets.forEach((t) => {
      let staffId = String(t.assigneeId || "UNASSIGNED");
      let staffName = "Unassigned Staff";
      let department = t.department || t.category || "General Support";

      if (t.assigneeId) {
        const u = users.find((usr: any) => String(usr.id) === String(t.assigneeId));
        if (u) {
          staffName = `${u.firstName || ""} ${u.lastName || u.username || u.userName || ""}`.trim();
        } else {
          staffName = `Staff #${t.assigneeId}`;
        }
      }

      if (!map[staffId]) {
        map[staffId] = {
          staffId,
          staffName,
          department,
          totalAssigned: 0,
          completedCount: 0,
          suspendedCount: 0,
          onHoldCount: 0,
          reopenCount: 0,
        };
      }

      const rec = map[staffId];
      rec.totalAssigned += 1;
      if (t.status === "RESOLVED" || t.status === "CLOSED") rec.completedCount += 1;
      if (t.status === "SUSPENDED") rec.suspendedCount += 1;
      if (t.status === "ON_HOLD") rec.onHoldCount += 1;
      if (t.status === "REOPENED" || (t.reopenCount && t.reopenCount > 0))
        rec.reopenCount += t.reopenCount || 1;
    });

    return Object.values(map).map((rec) => {
      const total = rec.totalAssigned || 1;
      const reopenRate = Math.round((rec.reopenCount / total) * 100);
      const completionRate = Math.round((rec.completedCount / total) * 100);

      let grade = "A+";
      let gradeColor = "emerald";
      if (reopenRate > 20 || completionRate < 50) {
        grade = "C";
        gradeColor = "rose";
      } else if (reopenRate > 10 || completionRate < 75) {
        grade = "B";
        gradeColor = "amber";
      } else if (reopenRate > 5 || completionRate < 90) {
        grade = "A";
        gradeColor = "blue";
      }

      return {
        ...rec,
        reopenRate,
        completionRate,
        grade,
        gradeColor,
      };
    });
  }, [deptTickets, users]);

  const activeAnalyticsData =
    analyticsTab === "DEPT"
      ? deptAggData
      : analyticsTab === "STAFF"
      ? staffAggData
      : analyticsTab === "PRIORITY"
      ? priorityAggData
      : statusAggData;

  const deptLabel = analyticsDept === "ALL" ? "All Departments" : `${analyticsDept} Department`;
  const dateLabel = analyticsDatePeriod === "ALL" ? "All Time" : analyticsDatePeriod.replace("_", " ");

  const activeAnalyticsTitle =
    analyticsTab === "STAFF"
      ? `Staff Member Ticket Share (${deptLabel} • ${dateLabel})`
      : analyticsTab === "DEPT"
      ? `Ticket Category Share (${deptLabel} • ${dateLabel})`
      : analyticsTab === "PRIORITY"
      ? `Priority Escalation Breakdown (${deptLabel} • ${dateLabel})`
      : `Ticket Lifecycle Status (${deptLabel} • ${dateLabel})`;

  return {
    isMounted,
    analyticsDept,
    setAnalyticsDept,
    analyticsDatePeriod,
    setAnalyticsDatePeriod,
    analyticsTab,
    setAnalyticsTab,
    analyticsChartStyle,
    setAnalyticsChartStyle,
    activeAnalyticsData,
    activeAnalyticsTitle,
    staffEvaluationData,
  };
}
