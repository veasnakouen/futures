import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Users, Calendar as CalendarIcon } from "lucide-react";

interface ScheduleAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const ScheduleAssignmentModal: React.FC<ScheduleAssignmentModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    employeeId: "",
    shiftId: "",
    dateFrom: "",
    dateTo: "",
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 md:left-[260px] z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1e293b] border border-gray-700 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-slide-up">
        <div className="flex justify-between items-center p-5 border-b border-gray-700/50 bg-[#0f172a]/50">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CalendarIcon size={20} className="text-blue-500" />
            ចាត់តាំងកាលវិភាគ / Assign Schedule
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">ជ្រើសរើសបុគ្គលិក / Select Employee</label>
            <div className="relative">
              <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <select
                className="w-full bg-[#0f172a] border border-gray-700 text-white rounded-md text-sm pl-10 pr-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              >
                <option value="">-- សូមជ្រើសរើស / Select --</option>
                <option value="EMP-001">Koeun Veasna</option>
                <option value="EMP-002">Sok San</option>
                <option value="EMP-003">Chan Dara</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">ជ្រើសរើសវេន / Select Shift</label>
            <select
              className="w-full bg-[#0f172a] border border-gray-700 text-white rounded-md text-sm px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={formData.shiftId}
              onChange={(e) => setFormData({ ...formData, shiftId: e.target.value })}
            >
              <option value="">-- សូមជ្រើសរើស / Select --</option>
              <option value="SHIFT-1">TimeTable AM (08:00 - 12:00)</option>
              <option value="SHIFT-2">TimeTable PM (13:00 - 17:00)</option>
              <option value="SHIFT-3">Full Day (08:00 - 17:00)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">ចាប់ពីថ្ងៃ / Date From</label>
              <input
                type="date"
                className="w-full bg-[#0f172a] border border-gray-700 text-white rounded-md text-sm px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all [color-scheme:dark]"
                value={formData.dateFrom}
                onChange={(e) => setFormData({ ...formData, dateFrom: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">រហូតដល់ថ្ងៃ / Date To</label>
              <input
                type="date"
                className="w-full bg-[#0f172a] border border-gray-700 text-white rounded-md text-sm px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all [color-scheme:dark]"
                value={formData.dateTo}
                onChange={(e) => setFormData({ ...formData, dateTo: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-gray-700/50 bg-[#0f172a]/30 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-gray-300 hover:text-white transition-colors"
          >
            បោះបង់ / Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-lg shadow-blue-500/20"
          >
            ចាត់តាំង / Assign
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
