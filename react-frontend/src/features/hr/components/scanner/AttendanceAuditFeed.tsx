import React from "react";
import { History, Download, Check, QrCode } from "lucide-react";
import { format } from "date-fns";
import { AttendanceLog } from "./scannerTypes";

interface AttendanceAuditFeedProps {
  scanHistory: AttendanceLog[];
  onExportCSV: () => void;
}

export default function AttendanceAuditFeed({
  scanHistory,
  onExportCSV,
}: AttendanceAuditFeedProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h3 className="font-black text-base dark:text-white flex items-center gap-2">
              <History size={18} className="text-indigo-600" /> Attendance Audit Feed
            </h3>
            <span className="text-[10px] font-bold text-gray-400">Real-time attendance ledger</span>
          </div>

          <button
            onClick={onExportCSV}
            title="Export to CSV"
            className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-colors cursor-pointer"
          >
            <Download size={16} />
          </button>
        </div>

        <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
          {scanHistory.map((log) => (
            <div
              key={log.id}
              className="p-3.5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-2.5">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    log.type === "CLOCK_IN"
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
                      : log.type === "CLOCK_OUT"
                      ? "bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
                      : "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
                  }`}
                >
                  <Check size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-gray-900 dark:text-white">
                      {log.type.replace("_", " ")}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      {log.mode}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 mt-0.5 line-clamp-1">
                    {log.location}
                  </p>
                </div>
              </div>
              <span className="text-[9px] font-mono font-bold text-gray-400 shrink-0">
                {format(new Date(log.timestamp), "HH:mm:ss")}
              </span>
            </div>
          ))}

          {scanHistory.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <QrCode size={36} className="mx-auto mb-2 opacity-30" />
              <p className="text-xs font-bold uppercase tracking-wider">No scans recorded yet today</p>
              <p className="text-[10px] font-medium text-gray-400 mt-1">Scan a QR code or click Test Check-In</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Verified by MTP Enterprise Workforce Engine
        </p>
      </div>
    </div>
  );
}
