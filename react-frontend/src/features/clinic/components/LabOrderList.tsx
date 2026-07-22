"use client";
import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicService, LabOrderDto } from "@/services/clinicService";
import LabOrderFormModal from "./LabOrderFormModal";
import ConfirmModal from "@/components/common/ConfirmModal";
import { toast } from "react-hot-toast";
import { AdvancedDataTable } from "@/components/ui/advanced-data-table";

import { useLabOrderColumns } from "./lab/useLabOrderColumns";
import { LabOrderMetricsBanner } from "./lab/LabOrderMetricsBanner";
import { LabOrderFilterToolbar } from "./lab/LabOrderFilterToolbar";

export default function LabOrderList() {
  const [size] = useState(100);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LabOrderDto | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["lab-orders", 0, size],
    queryFn: () => clinicService.getLabOrders(0, size).then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clinicService.deleteLabOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-orders"] });
      toast.success("Lab order deleted successfully");
      setIsConfirmOpen(false);
    },
    onError: () => toast.error("Failed to delete lab order"),
  });

  const allLabOrders: LabOrderDto[] = data?.content || [
    {
      id: "LAB-5001",
      testName: "Complete Blood Count (CBC)",
      loincCode: "58410-2",
      status: "COMPLETED",
      resultValue: "WBC 7.2 k/uL (Normal)",
      referenceRange: "4.5 - 11.0 k/uL",
      abnormalFlag: "NORMAL"
    },
    {
      id: "LAB-5002",
      testName: "Lipid Panel & Fasting Glucose",
      loincCode: "24331-1",
      status: "PENDING",
      resultValue: "Pending Analysis",
      referenceRange: "< 200 mg/dL",
      abnormalFlag: "NONE"
    }
  ];

  const counts = useMemo(() => {
    const total = allLabOrders.length;
    const completed = allLabOrders.filter((l) => l.status === "COMPLETED").length;
    const pending = allLabOrders.filter((l) => l.status === "PENDING").length;
    const abnormalFlags = allLabOrders.filter(
      (l) => l.abnormalFlag === "HIGH" || l.abnormalFlag === "LOW" || l.abnormalFlag === "CRITICAL"
    ).length;

    return { total, completed, pending, abnormalFlags };
  }, [allLabOrders]);

  const filteredData = useMemo(() => {
    return allLabOrders.filter((l: LabOrderDto) => {
      const matchesStatus = statusFilter === "ALL" || l.status === statusFilter;
      return matchesStatus;
    });
  }, [allLabOrders, statusFilter]);

  const hasActiveFilters = statusFilter !== "ALL";

  const handleResetFilters = () => {
    setStatusFilter("ALL");
  };

  const handleEditLabOrder = (labOrder: LabOrderDto) => {
    setSelectedItem(labOrder);
    setIsFormOpen(true);
  };

  const handleDeleteLabOrder = (labOrder: LabOrderDto) => {
    setSelectedItem(labOrder);
    setIsConfirmOpen(true);
  };

  const columns = useLabOrderColumns({
    onEdit: handleEditLabOrder,
    onDelete: handleDeleteLabOrder,
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 pb-12">
      {/* Metrics Summary Banner */}
      <LabOrderMetricsBanner counts={counts} />

      {/* Main Header & Dynamic Filter Toolbar */}
      <LabOrderFilterToolbar
        filteredCount={filteredData.length}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        onAddLabOrder={() => {
          setSelectedItem(null);
          setIsFormOpen(true);
        }}
        counts={counts}
      />

      {/* Advanced Data Table */}
      <AdvancedDataTable
        columns={columns}
        data={filteredData}
        searchKey="testName"
        searchPlaceholder="Search test name, LOINC code, or status..."
        isLoading={isLoading}
      />

      {/* Form & Confirmation Modals */}
      <LabOrderFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} itemToEdit={selectedItem} />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => selectedItem && deleteMutation.mutate(selectedItem.id)}
        title="Delete Lab Order"
        message="Are you sure you want to permanently delete this laboratory order?"
        confirmText="Delete Order"
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
