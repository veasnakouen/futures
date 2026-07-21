import React, { useState } from "react";
import { X, Camera } from "lucide-react";
import { Modal } from "@/lib/flowbite-compat";
import { useTranslation } from "react-i18next";
import { attendanceService } from "../../../services/attendanceService";
import { toast } from "react-hot-toast";

interface EmployeeQRScannerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmployeeQRScanner: React.FC<EmployeeQRScannerProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  // Hardcoded for demo; in real app this comes from AuthContext
  const currentEmployeeId = 1; 

  const handleScan = async () => {
    if (!token) {
      toast.error("Please enter a valid QR token.");
      return;
    }
    
    setLoading(true);
    try {
      await attendanceService.scanQrCode(token, currentEmployeeId);
      toast.success("Clocked In Successfully via QR!");
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data || "Failed to scan QR code");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      size="md"
      className="[&_.fixed.inset-0]:bg-black/80 [&_.fixed.inset-0]:backdrop-blur-md"
    >
      <div className="flex flex-col bg-white dark:bg-gray-950 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/10 dark:ring-white/5 p-6">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-black flex items-center gap-2">
            <Camera className="text-blue-500" size={20} />
            Scan QR Code
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 min-w-[2rem] min-h-[2rem] shrink-0 aspect-square items-center justify-center rounded-full p-0 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:rotate-90 hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          >
            <X size={18} />
          </button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center mb-6 h-48">
          <Camera size={48} className="text-gray-300 dark:text-gray-700 mb-3" />
          <p className="text-sm font-bold text-gray-400 text-center">
            Camera Scanner Not Available<br/>
            (Simulated Input Mode)
          </p>
        </div>

        <div className="space-y-3">
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">
            QR Token Payload
          </label>
          <input
            type="text"
            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl text-sm px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-mono"
            placeholder="Paste JWT token here..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button
            onClick={handleScan}
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50"
          >
            {loading ? "Processing..." : "Simulate Scan"}
          </button>
        </div>

      </div>
    </Modal>
  );
};
