import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileSpreadsheet, FileText, RefreshCw } from "lucide-react";
import { exportToExcel, exportToPDF } from "@/utils/reportExport";

export interface ReportFilterBarProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  reportData?: any[];
  reportTitle?: string;
  onRefresh?: () => void;
  [key: string]: any;
}

export default function ReportFilterBar({
  searchQuery = "",
  onSearchChange = () => {},
  reportData = [],
  reportTitle = "Enterprise_Report",
  onRefresh,
}: ReportFilterBarProps) {
  const handleExportExcel = () => {
    if (!reportData.length) return;
    const headers = Object.keys(reportData[0] || {});
    exportToExcel(reportData, headers, reportTitle, reportTitle);
  };

  const handleExportPDF = () => {
    if (!reportData.length) return;
    const headers = Object.keys(reportData[0] || {});
    exportToPDF(reportData, headers, reportTitle, reportTitle, "portrait");
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border">
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
        <Input
          type="text"
          placeholder="Filter report records..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 text-xs"
        />
      </div>

      <div className="flex gap-2 w-full sm:w-auto justify-end">
        {onRefresh && (
          <Button size="sm" variant="outline" onClick={onRefresh} className="h-9 text-xs font-bold">
            <RefreshCw size={14} className="mr-1" /> Refresh
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={handleExportExcel} className="h-9 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100">
          <FileSpreadsheet size={14} className="mr-1" /> Export Excel
        </Button>
        <Button size="sm" variant="outline" onClick={handleExportPDF} className="h-9 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100">
          <FileText size={14} className="mr-1" /> Export PDF
        </Button>
      </div>
    </div>
  );
}
