import React, { useState, useEffect } from "react";
import { X, QrCode } from "lucide-react";
import { Modal } from "@/lib/flowbite-compat";
import { useTranslation } from "react-i18next";
import { QRCodeSVG } from "qrcode.react";
import { attendanceService } from "../../../services/attendanceService";

interface DepartmentQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentId: number;
  departmentName: string;
}

export const DepartmentQRModal: React.FC<DepartmentQRModalProps> = ({ isOpen, onClose, departmentId, departmentName }) => {
  const { t } = useTranslation();
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Auto-refresh token every 4 minutes (since it expires in 5 minutes)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchToken = async () => {
      if (isOpen && departmentId) {
        setLoading(true);
        try {
          const newToken = await attendanceService.getDepartmentQrToken(departmentId);
          setToken(newToken);
        } catch (error) {
          console.error("Failed to fetch QR token", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchToken();
    if (isOpen) {
      interval = setInterval(fetchToken, 4 * 60 * 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, departmentId]);

  if (!isOpen) return null;

  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      size="sm"
      className="[&_.fixed.inset-0]:bg-black/80 [&_.fixed.inset-0]:backdrop-blur-md"
    >
      <div className="flex flex-col bg-white dark:bg-gray-950 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/10 dark:ring-white/5 items-center p-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl mb-4">
          <QrCode size={32} />
        </div>
        
        <h2 className="text-xl font-black text-gray-900 dark:text-white text-center mb-1">
          {departmentName} Check-in
        </h2>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest text-center mb-6">
          Scan to Clock In/Out
        </p>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
          {loading || !token ? (
            <div className="w-48 h-48 flex items-center justify-center bg-gray-50 rounded-xl">
              <span className="text-sm font-bold text-gray-400 animate-pulse">Generating...</span>
            </div>
          ) : (
            <QRCodeSVG 
              value={token} 
              size={200}
              level="H"
              includeMargin={false}
            />
          )}
        </div>

        <p className="text-[10px] text-gray-400 font-bold uppercase mt-6 text-center">
          QR Code auto-refreshes every 4 minutes for security
        </p>

      </div>
    </Modal>
  );
};
