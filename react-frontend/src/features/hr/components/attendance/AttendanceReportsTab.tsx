import React from "react";
import { Button } from '@/lib/flowbite-compat';
import { Download, FileText, BarChart3, TrendingUp } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

import { exportToExcel } from "@/utils/reportExport";

interface AttendanceReportsTabProps {
  attendanceData: any[];
}

const AttendanceReportsTab: React.FC<AttendanceReportsTabProps> = ({ attendanceData }) => {
  const exportExcel = () => {
    try {
      const headers = ["employeeName", "clockIn", "clockOut", "location", "status"];
      exportToExcel(
        attendanceData,
        headers,
        "ATTENDANCE AUDIT LEDGER REPORT",
        "Biometric Hardware Clock-In Logs",
      );
      toast.success("Excel report exported successfully");
    } catch {
      toast.error("Failed to export Excel report");
    }
  };

  const exportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text("Attendance Audit Ledger Report", 14, 15);
      const tableRows = attendanceData.map((a) => [
        a.employeeName || a.employeeId,
        a.clockIn || "—",
        a.clockOut || "—",
        a.location || "Main Gate",
        a.status || "Present",
      ]);
      autoTable(doc, {
        head: [["Employee", "Clock In", "Clock Out", "Location", "Status"]],
        body: tableRows,
        startY: 22,
      });
      doc.save(`Attendance_Report_${Date.now()}.pdf`);
      toast.success("PDF report generated successfully");
    } catch {
      toast.error("Failed to export PDF report");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border shadow-sm flex flex-col justify-between">
          <div>
            <BarChart3 className="text-blue-600 mb-3" size={24} />
            <h4 className="font-black text-sm uppercase dark:text-white mb-1">Export Excel Ledger</h4>
            <p className="text-xs text-gray-400 font-bold">Download comprehensive attendance logs in Microsoft Excel format.</p>
          </div>
          <Button color="blue" size="xs" onClick={exportExcel} className="mt-4 font-black uppercase text-[10px] rounded-lg">
            <Download size={14} className="mr-1" /> Export Excel
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border shadow-sm flex flex-col justify-between">
          <div>
            <FileText className="text-emerald-600 mb-3" size={24} />
            <h4 className="font-black text-sm uppercase dark:text-white mb-1">Export PDF Summary</h4>
            <p className="text-xs text-gray-400 font-bold">Generate printable PDF audit reports for management compliance.</p>
          </div>
          <Button color="success" size="xs" onClick={exportPDF} className="mt-4 font-black uppercase text-[10px] rounded-lg bg-emerald-600">
            <Download size={14} className="mr-1" /> Export PDF
          </Button>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <TrendingUp className="text-cyan-400 mb-3" size={24} />
            <h4 className="font-black text-sm uppercase mb-1">Audit Ledger Active</h4>
            <p className="text-xs opacity-80">All hardware biometric clock-ins are synchronized with the enterprise server.</p>
          </div>
          <p className="text-[10px] font-mono opacity-60 uppercase mt-4">Total Records: {attendanceData.length}</p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReportsTab;
