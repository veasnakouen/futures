"use client";
import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicService, PrescriptionDto } from "@/services/clinicService";
import PrescriptionFormModal from "./PrescriptionFormModal";
import ConfirmModal from "@/components/common/ConfirmModal";
import { toast } from "react-hot-toast";
import { AdvancedDataTable } from "@/components/ui/advanced-data-table";

import { usePrescriptionColumns } from "./prescription/usePrescriptionColumns";
import { PrescriptionMetricsBanner } from "./prescription/PrescriptionMetricsBanner";
import { PrescriptionFilterToolbar } from "./prescription/PrescriptionFilterToolbar";

export default function PrescriptionList() {
  const [size] = useState(100);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PrescriptionDto | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["prescriptions", 0, size],
    queryFn: () => clinicService.getPrescriptions(0, size).then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clinicService.deletePrescription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      toast.success("Prescription order deleted successfully");
      setIsConfirmOpen(false);
    },
    onError: () => toast.error("Failed to delete prescription order"),
  });

  const allPrescriptions: PrescriptionDto[] = data?.content || [
    {
      id: "RX-1001",
      patientId: "MRN-b3f099f0",
      diagnosis: "Acute Bronchitis & Respiratory Distress",
      items: [
        { drugName: "Amoxicillin 500mg", dosage: "500mg", frequency: "3x Daily", duration: "7 Days", ndcCode: "0003-0881", refillsAllowed: "0", phamacyId: "P1" },
        { drugName: "Paracetamol 500mg", dosage: "500mg", frequency: "As Needed", duration: "5 Days", ndcCode: "0003-0882", refillsAllowed: "1", phamacyId: "P1" }
      ]
    },
    {
      id: "RX-1002",
      patientId: "MRN-a1e088c2",
      diagnosis: "Essential Hypertension",
      items: [
        { drugName: "Amlodipine 5mg", dosage: "5mg", frequency: "1x Daily", duration: "30 Days", ndcCode: "0003-0899", refillsAllowed: "3", phamacyId: "P1" }
      ]
    }
  ];

  const counts = useMemo(() => {
    const total = allPrescriptions.length;
    let medicationsCount = 0;
    let multiDrugOrders = 0;

    allPrescriptions.forEach((rx) => {
      const numItems = rx.items?.length || 1;
      medicationsCount += numItems;
      if (numItems > 1) multiDrugOrders++;
    });

    return { total, medicationsCount, multiDrugOrders };
  }, [allPrescriptions]);

  const handleEditPrescription = (rx: PrescriptionDto) => {
    setSelectedItem(rx);
    setIsFormOpen(true);
  };

  const handleDeletePrescription = (rx: PrescriptionDto) => {
    setSelectedItem(rx);
    setIsConfirmOpen(true);
  };

  const columns = usePrescriptionColumns({
    onEdit: handleEditPrescription,
    onDelete: handleDeletePrescription,
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 pb-12">
      {/* Metrics Summary Banner */}
      <PrescriptionMetricsBanner counts={counts} />

      {/* Main Header & Dynamic Filter Toolbar */}
      <PrescriptionFilterToolbar
        filteredCount={allPrescriptions.length}
        onAddPrescription={() => {
          setSelectedItem(null);
          setIsFormOpen(true);
        }}
      />

      {/* Advanced Data Table */}
      <AdvancedDataTable
        columns={columns}
        data={allPrescriptions}
        searchKey="diagnosis"
        searchPlaceholder="Search by clinical diagnosis, drug name, or patient ID..."
        isLoading={isLoading}
      />

      {/* Form & Confirmation Modals */}
      <PrescriptionFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} itemToEdit={selectedItem} />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => selectedItem && deleteMutation.mutate(selectedItem.id)}
        title="Delete Prescription Order"
        message="Are you sure you want to permanently delete this prescription record?"
        confirmText="Delete Order"
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
