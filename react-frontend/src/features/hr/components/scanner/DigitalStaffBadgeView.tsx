import React from "react";
import { QrCode, Clock } from "lucide-react";

interface DigitalStaffBadgeViewProps {
  user: any;
  employeeId?: number | null;
  totpCountdown: number;
  dynamicQrToken: string;
  onSelfVerify: () => void;
}

export default function DigitalStaffBadgeView({
  user,
  employeeId,
  totpCountdown,
  dynamicQrToken,
  onSelfVerify,
}: DigitalStaffBadgeViewProps) {
  return (
    <div className="w-full max-w-md flex flex-col items-center text-center space-y-5 py-4">
      <div className="bg-gradient-to-br from-indigo-900 to-purple-950 p-6 rounded-3xl text-white shadow-xl border border-indigo-700/50 w-full relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-indigo-700/50">
          <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full text-indigo-200">
            Digital Staff Access Pass
          </span>
          <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
            <Clock size={12} /> {totpCountdown}s
          </span>
        </div>

        {/* QR Box Visual */}
        <div className="bg-white p-4 rounded-2xl shadow-inner mx-auto w-48 h-48 flex items-center justify-center mb-4 border-4 border-indigo-400/30">
          <QrCode size={140} className="text-gray-950" />
        </div>

        <p className="text-sm font-black tracking-tight">{user?.username || "Super Admin"}</p>
        <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">
          Staff ID: EMP-{employeeId || (user as any)?.id || "10"} • Healthcare Specialist
        </p>
        <p className="text-[9px] font-mono text-gray-400 mt-2 truncate">
          Signature: {dynamicQrToken}
        </p>
      </div>

      <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
        Present this dynamic QR code to any office kiosk terminal or supervisor scanner. Code auto-refreshes every 30 seconds for cryptographic security.
      </p>

      <button
        onClick={onSelfVerify}
        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-xs shadow-md shadow-indigo-500/20 cursor-pointer"
      >
        Scan This Badge Now (Self-Verification)
      </button>
    </div>
  );
}
