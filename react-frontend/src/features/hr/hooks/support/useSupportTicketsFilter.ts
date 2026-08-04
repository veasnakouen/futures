import { useState, useMemo } from "react";

export function useSupportTicketsFilter(defaultTickets: any[]) {
  const [search, setSearch] = useState("");
  const [departmentTab, setDepartmentTab] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("UNASSIGNED");
  const [priorityFilter, setPriorityFilter] = useState<string>("");

  const filtered = useMemo(() => {
    return defaultTickets.filter((t) => {
      const titleMatch =
        (t.subject || t.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (t.id || "").toString().includes(search.toLowerCase());

      let deptMatch = true;
      if (departmentTab !== "ALL") {
        const tDept = (t.department || t.category || "").toUpperCase();
        if (departmentTab === "IT")
          deptMatch =
            tDept.includes("IT") || tDept.includes("HARDWARE") || tDept.includes("NETWORK");
        else if (departmentTab === "MAINTENANCE")
          deptMatch =
            tDept.includes("MAINT") || tDept.includes("FACILIT") || tDept.includes("HVAC");
        else if (departmentTab === "OUTREACH")
          deptMatch =
            tDept.includes("OUTREACH") || tDept.includes("FIELD") || tDept.includes("LOGISTIC");
        else if (departmentTab === "CLINIC")
          deptMatch =
            tDept.includes("CLINIC") || tDept.includes("MEDICAL") || tDept.includes("HEALTH");
        else if (departmentTab === "HR")
          deptMatch =
            tDept.includes("HR") || tDept.includes("ADMIN") || tDept.includes("PEOPLE");
      }

      const catMatch =
        !categoryFilter ||
        (t.category || t.ticketType || t.type?.name || "").toLowerCase() ===
          categoryFilter.toLowerCase();

      let statusMatch = true;
      if (statusFilter === "UNASSIGNED") {
        const isUnassigned =
          !t.assigneeId ||
          t.assigneeId === "" ||
          String(t.assigneeId).toLowerCase() === "unassigned";
        const isNewOrOpen =
          !t.status ||
          t.status.toUpperCase() === "OPEN" ||
          t.status.toUpperCase() === "UNASSIGNED" ||
          t.status.toUpperCase() === "NEW";
        statusMatch = isUnassigned && isNewOrOpen;
      } else if (statusFilter) {
        statusMatch = (t.status || "").toUpperCase() === statusFilter.toUpperCase();
      }

      const priorityMatch =
        !priorityFilter || (t.priority || "").toUpperCase() === priorityFilter.toUpperCase();

      return titleMatch && deptMatch && catMatch && statusMatch && priorityMatch;
    });
  }, [defaultTickets, search, departmentTab, categoryFilter, statusFilter, priorityFilter]);

  const totalCount = defaultTickets.length;
  const inProgressCount = defaultTickets.filter(
    (t) => t.status === "IN_PROGRESS" || t.status === "OPEN"
  ).length;
  const criticalCount = defaultTickets.filter(
    (t) => t.priority === "HIGH" || t.priority === "URGENT" || t.priority === "Level 3"
  ).length;
  const resolvedCount = defaultTickets.filter(
    (t) => t.status === "RESOLVED" || t.status === "CLOSED"
  ).length;
  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 100;

  return {
    search,
    setSearch,
    departmentTab,
    setDepartmentTab,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    filtered,
    totalCount,
    inProgressCount,
    criticalCount,
    resolvedCount,
    resolutionRate,
  };
}
