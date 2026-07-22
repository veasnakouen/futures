"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicService } from "../../../services/clinicService";
import { Plus, Pill, Clock, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";
import { Modal, ModalBody } from "@/lib/flowbite-compat";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";

export default function PrescriptionsTab({ patientId }: { patientId: string }) {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    diagnosis: "",
    items: [
      { drugName: "", dosage: "", frequency: "", duration: "", ndcCode: "", refillsAllowed: "0", phamacyId: "PHARM-1" }
    ]
  });

  const { data: prescriptions, isLoading } = useQuery({
    queryKey: ["prescriptions", patientId],
    queryFn: () => clinicService.getPrescriptionsByPatient(patientId).then((res) => res.data.content || res.data),
  });

  const createPrescriptionMutation = useMutation({
    mutationFn: (data: any) => clinicService.createPrescription({ ...data, patientId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions", patientId] });
      setIsModalOpen(false);
      setFormData({
        diagnosis: "",
        items: [{ drugName: "", dosage: "", frequency: "", duration: "", ndcCode: "", refillsAllowed: "0", phamacyId: "PHARM-1" }]
      });
    },
  });

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { drugName: "", dosage: "", frequency: "", duration: "", ndcCode: "", refillsAllowed: "0", phamacyId: "PHARM-1" }]
    });
  };

  const handleUpdateItem = (index: number, field: string, value: string) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPrescriptionMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Prescriptions & Rx Orders</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-md"
        >
          <Plus size={18} /> New Prescription
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading prescriptions...</div>
      ) : prescriptions && prescriptions.length > 0 ? (
        <div className="space-y-4">
          {prescriptions.map((rx: any, index: number) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={rx.id || index}
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden space-y-4"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 rounded-l-2xl"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl">
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Diagnosis: {rx.diagnosis}</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} /> Issued: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {rx.items?.map((item: any, idx: number) => (
                  <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Pill size={16} className="text-rose-500 shrink-0" />
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
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} size="3xl">
        <CustomModalHeader
          title="New Prescription"
          subtitle="Patient Medication & Dosage Instructions"
          onClose={() => setIsModalOpen(false)}
          icon={<Stethoscope size={20} />}
        />
        <form onSubmit={handleSubmit}>
          <ModalBody className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Diagnosis / Reason</label>
              <input
                required
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all text-sm font-bold text-gray-900 dark:text-white"
                placeholder="e.g. Acute Bronchitis"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300">Medications</h4>
                <button type="button" onClick={handleAddItem} className="text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline">
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
                      onChange={(e) => handleUpdateItem(index, "drugName", e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-rose-500 text-sm font-bold text-gray-900 dark:text-white"
                      placeholder="e.g. Amoxicillin"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Dosage</label>
                    <input
                      required
                      value={item.dosage}
                      onChange={(e) => handleUpdateItem(index, "dosage", e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-rose-500 text-sm font-bold text-gray-900 dark:text-white"
                      placeholder="e.g. 500mg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Frequency</label>
                    <input
                      required
                      value={item.frequency}
                      onChange={(e) => handleUpdateItem(index, "frequency", e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-rose-500 text-sm font-bold text-gray-900 dark:text-white"
                      placeholder="e.g. 3x Daily"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-gray-500 mb-1">Duration</label>
                    <input
                      required
                      value={item.duration}
                      onChange={(e) => handleUpdateItem(index, "duration", e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-rose-500 text-sm font-bold text-gray-900 dark:text-white"
                      placeholder="e.g. 7 Days"
                    />
                  </div>
                </div>
              ))}
            </div>
          </ModalBody>
          <CustomModalFooter
            onClose={() => setIsModalOpen(false)}
            submitText="Save Prescription"
            submitDisabled={createPrescriptionMutation.isPending}
          />
        </form>
      </Modal>
    </div>
  );
}
