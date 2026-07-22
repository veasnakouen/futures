"use client";
import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicService, MedicalRecordDto } from "@/services/clinicService";
import MedicalRecordFormModal from "./MedicalRecordFormModal";
import ConfirmModal from "@/components/common/ConfirmModal";
import { toast } from "react-hot-toast";
import { AdvancedDataTable } from "@/components/ui/advanced-data-table";

import { useMedicalRecordColumns } from "./record/useMedicalRecordColumns";
import { MedicalRecordMetricsBanner } from "./record/MedicalRecordMetricsBanner";
import { MedicalRecordFilterToolbar } from "./record/MedicalRecordFilterToolbar";

export default function MedicalRecordList() {
  const [size] = useState(100);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MedicalRecordDto | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["medical-records", 0, size],
    queryFn: () => clinicService.getMedicalRecords(0, size).then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clinicService.deleteMedicalRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-records"] });
      toast.success("Medical record deleted successfully");
      setIsConfirmOpen(false);
    },
    onError: () => toast.error("Failed to delete medical record"),
  });

  const allRecords: MedicalRecordDto[] = data?.content || [
    {
      id: "REC-8801",
      patientId: "MRN-b3f099f0",
      doctorId: "DOC-101",
      recordDate: "2026-07-23T10:30:00Z",
      diagnosis: "Acute Bronchitis & Wheezing",
      treatment: "Amoxicillin 500mg (7 Days) + Salbutamol Inhaler",
      prescription: "RX-1001"
    },
    {
      id: "REC-8802",
      patientId: "MRN-a1e088c2",
      doctorId: "DOC-102",
      recordDate: "2026-07-22T14:15:00Z",
      diagnosis: "Primary Hypertension Followup",
      treatment: "Lifestyle Modification & Amlodipine 5mg Daily",
      prescription: "RX-1002"
    }
  ];

  const counts = useMemo(() => {
    const total = allRecords.length;
    const diagnosesCount = allRecords.filter((r) => Boolean(r.diagnosis)).length;
    return { total, diagnosesCount };
  }, [allRecords]);

  const handleEditRecord = (record: MedicalRecordDto) => {
    setSelectedItem(record);
    setIsFormOpen(true);
  };

  const handleDeleteRecord = (record: MedicalRecordDto) => {
    setSelectedItem(record);
    setIsConfirmOpen(true);
  };

  const columns = useMedicalRecordColumns({
    onEdit: handleEditRecord,
    onDelete: handleDeleteRecord,
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 pb-12">
      {/* Metrics Summary Banner */}
      <MedicalRecordMetricsBanner counts={counts} />

      {/* Main Header & Dynamic Filter Toolbar */}
      <MedicalRecordFilterToolbar
        filteredCount={allRecords.length}
        onAddRecord={() => {
          setSelectedItem(null);
          setIsFormOpen(true);
        }}
      />

      {/* Advanced Data Table */}
      <AdvancedDataTable
        columns={columns}
        data={allRecords}
        searchKey="diagnosis"
        searchPlaceholder="Search by diagnosis, patient ID, doctor ID, or record date..."
        isLoading={isLoading}
      />

      {/* Form & Confirmation Modals */}
      <MedicalRecordFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} itemToEdit={selectedItem} />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => selectedItem && deleteMutation.mutate(selectedItem.id)}
        title="Delete Medical Record"
        message="Are you sure you want to permanently delete this electronic health record?"
        confirmText="Delete Record"
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
