import React from "react";
import { Key } from "lucide-react";

interface ManualPinViewProps {
  manualPin: string;
  setManualPin: (pin: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ManualPinView({
  manualPin,
  setManualPin,
  loading,
  onSubmit,
}: ManualPinViewProps) {
  return (
    <form onSubmit={onSubmit} className="w-full max-w-md space-y-5 py-4">
      <div className="text-center space-y-1">
        <h4 className="text-lg font-black dark:text-white text-gray-900">Manual Staff PIN Verification</h4>
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
          Use your confidential 4-6 digit employee security PIN to log attendance when camera is offline.
        </p>
      </div>

      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
          Security PIN Code
        </label>
        <input
          type="password"
          maxLength={6}
          placeholder="••••"
          value={manualPin}
          onChange={(e) => setManualPin(e.target.value)}
          className="w-full text-center text-2xl font-mono font-black tracking-[0.5em] py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !manualPin}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-xs shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer"
      >
        <Key size={16} /> Verify Staff PIN
      </button>
    </form>
  );
}
