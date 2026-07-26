import React from "react";
import { Camera, QrCode, Loader2, RefreshCw } from "lucide-react";

interface CameraScannerViewProps {
  scanning: boolean;
  loading: boolean;
  statusType: "success" | "error" | "info" | null;
  onStartScanner: () => void;
  onStopScanner: () => void;
  onSimulateScan: () => void;
}

export default function CameraScannerView({
  scanning,
  loading,
  statusType,
  onStartScanner,
  onStopScanner,
  onSimulateScan,
}: CameraScannerViewProps) {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-[320px] aspect-square bg-gray-950 rounded-3xl overflow-hidden shadow-inner border-4 border-gray-200 dark:border-gray-700 flex items-center justify-center mb-6">
        <div id="qr-reader-tab" className="w-full h-full"></div>

        {!scanning && !loading && statusType !== "success" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-gray-950/90 p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
              <Camera size={32} />
            </div>
            <p className="text-sm font-black text-white uppercase tracking-wider">
              Camera Ready
            </p>
            <p className="text-[11px] font-bold text-gray-400 mt-1">
              Click Start Camera or Test Sandbox below
            </p>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/95 text-white z-20">
            <Loader2 size={40} className="animate-spin text-blue-500 mb-4" />
            <p className="font-black tracking-widest uppercase text-xs animate-pulse">
              Verifying Attendance...
            </p>
          </div>
        )}
      </div>

      <div className="w-full max-w-md space-y-3">
        {!scanning ? (
          <button
            onClick={onStartScanner}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <QrCode size={18} /> Start WebRTC Camera Scanner
          </button>
        ) : (
          <button
            onClick={onStopScanner}
            className="w-full py-4 bg-gray-200 dark:bg-gray-700 hover:bg-rose-600 text-gray-800 dark:text-white hover:text-white font-black rounded-2xl transition-colors uppercase tracking-widest text-xs cursor-pointer"
          >
            Cancel Camera Scan
          </button>
        )}

        <button
          onClick={onSimulateScan}
          disabled={loading}
          className="w-full py-3 bg-gray-100 dark:bg-gray-700/60 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl transition-colors uppercase tracking-wider text-[11px] flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-600 cursor-pointer"
        >
          <RefreshCw size={14} /> Simulate Sandbox Check-In
        </button>
      </div>
    </div>
  );
}
