"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicService } from "../../../services/clinicService";
import { Stethoscope, Plus, Clock, Pill } from "lucide-react";
import { motion } from "framer-motion";

export default function PrescriptionsTab({ patientId }: { patientId: string }) {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    diagnosis: "",
    items: [{ drugName: "", dosage: "", frequency: "", duration: "", ndcCode: "N/A", refillsAllowed: "0", phamacyId: "N/A" }],
  });

  const { data: prescriptions, isLoading } = useQuery({
    queryKey: ["prescriptions", patientId],
    queryFn: () => clinicService.getPrescriptionsByPatient(patientId).then((res) => res.data),
  });

  const createPrescriptionMutation = useMutation({
    mutationFn: (data: any) => clinicService.createPrescription({ ...data, patientId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions", patientId] });
      setIsModalOpen(false);
      setFormData({
        diagnosis: "",
        items: [{ drugName: "", dosage: "", frequency: "", duration: "", ndcCode: "N/A", refillsAllowed: "0", phamacyId: "N/A" }],
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPrescriptionMutation.mutate(formData);
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { drugName: "", dosage: "", frequency: "", duration: "", ndcCode: "N/A", refillsAllowed: "0", phamacyId: "N/A" }],
    });
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...formData.items];
    (newItems[index] as any)[field] = value;
    setFormData({ ...formData, items: newItems });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Active & Past Prescriptions</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-md shadow-rose-500/20"
        >
          <Plus size={18} /> Prescribe Medicine
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading prescriptions...</div>
      ) : prescriptions && prescriptions.length > 0 ? (
        <div className="space-y-4">
          {prescriptions.map((prescription: any, index: number) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={prescription.id}
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 rounded-l-2xl"></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl">
                  <Stethoscope size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Prescription</h4>
                  <p className="text-xs text-gray-500">Diagnosis: {prescription.diagnosis}</p>
                </div>
              </div>
              <div className="space-y-3">
                {prescription.items?.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl text-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <Pill size={16} className="text-rose-400" />
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">{item.drugName}</p>
                        <p className="text-xs text-gray-500">{item.dosage} • {item.frequency}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Duration</p>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{item.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white/40 dark:bg-gray-900/40 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
          <Stethoscope size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
          <p className="text-gray-500">No prescriptions found for this patient.</p>
        </div>
      )}

      {/* New Prescription Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Stethoscope size={20} className="text-rose-500" /> New Prescription
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Diagnosis / Reason</label>
                <input
                  required
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                  placeholder="e.g. Acute Bronchitis"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-gray-700 dark:text-gray-300">Medications</h4>
                  <button type="button" onClick={addItem} className="text-sm text-rose-600 dark:text-rose-400 font-bold hover:underline">
                    + Add Medication
                  </button>
                </div>
                
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 mb-1">Drug Name</label>
                      <input
                        required
                        value={item.drugName}
                        onChange={(e) => updateItem(index, "drugName", e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-rose-500"
                        placeholder="e.g. Amoxicillin"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Dosage</label>
                      <input
                        required
                        value={item.dosage}
                        onChange={(e) => updateItem(index, "dosage", e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-rose-500"
                        placeholder="e.g. 500mg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Frequency</label>
                      <input
                        required
                        value={item.frequency}
                        onChange={(e) => updateItem(index, "frequency", e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-rose-500"
                        placeholder="e.g. 3x Daily"
                      />
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-xs font-bold text-gray-500 mb-1">Duration</label>
                      <input
                        required
                        value={item.duration}
                        onChange={(e) => updateItem(index, "duration", e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-rose-500"
                        placeholder="e.g. 7 Days"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createPrescriptionMutation.isPending}
                  className="px-5 py-2.5 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 transition-all shadow-lg shadow-rose-500/30"
                >
                  {createPrescriptionMutation.isPending ? "Saving..." : "Save Prescription"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
