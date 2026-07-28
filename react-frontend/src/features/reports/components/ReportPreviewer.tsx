import React from "react";
import { Spinner } from '@/lib/flowbite-compat';
import { ChevronLeft, ChevronRight, AlertCircle, FileText } from "lucide-react";
import ClientSummaryReport from "./ClientSummaryReport";
import AttendanceReport from "./AttendanceReport";

export interface ReportPreviewerProps {
  selectedReport?: string;
  totalRecords?: number;
  currentPage?: number;
  totalPages?: number;
  loading?: boolean;
  error?: string | null;
  isModern?: boolean;
  modernData?: any[];
  reportImages?: string[];
  onPageChange?: (page: number) => void;
  [key: string]: any;
}

export default function ReportPreviewer({
  selectedReport = "",
  totalRecords = 0,
  currentPage = 1,
  totalPages = 1,
  loading = false,
  error = null,
  isModern = false,
  modernData = [],
  onPageChange = () => {},
}: ReportPreviewerProps) {
  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-xl border">
        <Spinner size="xl" />
        <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Generating Report Stream...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-rose-500 bg-rose-50 rounded-xl border border-rose-200">
        <AlertCircle size={36} className="mb-2" />
        <p className="font-black text-sm uppercase">Report Generation Fault</p>
        <p className="text-xs text-rose-400 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border space-y-4">
      <div className="flex justify-between items-center border-b pb-3">
        <h3 className="font-black dark:text-white uppercase text-sm flex items-center gap-2">
          <FileText size={16} className="text-blue-500" /> {selectedReport || "Standard Ledger Report"}
        </h3>
        <span className="text-[10px] font-mono font-black text-gray-400">Total Records: {totalRecords}</span>
      </div>

      {selectedReport === "Client Summary Report" ? (
        <ClientSummaryReport data={modernData} totalRecords={totalRecords} currentPage={currentPage} totalPages={totalPages} />
      ) : selectedReport === "Attendance Report" ? (
        <AttendanceReport data={modernData} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 border-b">
              <tr>
                {modernData.length > 0 && Object.keys(modernData[0]).map((key) => (
                  <th key={key} className="p-3 uppercase">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y text-xs font-medium">
              {modernData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  {Object.values(row).map((val: any, vIdx) => (
                    <td key={vIdx} className="p-3">{String(val)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4 border-t text-xs">
          <span className="font-bold text-gray-400">Page {currentPage} of {totalPages}</span>
          <div className="flex gap-2">
            <button disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)} className="p-1.5 border rounded-lg disabled:opacity-40">
              <ChevronLeft size={16} />
            </button>
            <button disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)} className="p-1.5 border rounded-lg disabled:opacity-40">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
