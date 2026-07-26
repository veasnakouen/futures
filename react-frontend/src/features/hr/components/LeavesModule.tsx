import React, { useState } from "react";
import { Button, Badge, Avatar, TextInput, Dropdown, DropdownItem, DropdownDivider } from '@/lib/flowbite-compat';
import {
  CheckCircle,
  XCircle,
  X,
  Info,
  Search,
  Calendar,
  TrendingUp,
  Clock,
  LayoutGrid,
  List,
  MoreVertical,
} from "lucide-react";
import { format } from "date-fns";
import { AppCard } from '@/components/ui/AppCard';
import { DataTable, DataTableColumn } from "../../../components/ui/DataTable";
import SearchInput from "@/components/common/SearchInput";
import { GlobalLeaveCalendar } from "./GlobalLeaveCalendar";

interface LeavesModuleProps {
  globalLeaves: any[];
  onUpdateStatus: (id: number, status: string) => void;
}

const LeavesModule: React.FC<LeavesModuleProps> = ({
  globalLeaves,
  onUpdateStatus,
}) => {
  const [filter, setFilter] = useState<
    "ALL" | "PENDING" | "APPROVED" | "REJECTED"
  >("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "calendar">(() => {
    const saved = (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => { }, removeItem: () => { } }).getItem("leavesViewMode");
    return saved === "list" || saved === "grid" || saved === "calendar" ? saved : "grid";
  });
  const [itemsPerRow, setItemsPerRow] = useState("4");

  React.useEffect(() => {
    (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => { }, removeItem: () => { } }).setItem("leavesViewMode", viewMode);
  }, [viewMode]);

const safeFormatDate = (dateVal: any, formatStr: string, fallback: string = "—") => {
  if (!dateVal) return fallback;
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return fallback;
    return format(d, formatStr);
  } catch {
    return fallback;
  }
};

  const safeLeaves = Array.isArray(globalLeaves) ? globalLeaves : [];

  const columns: DataTableColumn<any>[] = [
    {
      key: "employee",
      label: "Employee",
      render: (l) => (
        <div className="flex items-center gap-3">
          <Avatar rounded size="sm" />
          <div>
            <p className="text-sm font-black dark:text-white truncate max-w-[200px]">
              {l.employee
                ? `${l.employee.firstNameEnglish} ${l.employee.lastNameEnglish}`
                : l.employeeName}
            </p>
            <p className="text-[10px] font-bold text-gray-400 mt-0.5 flex items-center gap-1">
              <Clock size={10} /> Req{" "}
              {safeFormatDate(l.createdAt, "MMM dd")}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "typeAndDates",
      label: "Type & Dates",
      align: "center",
      render: (l) => (
        <div className="flex flex-col items-center">
          <Badge
            color={l.leaveType === "Sick" ? "failure" : "info"}
            className="rounded-md px-3 text-[9px] font-black uppercase mb-1"
          >
            {l.leaveType}
          </Badge>
          <span className="text-[11px] font-black text-gray-500 text-center">
            {safeFormatDate(l.startDate, "MMM dd")} -{" "}
            {safeFormatDate(l.endDate, "MMM dd")}
          </span>
        </div>
      ),
    },
    {
      key: "reason",
      label: "Reason / Note",
      render: (l) => (
        <div className="text-xs font-bold text-gray-600 dark:text-gray-400 line-clamp-2 max-w-sm">
          {l.reason || "No details provided"}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (l) => (
        <Badge
          color={
            l.status === "APPROVED"
              ? "success"
              : l.status === "REJECTED"
                ? "failure"
                : "warning"
          }
          className="rounded-md px-4 py-1 text-[9px] font-black uppercase tracking-widest inline-flex"
        >
          {l.status ? l.status.replace("_", " ") : "UNKNOWN"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (l) => (
        <div
          className="flex justify-end gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {l.status === "PENDING_MANAGER" || l.status === "PENDING_CHAIRMAN" ? (
            <>
              <Button
                color="blue"
                size="xs"
                onClick={() => onUpdateStatus(l.id, "APPROVED")}
                className="rounded-md font-black uppercase text-[9px] h-8 shadow-md"
              >
                Approve
              </Button>
              <Button
                color="light"
                size="xs"
                onClick={() => onUpdateStatus(l.id, "REJECTED")}
                className="rounded-md font-black uppercase text-[9px] h-8"
              >
                Decline
              </Button>
            </>
          ) : (
            <span className="text-gray-400 text-[10px] font-bold">-</span>
          )}
        </div>
      ),
    },
  ];

  // Real-time Analytics
  const pendingCount = safeLeaves.filter(
    (l) => l.status === "PENDING_MANAGER" || l.status === "PENDING_CHAIRMAN",
  ).length;
  const approvedCount = safeLeaves.filter(
    (l) => l.status === "APPROVED",
  ).length;
  const sickDaysTotal = safeLeaves.filter(
    (l) => l.status === "APPROVED" && l.leaveType === "Sick",
  ).length;

  const filteredLeaves = safeLeaves.filter((l) => {
    const name = l.employee
      ? `${l.employee.firstNameEnglish} ${l.employee.lastNameEnglish}`
      : l.employeeName || "";
    const matchesSearch = name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "ALL" ||
      (filter === "PENDING" &&
        (l.status === "PENDING_MANAGER" || l.status === "PENDING_CHAIRMAN")) ||
      (filter === "APPROVED" && l.status === "APPROVED") ||
      (filter === "REJECTED" && l.status === "REJECTED");
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* KPI Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-md dark:bg-gray-800 border-none shadow-sm border-l-4 border-l-amber-500">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            Pending Approval
          </p>
          <h4 className="text-3xl font-black dark:text-white">
            {pendingCount}
          </h4>
        </div>
        <div className="p-6 rounded-md dark:bg-gray-800 border-none shadow-sm border-l-4 border-l-emerald-500">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            Approved This Month
          </p>
          <h4 className="text-3xl font-black dark:text-white">
            {approvedCount}
          </h4>
        </div>
        <div className="p-6 rounded-md dark:bg-gray-800 border-none shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            Total Sick Leave
          </p>
          <h4 className="text-3xl font-black text-red-500">
            {sickDaysTotal} Days
          </h4>
        </div>
        <div className="p-6 rounded-md bg-blue-600 text-white border-none shadow-lg shadow-blue-500/20">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">
            Capacity Impact
          </p>
          <h4 className="text-xl font-black">Stable (92%)</h4>
          <p className="text-[9px] font-bold mt-2 opacity-70">
            Current workforce presence
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-md shadow-sm">
        <div className="flex bg-gray-100/80 dark:bg-gray-900/60 p-1.5 rounded-md /50 shadow-inner w-full sm:w-max overflow-x-auto whitespace-nowrap no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex-nowrap shrink-0 gap-1.5">
          {(["PENDING", "APPROVED", "ALL"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`shrink-0 px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all duration-300 flex items-center justify-center gap-2 ${filter === t ? "bg-white dark:bg-gray-800 shadow-md text-blue-600 dark:text-blue-400 scale-100" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          {viewMode === "grid" && (
            <div className="flex-shrink-0">
              <select
                className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-0 focus:border-transparent transition-all duration-200 text-xs h-9 border-none outline-none px-3 min-w-[100px] font-bold cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                value={itemsPerRow}
                onChange={(e) => setItemsPerRow(e.target.value)}
              >
                <option value="3">3 per row</option>
                <option value="4">4 per row</option>
                <option value="5">5 per row</option>
              </select>
            </div>
          )}
          <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-md shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`py-1.5 px-2 rounded-md transition-all ${viewMode === "grid" ? "bg-white dark:bg-gray-600 shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`py-1.5 px-2 rounded-md transition-all ${viewMode === "list" ? "bg-white dark:bg-gray-600 shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`py-1.5 px-2 rounded-md transition-all ${viewMode === "calendar" ? "bg-white dark:bg-gray-600 shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <Calendar size={16} />
            </button>
          </div>
          <div className="relative w-full md:w-80">
            <SearchInput
              placeholder="Search requests by staff name..."
              value={searchQuery}
              onChange={setSearchQuery}
              containerClassName="rounded-md pr-8"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-md transition-colors focus:outline-none"
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {filteredLeaves.length === 0 && viewMode !== "calendar" ? (
        <div className="py-32 text-center rounded-md bg-white/30 dark:bg-gray-800/20 backdrop-blur-sm mt-8">
          <Calendar size={64} className="mx-auto text-gray-300 mb-6" />
          <h3 className="text-xl font-black dark:text-white uppercase tracking-widest">
            No Leave Requests
          </h3>
          <p className="text-[10px] font-bold text-gray-500 mt-2 uppercase tracking-widest">
            Everything is synchronized and up to date
          </p>
        </div>
      ) : viewMode === "calendar" ? (
        <GlobalLeaveCalendar globalLeaves={safeLeaves} />
      ) : viewMode === "grid" ? (
        <div className={`grid gap-6 mt-8 ${itemsPerRow === "3" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : itemsPerRow === "5" ? "grid-cols-1 md:grid-cols-3 lg:grid-cols-5" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}`}>
          {filteredLeaves.map((l) => (
            <AppCard
              key={l.id}
              statusColor={
                l.status === "APPROVED"
                  ? "emerald"
                  : l.status === "REJECTED"
                    ? "red"
                    : "amber"
              }
              headerLeft={
                <Avatar rounded size="md" className="justify-start" />
              }
              headerRight={
                <Badge
                  color={
                    l.status === "APPROVED"
                      ? "success"
                      : l.status === "REJECTED"
                        ? "failure"
                        : "warning"
                  }
                  className="rounded-md px-3 py-1 text-[9px] font-black uppercase tracking-widest"
                >
                  {l.status ? l.status.replace("_", " ") : "UNKNOWN"}
                </Badge>
              }
              actions={
                l.status === "PENDING_MANAGER" ||
                  l.status === "PENDING_CHAIRMAN" ? (
                  <>
                    <DropdownItem
                      onClick={() =>
                        setTimeout(() => onUpdateStatus(l.id, "APPROVED"), 0)
                      }
                      className="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 font-bold text-xs flex items-center"
                    >
                      <CheckCircle size={14} className="mr-2" /> Approve Request
                    </DropdownItem>
                    <DropdownDivider className="my-1" />
                    <DropdownItem
                      onClick={() =>
                        setTimeout(() => onUpdateStatus(l.id, "REJECTED"), 0)
                      }
                      className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold text-xs flex items-center"
                    >
                      <XCircle size={14} className="mr-2" /> Decline Request
                    </DropdownItem>
                  </>
                ) : undefined
              }
            >
              <div className="flex flex-col gap-4 mb-6">
                <div>
                  <h4 className="text-lg font-black dark:text-white line-clamp-1">
                    {l.employee
                      ? `${l.employee.firstNameEnglish} ${l.employee.lastNameEnglish}`
                      : l.employeeName}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      color={l.leaveType === "Sick" ? "failure" : "info"}
                      className="rounded-md px-3 text-[9px] font-black uppercase"
                    >
                      {l.leaveType}
                    </Badge>
                    <span className="text-[9px] font-black text-gray-400 uppercase flex items-center gap-1">
                      <Clock size={10} /> Requested{" "}
                      {safeFormatDate(l.createdAt, "MMM dd")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50/50 dark:bg-gray-700/30 p-4 rounded-sm mt-auto">
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                      Duration
                    </p>
                    <p className="text-xs font-black dark:text-white flex items-center gap-2">
                      {safeFormatDate(l.startDate, "MMM dd")}{" "}
                      <span className="opacity-30">→</span>{" "}
                      {safeFormatDate(l.endDate, "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                      Reason / Note
                    </p>
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400 line-clamp-2">
                      {l.reason || "No details provided"}
                    </p>
                  </div>
                </div>
              </div>

              {l.adminComment && (
                <div className="mt-4 p-3 bg-gray-100/50 dark:bg-gray-700/50 rounded-sm flex items-start gap-2">
                  <Info
                    size={14}
                    className="text-blue-500 mt-0.5 flex-shrink-0"
                  />
                  <p className="text-[11px] text-gray-500 italic line-clamp-2">
                    "{l.adminComment}"
                  </p>
                </div>
              )}
            </AppCard>
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <DataTable
            columns={columns}
            data={filteredLeaves}
            keyExtractor={(l) => l.id}
            emptyMessage="No Leave Requests Found"
            emptySubMessage="There are currently no active leave requests matching your criteria."
          />
        </div>
      )}
    </div>
  );
};

export default LeavesModule;
