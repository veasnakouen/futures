import React from "react";
import { FileText, FileSpreadsheet, Printer } from "lucide-react";

interface ReportExportMenuProps {
  onClose: () => void;
  onDownload: (format: string) => void;
}

const ReportExportMenu: React.FC<ReportExportMenuProps> = ({
  onClose,
  onDownload,
}) => {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      <div className="absolute right-0 mt-4 w-64 bg-white dark:bg-gray-800 rounded-md shadow-2xl z-50 overflow-hidden animate-slide-in">
        <div className="p-4 border-b bg-gray-50/50 dark:bg-gray-700/30">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">
            Data Extraction Nodes
          </span>
        </div>
        <button
          onClick={() => {
            onDownload("pdf");
            onClose();
          }}
          className="w-full text-left px-6 py-5 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center gap-4 dark:text-white transition-all group"
        >
          <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-md text-rose-600 group-hover:scale-110 transition-transform">
            <FileText size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xs uppercase tracking-tight">
              Portable Document
            </span>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              PDF Format
            </span>
          </div>
        </button>
        <button
          onClick={() => {
            onDownload("excel");
            onClose();
          }}
          className="w-full text-left px-6 py-5 text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex items-center gap-4 dark:text-white transition-all group border-t"
        >
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-md text-emerald-600 group-hover:scale-110 transition-transform">
            <FileSpreadsheet size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xs uppercase tracking-tight">
              Excel Spreadsheet
            </span>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              XLSX Format
            </span>
          </div>
        </button>
        <button
          onClick={() => {
            window.print();
            onClose();
          }}
          className="w-full text-left px-6 py-5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-4 dark:text-white transition-all group border-t"
        >
          <div className="p-3 bg-gray-100 dark:bg-gray-900/30 rounded-md text-gray-600 group-hover:scale-110 transition-transform">
            <Printer size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xs uppercase tracking-tight">
              Local Print
            </span>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              System Printer
            </span>
          </div>
        </button>
      </div>
    </>
  );
};

export default ReportExportMenu;
