import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Activity, CheckCircle2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

interface AddHealthRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: number;
}

export default function AddHealthRecordModal({ isOpen, onClose, clientId }: AddHealthRecordModalProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    bloodType: "",
    height: "",
    weight: "",
    allergies: "",
    lastCheckupDate: new Date().toISOString().split('T')[0]
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post(`/api/clients/${clientId}/health`, {
        ...formData,
        height: parseFloat(formData.height) || 0,
        weight: parseFloat(formData.weight) || 0,
        lastCheckupDate: new Date(formData.lastCheckupDate).toISOString()
      });
      queryClient.invalidateQueries({ queryKey: ["clientPortfolio", clientId.toString()] });
      onClose();
    } catch (error) {
      console.error("Failed to add health record", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Activity size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add Medical Record</h3>
                <p className="text-xs text-gray-500">Record health metrics and history</p>
              </div>
            </div>
            <button onClick={onClose} className="flex h-8 w-8 min-w-[2rem] min-h-[2rem] shrink-0 aspect-square items-center justify-center rounded-full p-0 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:rotate-90 hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm">
            <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Blood Type</label>
              <select
                required
                value={formData.bloodType}
                onChange={(e) => setFormData({...formData, bloodType: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 dark:bg-gray-900 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
              >
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Height (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 dark:bg-gray-900 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                  placeholder="e.g. 170.5"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 dark:bg-gray-900 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                  placeholder="e.g. 65.2"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Allergies / Conditions</label>
              <textarea
                rows={3}
                value={formData.allergies}
                onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 dark:bg-gray-900 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white resize-none"
                placeholder="List any known allergies or chronic conditions..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Last Checkup Date</label>
              <input
                type="date"
                required
                value={formData.lastCheckupDate}
                onChange={(e) => setFormData({...formData, lastCheckupDate: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 dark:bg-gray-900 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
              />
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? "Saving..." : <><CheckCircle2 size={18} /> Save Record</>}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
