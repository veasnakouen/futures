"use client";
import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicService, AppointmentDto } from "@/services/clinicService";
import AppointmentFormModal from "./AppointmentFormModal";
import ConfirmModal from "@/components/common/ConfirmModal";
import { toast } from "react-hot-toast";
import { AdvancedDataTable } from "@/components/ui/advanced-data-table";

import { useAppointmentColumns } from "./appointment/useAppointmentColumns";
import { AppointmentMetricsBanner } from "./appointment/AppointmentMetricsBanner";
import { AppointmentFilterToolbar } from "./appointment/AppointmentFilterToolbar";

export default function AppointmentList() {
  const [size] = useState(100);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AppointmentDto | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["appointments", 0, size],
    queryFn: () => clinicService.getAppointments(0, size).then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clinicService.deleteAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment record deleted successfully");
      setIsConfirmOpen(false);
    },
    onError: () => toast.error("Failed to delete appointment record"),
  });

  const allAppointments: AppointmentDto[] = data?.content || [
    {
      id: "APPT-1001",
      patientId: "MRN-b3f099f0",
      doctorId: "DOC-101",
      appointmentDate: "2026-07-24",
      appointmentTime: "10:00 AM",
      status: "CONFIRMED",
      notes: "Routine Family Health Consultation"
    },
    {
      id: "APPT-1002",
      patientId: "MRN-a1e088c2",
      doctorId: "DOC-102",
      appointmentDate: "2026-07-25",
      appointmentTime: "02:30 PM",
      status: "PENDING",
      notes: "Cardiovascular Checkup & ECG"
    }
  ];

  const counts = useMemo(() => {
    const total = allAppointments.length;
    const confirmed = allAppointments.filter(
      (a) => a.status === "CONFIRMED" || a.status === "COMPLETED"
    ).length;
    const pending = allAppointments.filter((a) => a.status === "PENDING").length;
    const cancelled = allAppointments.filter((a) => a.status === "CANCELLED").length;

    return { total, confirmed, pending, cancelled };
  }, [allAppointments]);

  const filteredData = useMemo(() => {
    return allAppointments.filter((a: AppointmentDto) => {
      const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;
      return matchesStatus;
    });
  }, [allAppointments, statusFilter]);

  const hasActiveFilters = statusFilter !== "ALL";

  const handleResetFilters = () => {
    setStatusFilter("ALL");
  };

  const handleEditAppointment = (appointment: AppointmentDto) => {
    setSelectedItem(appointment);
    setIsFormOpen(true);
  };

  const handleDeleteAppointment = (appointment: AppointmentDto) => {
    setSelectedItem(appointment);
    setIsConfirmOpen(true);
  };

  const columns = useAppointmentColumns({
    onEdit: handleEditAppointment,
    onDelete: handleDeleteAppointment,
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 pb-12">
      {/* Metrics Summary Banner */}
      <AppointmentMetricsBanner counts={counts} />

      {/* Main Header & Dynamic Filter Toolbar */}
      <AppointmentFilterToolbar
        filteredCount={filteredData.length}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        onAddAppointment={() => {
          setSelectedItem(null);
          setIsFormOpen(true);
        }}
        counts={counts}
      />

      {/* Advanced Data Table */}
      <AdvancedDataTable
        columns={columns}
        data={filteredData}
        searchKey="notes"
        searchPlaceholder="Search notes, patient ID, or doctor ID..."
        isLoading={isLoading}
      />

      {/* Form & Confirmation Modals */}
      <AppointmentFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} itemToEdit={selectedItem} />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => selectedItem && deleteMutation.mutate(selectedItem.id)}
        title="Delete Appointment Record"
        message="Are you sure you want to permanently delete this appointment schedule?"
        confirmText="Delete Schedule"
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
