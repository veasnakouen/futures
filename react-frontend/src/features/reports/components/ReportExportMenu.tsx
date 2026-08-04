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
      <div className="absolute right-0 mt-4 w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 z-50 overflow-hidden p-2 animate-slide-in space-y-1">
        <div className="px-4 pt-3 pb-2">
          <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            Data Extraction Nodes
          </span>
        </div>
        <button
          onClick={() => {
            onDownload("pdf");
            onClose();
          }}
          className="w-full text-left px-4 py-3.5 text-sm hover:bg-rose-50/70 dark:hover:bg-rose-950/30 rounded-xl flex items-center gap-4 dark:text-white transition-all group"
        >
          <div className="p-2.5 bg-rose-100 dark:bg-rose-900/40 rounded-xl text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform shadow-sm">
            <FileText size={18} />
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
          className="w-full text-left px-4 py-3.5 text-sm hover:bg-emerald-50/70 dark:hover:bg-emerald-950/30 rounded-xl flex items-center gap-4 dark:text-white transition-all group"
        >
          <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform shadow-sm">
            <FileSpreadsheet size={18} />
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
          className="w-full text-left px-4 py-3.5 text-sm hover:bg-blue-50/70 dark:hover:bg-blue-950/30 rounded-xl flex items-center gap-4 dark:text-white transition-all group"
        >
          <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform shadow-sm">
            <Printer size={18} />
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
