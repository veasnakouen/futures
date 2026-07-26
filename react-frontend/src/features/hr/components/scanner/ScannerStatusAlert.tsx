import React from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface ScannerStatusAlertProps {
  statusMessage: string;
  statusType: "success" | "error" | "info" | null;
}

export default function ScannerStatusAlert({
  statusMessage,
  statusType,
}: ScannerStatusAlertProps) {
  if (!statusMessage) return null;

  return (
    <div
      className={`w-full max-w-md p-4 rounded-2xl flex items-start gap-3 mt-6 ${
        statusType === "success"
          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
          : statusType === "error"
          ? "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
          : "bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
      }`}
    >
      {statusType === "success" && <CheckCircle size={20} className="shrink-0 mt-0.5 text-emerald-500" />}
      {statusType === "error" && <XCircle size={20} className="shrink-0 mt-0.5 text-rose-500" />}
      {statusType === "info" && <Loader2 size={20} className="shrink-0 mt-0.5 animate-spin text-blue-500" />}
      <p className="text-xs font-bold leading-relaxed">{statusMessage}</p>
    </div>
  );
}
