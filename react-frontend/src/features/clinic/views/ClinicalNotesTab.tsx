"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicService } from "../../../services/clinicService";
import { FileText, Plus, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Modal, ModalBody } from "@/lib/flowbite-compat";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";

export default function ClinicalNotesTab({ patientId }: { patientId: string }) {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    diagnosis: "",
    treatment: "",
    prescription: "",
    doctorId: "DOC-123",
  });

  const { data: records, isLoading } = useQuery({
    queryKey: ["medicalRecords", patientId],
    queryFn: () => clinicService.getMedicalRecordsByPatient(patientId).then((res) => res.data.content || res.data),
  });

  const createRecordMutation = useMutation({
    mutationFn: (data: any) => clinicService.createMedicalRecord({ ...data, patientId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicalRecords", patientId] });
      setIsModalOpen(false);
      setFormData({ diagnosis: "", treatment: "", prescription: "", doctorId: "DOC-123" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRecordMutation.mutate({
      ...formData,
      recordDate: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Clinical History</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-md"
        >
          <Plus size={18} /> Add Consultation
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading records...</div>
      ) : records && records.length > 0 ? (
        <div className="space-y-4">
          {records.map((record: any, index: number) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={record.id}
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-2xl"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Consultation</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} /> {new Date(record.recordDate).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-bold text-gray-700 dark:text-gray-300 mb-1">Diagnosis</p>
                  <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl">
                    {record.diagnosis || "No diagnosis provided"}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-gray-700 dark:text-gray-300 mb-1">Treatment Plan</p>
                  <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl">
                    {record.treatment || "No treatment plan provided"}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white/40 dark:bg-gray-900/40 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
          <FileText size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
          <p className="text-gray-500">No clinical records found for this patient.</p>
        </div>
      )}

      {/* New Consultation Modal */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} size="2xl">
        <CustomModalHeader
          title="New Consultation"
          subtitle="Record Clinical History & Treatment Plan"
          onClose={() => setIsModalOpen(false)}
          icon={<FileText size={20} />}
        />
        <form onSubmit={handleSubmit}>
          <ModalBody className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Diagnosis</label>
              <textarea
                required
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none h-24 text-sm font-medium text-gray-900 dark:text-white"
                placeholder="Enter patient diagnosis..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Treatment Plan</label>
              <textarea
                required
                value={formData.treatment}
                onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none h-32 text-sm font-medium text-gray-900 dark:text-white"
                placeholder="Enter treatment plan..."
              />
            </div>
          </ModalBody>
          <CustomModalFooter
            onClose={() => setIsModalOpen(false)}
            submitText="Save Consultation"
            submitDisabled={createRecordMutation.isPending}
          />
        </form>
      </Modal>
    </div>
  );
}
