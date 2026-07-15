import React, { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon } from "lucide-react";
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
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      date: "",
      description: "",
    }
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      size="md"
      className="[&_.fixed.inset-0]:bg-black/60 [&_.fixed.inset-0]:backdrop-blur-sm"
    >
      <div className="flex flex-col bg-white dark:bg-gray-950 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/10 dark:ring-white/5">
        
        {/* ── Header ── */}
        <div className="relative flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-gradient-to-b from-[#7a2323] to-[#c53030]" />
          <h2 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2 pl-2 tracking-tight">
            <CalendarIcon size={18} className="text-[#c53030]" />
            {initialData ? t("editHoliday") : t("addHoliday")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
              {t("holidayName")}
            </label>
            <input
              type="text"
              className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl text-sm px-3 py-2.5 focus:ring-2 focus:ring-[#c53030]/20 focus:border-[#c53030] outline-none transition-all font-semibold placeholder:text-gray-400 dark:placeholder:text-gray-600"
              placeholder={t("egKhmerNewYear")}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
              {t("date")}
            </label>
            <Datepicker
              className="w-full"
              value={formData.date}
              onChange={(e: any) => setFormData({ ...formData, date: e.target ? e.target.value : e })}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
              {t("description")}
            </label>
            <textarea
              className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl text-sm px-3 py-2.5 focus:ring-2 focus:ring-[#c53030]/20 focus:border-[#c53030] outline-none transition-all font-semibold placeholder:text-gray-400 dark:placeholder:text-gray-600"
              placeholder={t("optionalDescription")}
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            {t("cancel")}
          </button>
          <button
            onClick={() => {
              if (initialData?.id) {
                updateMutation.mutate({ ...formData, id: initialData.id }, { onSuccess: () => onClose() });
              } else {
                createMutation.mutate(formData, { onSuccess: () => onClose() });
              }
            }}
            disabled={createMutation.isPending || updateMutation.isPending}
            className="px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-white bg-gradient-to-r from-[#7a2323] to-[#c53030] hover:from-[#5c1a1a] hover:to-[#a32828] rounded-xl transition-all shadow-md shadow-red-900/20 disabled:opacity-50"
          >
            {(createMutation.isPending || updateMutation.isPending) ? t("saving") : t("save")}
          </button>
        </div>
      </div>
    </Modal>
  );
};
