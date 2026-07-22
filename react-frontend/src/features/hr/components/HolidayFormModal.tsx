import React, { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon, CalendarRange, Type, AlignLeft, Tags } from "lucide-react";
import { useHoliday } from "@/hooks/useHoliday";
import { Modal, Datepicker } from "@/lib/flowbite-compat";
import { useTranslation } from "react-i18next";

interface HolidayFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

export const HolidayFormModal: React.FC<HolidayFormModalProps> = ({ isOpen, onClose, initialData }) => {
  const { t } = useTranslation();
  const { useCreateHoliday, useUpdateHoliday } = useHoliday();
  const createMutation = useCreateHoliday();
  const updateMutation = useUpdateHoliday();
  
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
    category: "System",
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || "",
          startDate: initialData.startDate || "",
          endDate: initialData.endDate || "",
          description: initialData.description || "",
          category: initialData.category || "System",
        });
      } else {
        const today = new Date().toISOString().split("T")[0];
        setFormData({
          name: "",
          startDate: today,
          endDate: today,
          description: "",
          category: "System",
        });
      }
    }
  }, [isOpen, initialData]);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const handleSave = () => {
    // Basic validation
    if (!formData.name.trim() || !formData.startDate || !formData.endDate) {
      // In a real app, toast an error here.
      return;
    }

    if (initialData?.id) {
      updateMutation.mutate({ ...formData, id: initialData.id }, { onSuccess: () => onClose() });
    } else {
      createMutation.mutate(formData, { onSuccess: () => onClose() });
    }
  };

  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      size="lg"
      className="[&_.fixed.inset-0]:bg-black/60 [&_.fixed.inset-0]:backdrop-blur-sm"
    >
      <div className="flex flex-col max-h-[85vh] bg-white dark:bg-[#0f172a] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/10 dark:ring-white/10 animate-scale-in">
        
        {/* ── Header ── */}
        <div className="relative shrink-0 flex items-center justify-between px-6 py-5 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-[#0f172a] border-b border-gray-100 dark:border-gray-800">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#7a2323] to-[#c53030]" />
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2 pl-3 tracking-tight">
              <CalendarRange size={20} className="text-[#c53030]" />
              {initialData ? "Edit Holiday Plan" : "New Holiday Plan"}
            </h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-3 mt-1">
              Specify single or multi-day duration
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 min-w-[2rem] min-h-[2rem] shrink-0 aspect-square items-center justify-center rounded-full p-0 bg-gray-100 text-gray-500 hover:bg-rose-100 hover:text-rose-600 hover:rotate-90 hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-rose-500/20 dark:hover:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[60vh] custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2 group">
              <label className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase tracking-widest group-focus-within:text-[#c53030] transition-colors">
                <Type size={12} /> {t("holidayName")}
              </label>
              <input
                type="text"
                className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl text-sm px-4 py-3 focus:ring-2 focus:ring-[#c53030]/20 focus:border-[#c53030] outline-none transition-all font-bold placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm"
                placeholder={t("egKhmerNewYear")}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2 group">
              <label className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase tracking-widest group-focus-within:text-[#c53030] transition-colors">
                <CalendarIcon size={12} /> Start Date
              </label>
              <Datepicker
                className="w-full [&_input]:bg-gray-50 [&_input]:dark:bg-gray-900/50 [&_input]:border-gray-200 [&_input]:dark:border-gray-700 [&_input]:rounded-xl [&_input]:py-3 [&_input]:font-bold [&_input]:shadow-sm"
                value={formData.startDate}
                onChange={(date: Date | null) =>
                  setFormData({
                    ...formData,
                    startDate: date ? date.toISOString().split("T")[0] : "",
                  })
                }
              />
            </div>

            <div className="space-y-2 group">
              <label className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase tracking-widest group-focus-within:text-[#c53030] transition-colors">
                <CalendarIcon size={12} /> End Date
              </label>
              <Datepicker
                className="w-full [&_input]:bg-gray-50 [&_input]:dark:bg-gray-900/50 [&_input]:border-gray-200 [&_input]:dark:border-gray-700 [&_input]:rounded-xl [&_input]:py-3 [&_input]:font-bold [&_input]:shadow-sm"
                value={formData.endDate}
                onChange={(date: Date | null) =>
                  setFormData({
                    ...formData,
                    endDate: date ? date.toISOString().split("T")[0] : "",
                  })
                }
              />
            </div>

            <div className="md:col-span-2 space-y-2 group">
              <label className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase tracking-widest group-focus-within:text-[#c53030] transition-colors">
                <Tags size={12} /> Category
              </label>
              <select
                className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl text-sm px-4 py-3 focus:ring-2 focus:ring-[#c53030]/20 focus:border-[#c53030] outline-none transition-all font-bold shadow-sm"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="System">System Holiday</option>
                <option value="National">National Holiday</option>
                <option value="Corporate">Corporate Event</option>
                <option value="Optional">Optional Leave</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-2 group">
              <label className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase tracking-widest group-focus-within:text-[#c53030] transition-colors">
                <AlignLeft size={12} /> {t("description")}
              </label>
              <textarea
                className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl text-sm px-4 py-3 focus:ring-2 focus:ring-[#c53030]/20 focus:border-[#c53030] outline-none transition-all font-medium placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm resize-none"
                placeholder={t("optionalDescription")}
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="p-5 shrink-0 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/80 flex justify-end gap-3 backdrop-blur-md sticky bottom-0 z-20">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleSave}
            disabled={createMutation.isPending || updateMutation.isPending}
            className="px-8 py-2.5 text-[11px] font-black uppercase tracking-widest text-white bg-gradient-to-r from-[#7a2323] to-[#c53030] hover:from-[#5c1a1a] hover:to-[#a32828] rounded-xl transition-all shadow-lg shadow-red-900/20 disabled:opacity-50 hover:scale-105 active:scale-95"
          >
            {(createMutation.isPending || updateMutation.isPending) ? t("saving") : "Commit to Roster"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
