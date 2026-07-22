import React, { useState, useEffect } from "react";
import { Button, Badge, Select, TextInput, Spinner, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Avatar } from '@/lib/flowbite-compat';
import {
  Calendar,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Users,
} from "lucide-react";
import api from '@/services/api';
import { format } from "date-fns";
import toast from "react-hot-toast";
import SearchInput from "@/components/common/SearchInput";

const TimeOffOverview: React.FC = () => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await api.get("/hr/leaves");
      setLeaves(res.data?.content || res.data || []);
    } catch (err) {
      console.error("Failed to load leave requests", err);
      toast.error("Failed to load time-off overview");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      setProcessing(id);
      await api.put(`/hr/leaves/${id}/status`, null, { params: { status: 'APPROVED' } });
      toast.success("Leave request approved");
      fetchLeaves();
    } catch (err) {
      console.error("Failed to approve", err);
      toast.error("Failed to approve leave request");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id: number) => {
    try {
      setProcessing(id);
      await api.put(`/hr/leaves/${id}/status`, null, { params: { status: 'REJECTED' } });
      toast.success("Leave request rejected");
      fetchLeaves();
    } catch (err) {
      console.error("Failed to reject", err);
      toast.error("Failed to reject leave request");
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      return format(new Date(dateStr), "MMM dd, yyyy");
    } catch {
      return dateStr;
    }
  };

  const getDaysCount = (start: string, end: string) => {
    try {
      const diff = new Date(end).getTime() - new Date(start).getTime();
      return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    } catch {
      return "N/A";
    }
  };

  const filteredLeaves = leaves.filter((leave) => {
    const matchSearch =
      (leave.employee?.firstNameEnglish || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (leave.employee?.lastNameEnglish || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (leave.leaveType || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "ALL" || leave.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pendingCount = leaves.filter((l) => l.status === "Pending").length;
  const approvedCount = leaves.filter((l) => l.status === "Approved").length;
  const rejectedCount = leaves.filter((l) => l.status === "Rejected").length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-md dark:bg-gray-800 border-none shadow-lg border-l-4 border-l-amber-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
                Pending Review
              </p>
              <h3 className="text-3xl font-black dark:text-white mt-1">
                {pendingCount}
              </h3>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-500 rounded-md">
              <Clock size={28} />
            </div>
          </div>
        </div>
        <div className="p-6 rounded-md dark:bg-gray-800 border-none shadow-lg border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                Approved
              </p>
              <h3 className="text-3xl font-black dark:text-white mt-1">
                {approvedCount}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-md">
              <CheckCircle size={28} />
            </div>
          </div>
        </div>
        <div className="p-6 rounded-md dark:bg-gray-800 border-none shadow-lg border-l-4 border-l-rose-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">
                Rejected
              </p>
              <h3 className="text-3xl font-black dark:text-white mt-1">
                {rejectedCount}
              </h3>
            </div>
            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-500 rounded-md">
              <XCircle size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-6 rounded-md dark:bg-gray-800 border-none shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-lg font-black dark:text-white flex items-center gap-3">
            <Calendar className="text-blue-600 dark:text-blue-400" />
            Time Off Overview — All Leave Requests
          </h3>
          <Button
            color="light"
            size="xs"
            onClick={fetchLeaves}
            disabled={loading}
            className="rounded-md font-black uppercase text-[10px]"
          >
            <RefreshCw
              size={12}
              className={`mr-1.5 ${loading ? "animate-spin" : ""}`}
            />{" "}
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
          <div className="relative">
            <SearchInput
              placeholder="Search employee or leave type..."
              value={searchTerm}
              onChange={setSearchTerm}
              containerClassName="w-full"
            />
          </div>
          <div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              icon={Filter}
              className="w-full"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </Select>
          </div>
          <div className="flex items-center justify-end">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-900/30 px-3 py-1.5 rounded-md">
              {filteredLeaves.length} records
            </span>
          </div>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="border-none shadow-md dark:bg-gray-800 rounded-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="xl" />
          </div>
        ) : filteredLeaves.length === 0 ? (
          <div className="py-20 text-center">
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
              No leave requests found
            </p>
          </div>
        ) : (
          <Table hoverable className="border-none">
            <TableHead className="bg-gray-50/50 dark:bg-gray-800/50 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <TableHeadCell className="px-6 py-3">Employee</TableHeadCell>
              <TableHeadCell className="px-6 py-3">Leave Type</TableHeadCell>
              <TableHeadCell className="px-6 py-3">Period</TableHeadCell>
              <TableHeadCell className="px-6 py-3">Days</TableHeadCell>
              <TableHeadCell className="px-6 py-3">Reason</TableHeadCell>
              <TableHeadCell className="px-6 py-3">Status</TableHeadCell>
              <TableHeadCell className="px-6 py-3 text-right">
                Actions
              </TableHeadCell>
            </TableHead>
            <TableBody className="divide-y dark:divide-gray-700">
              {filteredLeaves.map((leave) => (
                <TableRow
                  key={leave.id}
                  className="bg-white dark:bg-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar img={leave.employee?.photo} rounded size="sm" />
                      <div>
                        <p className="font-black dark:text-white text-sm">
                          {leave.employee?.firstNameEnglish ||
                            leave.employeeName ||
                            "Unknown"}{" "}
                          {leave.employee?.lastNameEnglish || ""}
                        </p>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                          {leave.employee?.department?.name ||
                            leave.employee?.position?.name ||
                            "Staff"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge
                      color="info"
                      className="rounded-md px-3 py-1 text-[9px] font-black uppercase"
                    >
                      {leave.leaveType || "General Leave"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <p className="text-xs font-bold dark:text-white">
                      {formatDate(leave.startDate)}
                    </p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">
                      to {formatDate(leave.endDate)}
                    </p>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center font-black dark:text-white">
                    {getDaysCount(leave.startDate, leave.endDate)}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <p
                      className="text-xs text-gray-500 dark:text-gray-400 max-w-[160px] truncate"
                      title={leave.reason}
                    >
                      {leave.reason || "—"}
                    </p>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge
                      color={
                        leave.status === "Approved"
                          ? "success"
                          : leave.status === "Pending"
                            ? "warning"
                            : "failure"
                      }
                      className="rounded-md px-3 py-1 text-[9px] font-black uppercase"
                    >
                      {leave.status || "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    {leave.status === "Pending" ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="xs"
                          color="success"
                          onClick={() => handleApprove(leave.id)}
                          disabled={processing === leave.id}
                          className="rounded-md font-black uppercase text-[9px] h-8 px-3"
                        >
                          {processing === leave.id ? (
                            <Spinner size="xs" />
                          ) : (
                            <CheckCircle size={12} className="mr-1" />
                          )}
                          Approve
                        </Button>
                        <Button
                          size="xs"
                          color="failure"
                          onClick={() => handleReject(leave.id)}
                          disabled={processing === leave.id}
                          className="rounded-md font-black uppercase text-[9px] h-8 px-3"
                        >
                          {processing === leave.id ? (
                            <Spinner size="xs" />
                          ) : (
                            <XCircle size={12} className="mr-1" />
                          )}
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        {leave.status === "Approved"
                          ? "✓ Resolved"
                          : "✗ Resolved"}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default TimeOffOverview;
