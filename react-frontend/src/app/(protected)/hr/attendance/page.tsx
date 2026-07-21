"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAttendance } from "@/hooks/useHR";
import { Edit2, Trash2, Search, Plus, Clock, FileSpreadsheet, QrCode } from "lucide-react";
import { format } from "date-fns";
import ManualAttendanceModal from "@/features/hr/components/ManualAttendanceModal";
import api from "@/services/api";
import { QRCodeCanvas } from "qrcode.react";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function AttendanceLogsPage() {
  const { data: globalAttendance = [], isLoading } = useAttendance();
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrToken, setQrToken] = useState("");
  const [appLogo, setAppLogo] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const { user } = useAuthStore();
  const isAdminOrSuperAdmin = isHydrated && user?.roles?.some(role => role.toUpperCase().includes("ADMIN"));

  React.useEffect(() => {
    setIsHydrated(true);
    // Fetch App Logo for QR Code center
    api.get("/settings/APP_LOGO")
      .then(res => {
        if (res.data && res.data.value) setAppLogo(res.data.value);
      })
      .catch(() => {
        // Fallback to localStorage or generic
      });
  }, []);

  const fetchQrCode = async (isPermanent: boolean = false) => {
    try {
      const res = await api.get(`/lookups/qr-token?permanent=${isPermanent}`);
      if (res.data && res.data.token) {
        setQrToken(res.data.token);
        setIsQrModalOpen(true);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate QR Code. Please try again.");
    }
  };

  const getStatusBadge = (status: string) => {
    if (!status) return null;
    const lower = status.toLowerCase();

    if (lower.includes("late & early")) {
      return (
        <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-rose-100 text-rose-600 text-[9px] font-black uppercase tracking-wider whitespace-nowrap border border-rose-200 shadow-sm text-center">
          យឺត & <br /> ចេញមុន / <br /> LATE & <br /> EARLY
        </span>
      );
    }
    if (lower.includes("late")) {
      return (
        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-wider whitespace-nowrap border border-amber-200 shadow-sm text-center">
          មកយឺត / <br /> LATE
        </span>
      );
    }
    if (lower.includes("present") || lower.includes("on_time")) {
      return (
        <span className="inline-flex items-center justify-center px-3 py-1. rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-wider whitespace-nowrap border border-emerald-200 shadow-sm">
          ទាន់ពេល / <br /> ON TIME
        </span>
      );
    }

    return (
      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-wider whitespace-nowrap border border-gray-200 shadow-sm">
        {status}
      </span>
    );
  };

  return (
    <div className="animate-fade-in text-white max-w-[1400px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">គ្រប់គ្រងវត្តមានបុគ្គលិក / Attendance Management</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
            AUDIT, CORRECT, OR MANUALLY RECORD CHECK-IN/OUT LOGS
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isAdminOrSuperAdmin && (
            <button
              onClick={() => fetchQrCode(false)}
              className="flex items-center gap-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-5 py-2.5 rounded-md text-sm font-bold transition-colors shadow-sm"
            >
              <QrCode size={16} /> បង្កើត QR ស្កេន / Generate Check-In QR
            </button>
          )}
          <button className="flex items-center gap-2 bg-[#d97706] hover:bg-[#b45309] text-white px-5 py-2.5 rounded-md text-sm font-bold transition-colors shadow-sm">
            <Clock size={16} /> ភ្លេចស្កេនចូល/ចេញ / Forgot Clock-In/Out
          </button>
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 py-2.5 rounded-md text-sm font-bold transition-colors shadow-sm"
          >
            <Plus size={16} /> ចុះវត្តមានដោយដៃ / Manual Attendance
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-[#1e293b] border border-gray-700/50 rounded-xl p-5 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1.5">ការិយាល័យ / Department</label>
            <select
              className="w-full bg-[#0f172a] border border-gray-700 text-white rounded-md text-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              <option value="IT">IT & Engineering</option>
              <option value="HR">Human Resources</option>
              <option value="Sales">Sales</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1.5">ស្វែងរកបុគ្គលិក / Employee</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Name or ID"
                className="w-full bg-[#0f172a] border border-gray-700 text-white rounded-md text-sm pl-9 pr-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={employeeFilter}
                onChange={(e) => setEmployeeFilter(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1.5">ចាប់ពីថ្ងៃ / From Date</label>
            <input
              type="date"
              className="w-full bg-[#0f172a] border border-gray-700 text-white rounded-md text-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all [color-scheme:dark]"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1.5">ដល់ថ្ងៃ / To Date</label>
            <input
              type="date"
              className="w-full bg-[#0f172a] border border-gray-700 text-white rounded-md text-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all [color-scheme:dark]"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-[#1e293b] border border-gray-700/50 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0f172a] border-b border-gray-700/50">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                  បុគ្គលិក <br /> Employee
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                  ថ្ងៃខែ <br /> Date
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                  វេនការងារ <br /> Shift
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap text-center">
                  ស្កេនចូល <br /> Check In
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap text-center">
                  ស្កេនចេញ <br /> Check Out
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap text-center">
                  ស្ថានភាព <br /> Status
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap text-right">
                  សកម្មភាព <br /> Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                      <span className="font-bold">Loading Attendance Logs...</span>
                    </div>
                  </td>
                </tr>
              ) : globalAttendance.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <FileSpreadsheet size={48} className="text-gray-600 mb-3 opacity-50" />
                      <span className="font-bold text-sm">No Attendance Logs Found</span>
                      <p className="text-xs mt-1 text-gray-500">Try adjusting your filters or date range.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                globalAttendance.map((log: any) => (
                  <tr key={log.id} className="hover:bg-gray-800/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {log.employee?.firstNameEnglish?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">
                            {log.employee?.firstNameEnglish} {log.employee?.lastNameEnglish}
                          </div>
                          <div className="text-xs text-gray-400">{log.employee?.idNo || "N/A"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-200">
                        {log.clockIn ? format(new Date(log.clockIn), "MMM dd, yyyy") : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-800 text-gray-300 border border-gray-700">
                        {log.shiftName || "Standard"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {log.clockIn ? (
                        <span className="font-mono text-sm text-blue-400 font-bold bg-blue-500/10 px-2 py-1 rounded">
                          {format(new Date(log.clockIn), "HH:mm")}
                        </span>
                      ) : (
                        <span className="text-gray-600 text-sm font-bold">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {log.clockOut ? (
                        <span className="font-mono text-sm text-indigo-400 font-bold bg-indigo-500/10 px-2 py-1 rounded">
                          {format(new Date(log.clockOut), "HH:mm")}
                        </span>
                      ) : (
                        <span className="text-gray-600 text-sm font-bold">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getStatusBadge(log.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white rounded transition-colors" title="Edit Log">
                          <Edit2 size={14} />
                        </button>
                        <button className="p-1.5 bg-gray-800 hover:bg-rose-600 text-gray-300 hover:text-white rounded transition-colors" title="Delete Log">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Check-In Modal */}
      {isManualModalOpen && (
        <ManualAttendanceModal
          isOpen={isManualModalOpen}
          onClose={() => setIsManualModalOpen(false)}
          employees={[]}
          handleSubmit={(data) => {
            console.log("Manual attendance data submitted:", data);
            setIsManualModalOpen(false);
          }}
        />
      )}

      {/* Modern Solid QR Code Modal */}
      {isQrModalOpen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/90 animate-in fade-in duration-200 px-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform scale-100 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <QrCode size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 tracking-tight">QR CODE KIOSK</h3>
                  <p className="text-[10px] text-gray-500 font-bold tracking-widest">DEPARTMENT SCANNER</p>
                </div>
              </div>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center text-gray-600 transition-colors"
              >
                <span className="text-lg font-bold leading-none">&times;</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col items-center justify-center bg-white">
              <div className="p-4 bg-white rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.05)] border border-gray-100">
                {qrToken ? (
                  <QRCodeCanvas
                    value={qrToken}
                    size={240}
                    level="H"
                    includeMargin={true}
                    imageSettings={
                      appLogo
                        ? {
                          src: appLogo,
                          x: undefined,
                          y: undefined,
                          height: 48,
                          width: 48,
                          excavate: true,
                        }
                        : undefined
                    }
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-[240px] text-gray-400">
                    <QrCode size={48} className="animate-pulse mb-4 text-gray-200" />
                    <p className="text-sm font-bold uppercase tracking-widest">Generating Code...</p>
                  </div>
                )}
              </div>

              <div className="mt-8 text-center px-4">
                <h4 className="text-gray-900 font-black text-lg mb-2">Check-In & Check-Out</h4>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  Scan this QR code with your <strong className="text-gray-900">Staff Mobile App</strong>. Your location will be verified to ensure you are at the correct department.
                </p>
              </div>

              <div className="mt-8 flex gap-2 w-full px-4">
                <button
                  onClick={() => fetchQrCode(false)}
                  className="flex-1 py-3 bg-gray-900 text-white font-black rounded-xl hover:bg-blue-600 transition-colors text-xs uppercase tracking-widest shadow-lg shadow-gray-900/20"
                >
                  Refresh 5-Min Token
                </button>
                {isAdminOrSuperAdmin && (
                  <button
                    onClick={() => fetchQrCode(true)}
                    className="flex-1 py-3 bg-white text-gray-700 border-2 border-gray-200 font-black rounded-xl hover:border-gray-900 hover:text-gray-900 transition-colors text-xs uppercase tracking-widest"
                  >
                    Generate Permanent Token
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
