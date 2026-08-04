import React from "react";
import { Button, Badge } from "@/lib/flowbite-compat";
import SearchInput from "@/components/common/SearchInput";
import ModernPagination from "@/components/common/ModernPagination";
import { Calendar, Activity, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

interface Props {
  state: any;
}

export default function MyLeavesTab({ state }: Props) {
  const {
    myBalance,
    myLeaves,
    myLeavesSearch,
    setMyLeavesSearch,
    setShowRequestModal,
    paginatedMyLeaves,
    filteredMyLeaves,
    myLeavesPage,
    setMyLeavesPage,
    leavesPerPage,
  } = state;

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === "APPROVED")
      return <Badge color="success" icon={CheckCircle}>Approved</Badge>;
    if (status === "REJECTED")
      return <Badge color="failure" icon={XCircle}>Rejected</Badge>;
    return <Badge color="warning" icon={Clock}>{status.replace("_", " ")}</Badge>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Balances Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Annual Leave */}
        <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-800 p-5 rounded-2xl shadow-sm border border-blue-100 dark:border-gray-700 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="text-xs font-black tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-4 flex items-center gap-2">
              <Calendar size={14} /> Annual Leave
            </div>
            <div className="text-4xl font-black text-gray-900 dark:text-white mb-1">
              {myBalance ? myBalance.totalAnnualLeave - myBalance.usedAnnualLeave : "-"}{" "}
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Left</span>
            </div>
            <div className="text-xs font-bold text-gray-500 mb-3">
              Out of {myBalance?.totalAnnualLeave || 0} total days
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-1">
              <div
                className="bg-blue-500 h-1.5 rounded-full"
                style={{
                  width: `${
                    myBalance && myBalance.totalAnnualLeave > 0
                      ? (myBalance.usedAnnualLeave / myBalance.totalAnnualLeave) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
            <div className="text-[10px] font-bold text-gray-400 text-right">
              {myBalance?.usedAnnualLeave || 0} used
            </div>
          </div>
        </div>

        {/* Sick Leave */}
        <div className="bg-gradient-to-br from-red-50 to-white dark:from-gray-800 dark:to-gray-800 p-5 rounded-2xl shadow-sm border border-red-100 dark:border-gray-700 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="text-xs font-black tracking-widest text-red-600 dark:text-red-400 uppercase mb-4 flex items-center gap-2">
              <Activity size={14} /> Sick Leave
            </div>
            <div className="text-4xl font-black text-gray-900 dark:text-white mb-1">
              {myBalance ? myBalance.totalSickLeave - myBalance.usedSickLeave : "-"}{" "}
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Left</span>
            </div>
            <div className="text-xs font-bold text-gray-500 mb-3">
              Out of {myBalance?.totalSickLeave || 0} total days
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-1">
              <div
                className="bg-red-500 h-1.5 rounded-full"
                style={{
                  width: `${
                    myBalance && myBalance.totalSickLeave > 0
                      ? (myBalance.usedSickLeave / myBalance.totalSickLeave) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
            <div className="text-[10px] font-bold text-gray-400 text-right">
              {myBalance?.usedSickLeave || 0} used
            </div>
          </div>
        </div>

        {/* Special Leave */}
        <div className="bg-gradient-to-br from-purple-50 to-white dark:from-gray-800 dark:to-gray-800 p-5 rounded-2xl shadow-sm border border-purple-100 dark:border-gray-700 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="text-xs font-black tracking-widest text-purple-600 dark:text-purple-400 uppercase mb-4 flex items-center gap-2">
              <FileText size={14} /> Special Leave
            </div>
            <div className="text-4xl font-black text-gray-900 dark:text-white mb-1">
              {myBalance ? myBalance.totalSpecialLeave - myBalance.usedSpecialLeave : "-"}{" "}
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Left</span>
            </div>
            <div className="text-xs font-bold text-gray-500 mb-3">
              Out of {myBalance?.totalSpecialLeave || 0} total days
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-1">
              <div
                className="bg-purple-500 h-1.5 rounded-full"
                style={{
                  width: `${
                    myBalance && myBalance.totalSpecialLeave > 0
                      ? (myBalance.usedSpecialLeave / myBalance.totalSpecialLeave) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
            <div className="text-[10px] font-bold text-gray-400 text-right">
              {myBalance?.usedSpecialLeave || 0} used
            </div>
          </div>
        </div>

        {/* Other Leave / Unpaid */}
        <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="text-xs font-black tracking-widest text-gray-600 dark:text-gray-400 uppercase mb-4 flex items-center gap-2">
              <Clock size={14} /> Other Leave
            </div>
            <div className="text-4xl font-black text-gray-900 dark:text-white mb-1">
              {myLeaves.filter((l: any) => l.leaveType === "Unpaid").length}{" "}
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Taken</span>
            </div>
            <div className="text-xs font-bold text-gray-500 mb-3">Unpaid or Off-in-Lieu</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-1">
              <div className="bg-gray-400 h-1.5 rounded-full w-full opacity-50" />
            </div>
            <div className="text-[10px] font-bold text-gray-400 text-right">No limit</div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="font-bold text-lg dark:text-white">Leave History</h2>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-64">
              <SearchInput
                placeholder="Search leaves..."
                value={myLeavesSearch}
                onChange={(val: any) => setMyLeavesSearch(typeof val === "string" ? val : val?.target?.value || "")}
              />
            </div>
            <Button
              color="blue"
              onClick={() => setShowRequestModal(true)}
              className="shrink-0 font-bold tracking-wide border-none bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              Request Leave
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Date Range</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {paginatedMyLeaves.map((leave: any) => (
                <tr key={leave.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{leave.leaveType}</td>
                  <td className="px-6 py-4 font-medium">
                    {format(new Date(leave.startDate), "MMM dd, yyyy")} - {format(new Date(leave.endDate), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 font-medium">{leave.duration.replace("_", " ")}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={leave.status} />
                  </td>
                </tr>
              ))}
              {paginatedMyLeaves.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium">
                    No leave requests found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end">
          <ModernPagination
            currentPage={myLeavesPage}
            onPageChange={setMyLeavesPage}
            totalItems={filteredMyLeaves.length}
            pageSize={leavesPerPage}
            totalPages={Math.max(1, Math.ceil(filteredMyLeaves.length / leavesPerPage))}
          />
        </div>
      </div>
    </div>
  );
}
