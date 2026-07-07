import React, { useState } from "react";
import { X } from "lucide-react";

interface HolidayFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

export const HolidayFormModal: React.FC<HolidayFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      date: "",
      description: "",
    }
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 md:left-[260px] z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1e293b] border border-gray-700 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-slide-up">
        <div className="flex justify-between items-center p-5 border-b border-gray-700/50 bg-[#0f172a]/50">
          <h2 className="text-lg font-bold text-white">
            {initialData ? "កែប្រែថ្ងៃឈប់សម្រាក / Edit Holiday" : "បន្ថែមថ្ងៃឈប់សម្រាក / Add Holiday"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">ឈ្មោះថ្ងៃឈប់សម្រាក / Holiday Name</label>
            <input
              type="text"
              className="w-full bg-[#0f172a] border border-gray-700 text-white rounded-md text-sm px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. Khmer New Year"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">កាលបរិច្ឆេទ / Date</label>
            <input
              type="date"
              className="w-full bg-[#0f172a] border border-gray-700 text-white rounded-md text-sm px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all [color-scheme:dark]"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">ការពិពណ៌នា / Description</label>
            <textarea
              className="w-full bg-[#0f172a] border border-gray-700 text-white rounded-md text-sm px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Optional description..."
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
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
            className="px-5 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-colors shadow-lg shadow-rose-500/20"
          >
            រក្សាទុក / Save
          </button>
        </div>
      </div>
    </div>
  );
};
