import React, { useState, useEffect } from "react";
import {Button, Badge, Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell, Avatar, Spinner} from '@/lib/flowbite-compat';
import {
  Users,
  ClipboardCheck,
  Clock,
  Award,
  CheckCircle,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import api from '@/services/api';
import { format } from "date-fns";

const ManagerModule: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchManagerData();
  }, []);

  const fetchManagerData = async () => {
    try {
      setLoading(true);
      const [reportsRes, leavesRes] = await Promise.all([
        api.get("/hr/manager/reports"),
        api.get("/hr/manager/leaves/pending"),
      ]);

      setReports(reportsRes.data || []);
      setPendingLeaves(leavesRes.data || []);
    } catch (err) {
      console.error("Failed to load manager hub data", err);
      toast.error("Failed to sync with manager hub services.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (
    leaveId: number,
    staffName: string,
    action: "Approved" | "Rejected",
  ) => {
    try {
      await api.put(`/hr/leaves/${leaveId}/status`, null, {
        params: { status: action },
      });
      toast.success(
        `Leave request for ${staffName} successfully ${action.toLowerCase()}`,
      );
      // Remove the processed leave from the list
      setPendingLeaves((prev) => prev.filter((l) => l.id !== leaveId));
    } catch (err) {
      console.error(`Failed to process leave request`, err);
      toast.error(`Error processing leave request for ${staffName}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Spinner size="xl" className="fill-blue-600" />
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">
          Syncing Manager Hub Data...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title Section */}
      <div>
        <h3 className="text-2xl font-black dark:text-white">
          Manager Command Hub
        </h3>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
          Direct Reports Administration & Resource Oversight
        </p>
      </div>

      {/* Manager metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Active Direct Reports
            </span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/30 text-blue-500 rounded-md">
              <Users size={16} />
            </div>
          </div>
          <h4 className="text-3xl font-black dark:text-white">
            {String(reports.length).padStart(2, "0")} Personnel
          </h4>
          <p className="text-[9px] font-bold text-gray-400 uppercase mt-2">
            Allocated across operational nodes
          </p>
        </div>

        <div className="p-6 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Leave Requests
            </span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/30 text-amber-500 rounded-md">
              <ClipboardCheck size={16} />
            </div>
          </div>
          <h4 className="text-3xl font-black dark:text-white">
            {String(pendingLeaves.length).padStart(2, "0")} Pending
          </h4>
          <p className="text-[9px] font-bold text-amber-500 uppercase mt-2">
            Immediate approval required
          </p>
        </div>

        <div className="p-6 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Team Time On-Clock
            </span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-md">
              <Clock size={16} />
            </div>
          </div>
          <h4 className="text-3xl font-black dark:text-white">97.8%</h4>
          <p className="text-[9px] font-bold text-emerald-500 uppercase mt-2">
            On-time rate above 95% target
          </p>
        </div>

        <div className="p-6 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Team LMS Completeness
            </span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 rounded-md">
              <Award size={16} />
            </div>
          </div>
          <h4 className="text-3xl font-black dark:text-white">78.5%</h4>
          <p className="text-[9px] font-bold text-gray-400 uppercase mt-2">
            Average module completion index
          </p>
        </div>
      </div>

      {/* Leave Approvals & Direct Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Leave Approvals */}
        <div className="lg:col-span-2 p-8 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <h4 className="font-black text-lg dark:text-white mb-6 flex items-center gap-2 uppercase tracking-tight">
            <ClipboardCheck size={20} className="text-amber-500" /> Pending
            Leave Approvals
          </h4>
          <div className="overflow-x-auto">
            <Table hoverable className="border-none w-full relative">
              <TableHead className="bg-gray-50/50 dark:bg-gray-700/50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <TableHeadCell className="py-4">Employee</TableHeadCell>
                <TableHeadCell className="py-4">Type</TableHeadCell>
                <TableHeadCell className="py-4">Start Date</TableHeadCell>
                <TableHeadCell className="py-4">End Date</TableHeadCell>
                <TableHeadCell className="py-4 text-right">
                  Actions
                </TableHeadCell>
              </TableHead>
              <TableBody className="divide-y dark:divide-gray-700">
                {pendingLeaves.length === 0 ? (
                  <TableRow className="bg-white dark:bg-gray-800">
                    <TableCell
                      colSpan={5}
                      className="text-center py-10 text-xs font-black text-gray-400 uppercase tracking-widest"
                    >
                      No pending leave requests
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingLeaves.map((req) => {
                    const empName = req.employee
                      ? `${req.employee.firstNameEnglish} ${req.employee.lastNameEnglish}`
                      : "Unknown";
                    return (
                      <TableRow
                        key={req.id}
                        className="bg-white dark:bg-gray-800 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/30"
                      >
                        <TableCell className="font-black dark:text-white text-xs py-4">
                          {empName}
                        </TableCell>
                        <TableCell className="text-xs py-4 uppercase tracking-tight">
                          {req.leaveType}
                        </TableCell>
                        <TableCell className="text-xs text-gray-500 py-4 font-mono">
                          {req.startDate
                            ? format(new Date(req.startDate), "MMM dd, yyyy")
                            : "N/A"}
                        </TableCell>
                        <TableCell className="text-xs text-gray-500 py-4 font-mono">
                          {req.endDate
                            ? format(new Date(req.endDate), "MMM dd, yyyy")
                            : "N/A"}
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="xs"
                              color="success"
                              onClick={() =>
                                handleAction(req.id, empName, "Approved")
                              }
                              className="p-1 rounded-md"
                            >
                              <CheckCircle size={14} className="mr-1" /> Approve
                            </Button>
                            <Button
                              size="xs"
                              color="failure"
                              onClick={() =>
                                handleAction(req.id, empName, "Rejected")
                              }
                              className="p-1 rounded-md"
                            >
                              <XCircle size={14} className="mr-1" /> Deny
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Direct Reports Panel */}
        <div className="p-8 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
          <h4 className="font-black text-lg dark:text-white mb-6 flex items-center gap-2 uppercase tracking-tight">
            <Users size={20} className="text-blue-600" /> Direct Reports
            Overview
          </h4>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
            {reports.length === 0 ? (
              <div className="text-center py-10 text-xs font-black text-gray-400 uppercase tracking-widest">
                No direct reports assigned
              </div>
            ) : (
              reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-md space-y-3 border-transparent hover: dark:hover: transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      {rep.photo ? (
                        <img
                          src={rep.photo}
                          alt={rep.firstNameEnglish}
                          className="w-8 h-8 rounded-md object-cover"
                        />
                      ) : (
                        <Avatar rounded size="sm" />
                      )}
                      <div>
                        <p className="font-black text-xs dark:text-white leading-none uppercase tracking-tight">
                          {rep.firstNameEnglish} {rep.lastNameEnglish}
                        </p>
                        <p className="text-[8px] font-bold text-gray-400 uppercase mt-1">
                          {rep.position?.name || rep.title || "Staff"} •{" "}
                          {rep.department?.name || "General"}
                        </p>
                      </div>
                    </div>
                    <Badge
                      color="info"
                      className="text-[8px] font-black tracking-widest"
                    >
                      Active
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerModule;
