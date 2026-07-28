import React from "react";
import { Badge, Avatar, Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell } from '@/lib/flowbite-compat';
import { Clock, MapPin, User } from "lucide-react";
import { safeFormatDate } from "@/utils/dateUtils";

interface AttendanceMatrixTabProps {
  attendanceData: any[];
  searchQuery: string;
  statusFilter: string;
}

const AttendanceMatrixTab: React.FC<AttendanceMatrixTabProps> = ({
  attendanceData,
  searchQuery,
  statusFilter,
}) => {
  const filteredData = attendanceData.filter((item) => {
    const nameMatch = (item.employeeName || item.employeeId || "").toLowerCase().includes(searchQuery.toLowerCase());
    const statusMatch = !statusFilter || item.status === statusFilter;
    return nameMatch && statusMatch;
  });

  return (
    <div className="space-y-4">
      <div className="border-none shadow-sm dark:bg-gray-800 rounded-md overflow-hidden bg-white">
        <div className="overflow-x-auto overflow-y-auto custom-scrollbar w-full max-h-[60vh]">
          <Table hoverable className="w-full">
            <TableHead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-20">
              <TableHeadCell className="py-3.5 px-4 text-[10px] font-black uppercase tracking-widest">Employee Node</TableHeadCell>
              <TableHeadCell className="py-3.5 px-4 text-[10px] font-black uppercase tracking-widest">Clock In</TableHeadCell>
              <TableHeadCell className="py-3.5 px-4 text-[10px] font-black uppercase tracking-widest">Clock Out</TableHeadCell>
              <TableHeadCell className="py-3.5 px-4 text-[10px] font-black uppercase tracking-widest">Location / Device</TableHeadCell>
              <TableHeadCell className="py-3.5 px-4 text-[10px] font-black uppercase tracking-widest">Status</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y dark:divide-gray-700">
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    No attendance logs match filter
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, idx) => (
                  <TableRow key={item.id || idx} className="bg-white dark:bg-gray-800 hover:bg-gray-50">
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar img={item.photo} rounded size="sm" />
                        <div>
                          <p className="font-bold text-xs dark:text-white uppercase">{item.employeeName || `EMP-${item.employeeId}`}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase">{item.department || "General"}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-xs font-bold font-mono">
                      <Clock size={12} className="inline mr-1 text-emerald-500" />
                      {safeFormatDate(item.clockIn, "HH:mm:ss")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-xs font-bold font-mono">
                      <Clock size={12} className="inline mr-1 text-rose-500" />
                      {safeFormatDate(item.clockOut, "HH:mm:ss")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-xs text-gray-500">
                      <MapPin size={12} className="inline mr-1 text-blue-500" />
                      {item.location || item.deviceName || "Main Gate"}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge color={item.status === "On Time" || item.status === "Present" ? "success" : "warning"} className="rounded-md text-[8px] uppercase">
                        {item.status || "Present"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceMatrixTab;
