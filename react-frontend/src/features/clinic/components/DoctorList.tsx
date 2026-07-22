"use client";
import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicService, DoctorDto } from "@/services/clinicService";
import DoctorFormModal from "./DoctorFormModal";
import DoctorDetailModal from "./DoctorDetailModal";
import ConfirmModal from "@/components/common/ConfirmModal";
import { toast } from "react-hot-toast";
import { AdvancedDataTable } from "@/components/ui/advanced-data-table";

import { useDoctorColumns } from "./doctor/useDoctorColumns";
import { DoctorMetricsBanner } from "./doctor/DoctorMetricsBanner";
import { DoctorFilterToolbar } from "./doctor/DoctorFilterToolbar";

export default function DoctorList() {
  const [size] = useState(100);
  const [specialtyFilter, setSpecialtyFilter] = useState("ALL");
  const [shiftFilter, setShiftFilter] = useState("ALL");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DoctorDto | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["doctors", 0, size],
    queryFn: () => clinicService.getDoctors(0, size).then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clinicService.deleteDoctor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      toast.success("Doctor record deleted successfully");
      setIsConfirmOpen(false);
    },
    onError: () => toast.error("Failed to delete doctor record"),
  });

  const allDoctors: DoctorDto[] = data?.content || [];

  // Metrics summary counts
  const counts = useMemo(() => {
    const total = allDoctors.length;
    const generalPractice = allDoctors.filter(
      (d) => !d.specialization || d.specialization.toLowerCase().includes("general")
    ).length;
    const specialists = total - generalPractice;
    const fullDayShifts = allDoctors.filter(
      (d) => !d.shift || d.shift.toLowerCase().includes("full")
    ).length;

    return { total, generalPractice, specialists, fullDayShifts };
  }, [allDoctors]);

  // Apply multi-attribute filtering
  const filteredData = useMemo(() => {
    return allDoctors.filter((d: DoctorDto) => {
      const spec = d.specialization || "General Practice";
      const matchesSpecialty =
        specialtyFilter === "ALL" || spec.toLowerCase().includes(specialtyFilter.toLowerCase());

      const shift = d.shift || "Full Day";
      const matchesShift =
        shiftFilter === "ALL" || shift.toLowerCase().includes(shiftFilter.toLowerCase());

      return matchesSpecialty && matchesShift;
    });
  }, [allDoctors, specialtyFilter, shiftFilter]);

  const hasActiveFilters = specialtyFilter !== "ALL" || shiftFilter !== "ALL";

  const handleResetFilters = () => {
    setSpecialtyFilter("ALL");
    setShiftFilter("ALL");
  };

  const handleViewDoctor = (doctor: DoctorDto) => {
    setSelectedItem(doctor);
    setIsDetailOpen(true);
  };

  const handleEditDoctor = (doctor: DoctorDto) => {
    setSelectedItem(doctor);
    setIsFormOpen(true);
  };

  const handleDeleteDoctor = (doctor: DoctorDto) => {
    setSelectedItem(doctor);
    setIsConfirmOpen(true);
  };

  const columns = useDoctorColumns({
    onView: handleViewDoctor,
    onEdit: handleEditDoctor,
    onDelete: handleDeleteDoctor,
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 pb-12">
      {/* Metrics Summary Banner */}
      <DoctorMetricsBanner counts={counts} />

      {/* Main Header & Dynamic Filter Toolbar */}
      <DoctorFilterToolbar
        filteredCount={filteredData.length}
        specialtyFilter={specialtyFilter}
        setSpecialtyFilter={setSpecialtyFilter}
        shiftFilter={shiftFilter}
        setShiftFilter={setShiftFilter}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        onAddDoctor={() => {
          setSelectedItem(null);
          setIsFormOpen(true);
        }}
        counts={counts}
      />

      {/* Advanced Data Table */}
      <AdvancedDataTable
        columns={columns}
        data={filteredData}
        searchKey="firstName"
        searchPlaceholder="Search by doctor name, specialization, contact, or ID..."
        isLoading={isLoading}
        onRowClick={(row) => handleViewDoctor(row)}
      />

      {/* View Doctor Profile Modal */}
      <DoctorDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        doctor={selectedItem}
        onEdit={handleEditDoctor}
      />

      {/* Form & Confirmation Modals */}
      <DoctorFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} itemToEdit={selectedItem} />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => selectedItem && deleteMutation.mutate(selectedItem.id)}
        title="Delete Doctor Record"
        message="Are you sure you want to permanently delete this provider record?"
        confirmText="Delete Record"
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
