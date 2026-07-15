import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Briefcase, CheckCircle2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

interface AddCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: number;
}

export default function AddCaseModal({ isOpen, onClose, clientId }: AddCaseModalProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    serviceType: "Counseling",
    priority: "Medium",
    description: ""
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post(`/api/cases`, {
        ...formData,
        clientId: clientId.toString()
      });
      queryClient.invalidateQueries({ queryKey: ["clientPortfolio", clientId.toString()] });
      onClose();
    } catch (error) {
      console.error("Failed to add case", error);
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
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <Briefcase size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Open New Case</h3>
                <p className="text-xs text-gray-500">Initiate a social work intervention</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Subject / Title</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 dark:bg-gray-900 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                placeholder="e.g. Housing Assistance Required"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Service Type</label>
                <select
                  required
                  value={formData.serviceType}
                  onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 dark:bg-gray-900 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                >
                  <option value="Counseling">Counseling</option>
                  <option value="Financial Aid">Financial Aid</option>
                  <option value="Legal Support">Legal Support</option>
                  <option value="Housing">Housing</option>
                  <option value="Medical">Medical</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Priority</label>
                <select
                  required
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 dark:bg-gray-900 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Case Description</label>
              <textarea
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 dark:bg-gray-900 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white resize-none"
                placeholder="Describe the client's current situation and required interventions..."
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
                className="flex-1 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? "Saving..." : <><CheckCircle2 size={18} /> Open Case</>}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
