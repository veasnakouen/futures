import React from "react";
import { Button } from '@/lib/flowbite-compat';
import { Download, FileText, BarChart3, Users, DollarSign, Calendar } from "lucide-react";
import { exportToExcel, exportToPDF } from "@/utils/reportExport";
import toast from "react-hot-toast";

interface ReportsModuleProps {
  employees?: any[];
  attendance?: any[];
  payroll?: any[];
}

const ReportsModule: React.FC<ReportsModuleProps> = ({
  employees = [],
  attendance = [],
  payroll = [],
}) => {
  const exportWorkforceExcel = () => {
    try {
      const headers = ["firstName", "lastName", "clientCode", "status", "branch"];
      exportToExcel(employees, headers, "WORKFORCE DIRECTORY REPORT", "Active Employee Roster");
      toast.success("Workforce Excel exported!");
    } catch {
      toast.error("Failed to export Excel");
    }
  };

  const exportWorkforcePDF = () => {
    try {
      const headers = ["firstName", "lastName", "clientCode", "status", "branch"];
      exportToPDF(employees, headers, "WORKFORCE DIRECTORY REPORT", "Active Employee Roster", "portrait");
      toast.success("Workforce PDF exported!");
    } catch {
      toast.error("Failed to export PDF");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border shadow-sm">
        <h4 className="font-black text-sm uppercase dark:text-white">Enterprise HR Analytics & Executive Reporting</h4>
        <p className="text-[10px] text-gray-400 font-bold uppercase">Generate official PDF audit ledgers and formatted Microsoft Excel spreadsheets</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border shadow-sm space-y-4">
          <Users className="text-blue-600" size={28} />
          <div>
            <h4 className="font-black text-base dark:text-white uppercase">Workforce Roster Report</h4>
            <p className="text-xs text-gray-500 font-medium">Export active employee directory, department placements, and status codes.</p>
          </div>
          <div className="flex gap-2 pt-2">
            <Button color="blue" size="xs" onClick={exportWorkforceExcel} className="font-black uppercase text-[9px] flex-1">
              <Download size={12} className="mr-1" /> Excel
            </Button>
            <Button color="success" size="xs" onClick={exportWorkforcePDF} className="font-black uppercase text-[9px] flex-1 bg-emerald-600">
              <FileText size={12} className="mr-1" /> PDF
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border shadow-sm space-y-4">
          <Calendar className="text-indigo-600" size={28} />
          <div>
            <h4 className="font-black text-base dark:text-white uppercase">Attendance Ledger</h4>
            <p className="text-xs text-gray-500 font-medium">Export biometric hardware clock-in logs and timecard audit records.</p>
          </div>
          <div className="flex gap-2 pt-2">
            <Button color="blue" size="xs" onClick={exportWorkforceExcel} className="font-black uppercase text-[9px] flex-1">
              <Download size={12} className="mr-1" /> Excel
            </Button>
            <Button color="success" size="xs" onClick={exportWorkforcePDF} className="font-black uppercase text-[9px] flex-1 bg-emerald-600">
              <FileText size={12} className="mr-1" /> PDF
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border shadow-sm space-y-4">
          <DollarSign className="text-emerald-600" size={28} />
          <div>
            <h4 className="font-black text-base dark:text-white uppercase">Payroll Audit Statement</h4>
            <p className="text-xs text-gray-500 font-medium">Export monthly base salaries, allowances, deductions, and net payout totals.</p>
          </div>
          <div className="flex gap-2 pt-2">
            <Button color="blue" size="xs" onClick={exportWorkforceExcel} className="font-black uppercase text-[9px] flex-1">
              <Download size={12} className="mr-1" /> Excel
            </Button>
            <Button color="success" size="xs" onClick={exportWorkforcePDF} className="font-black uppercase text-[9px] flex-1 bg-emerald-600">
              <FileText size={12} className="mr-1" /> PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsModule;
