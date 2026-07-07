import React, { useState } from "react";
import { X } from "lucide-react";

interface TimetableFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

export const TimetableFormModal: React.FC<TimetableFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      onDutyTime: "08:00",
      offDutyTime: "17:00",
      lateTime: 15,
      leaveEarlyTime: 15,
    }
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 md:left-[260px] z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1e293b] border border-gray-700 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-slide-up">
        <div className="flex justify-between items-center p-5 border-b border-gray-700/50 bg-[#0f172a]/50">
          <h2 className="text-lg font-bold text-white">
            {initialData ? "កែប្រែកាលវិភាគ / Edit Timetable" : "បន្ថែមវិភាគថ្មី / Add Timetable"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">ឈ្មោះកាលវិភាគ / Timetable Name</label>
            <input
              type="text"
              className="w-full bg-[#0f172a] border border-gray-700 text-white rounded-md text-sm px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. TimeTable AM"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">ម៉ោងចូល / On Duty Time</label>
              <input
                type="time"
                className="w-full bg-[#0f172a] border border-gray-700 text-white rounded-md text-sm px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all [color-scheme:dark]"
                value={formData.onDutyTime}
                onChange={(e) => setFormData({ ...formData, onDutyTime: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">ម៉ោងចេញ / Off Duty Time</label>
              <input
                type="time"
                className="w-full bg-[#0f172a] border border-gray-700 text-white rounded-md text-sm px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all [color-scheme:dark]"
                value={formData.offDutyTime}
                onChange={(e) => setFormData({ ...formData, offDutyTime: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">អនុញ្ញាតយឺត (នាទី) / Late Time (Min)</label>
              <input
                type="number"
                className="w-full bg-[#0f172a] border border-gray-700 text-white rounded-md text-sm px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={formData.lateTime}
                onChange={(e) => setFormData({ ...formData, lateTime: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">អនុញ្ញាតចេញមុន / Leave Early Time (Min)</label>
              <input
                type="number"
                className="w-full bg-[#0f172a] border border-gray-700 text-white rounded-md text-sm px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={formData.leaveEarlyTime}
                onChange={(e) => setFormData({ ...formData, leaveEarlyTime: parseInt(e.target.value) || 0 })}
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
            រក្សាទុក / Save
          </button>
        </div>
      </div>
    </div>
  );
};
