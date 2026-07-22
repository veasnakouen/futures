"use client";
import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicService, PatientDto } from "@/services/clinicService";
import PatientFormModal from "./PatientFormModal";
import ConfirmModal from "@/components/common/ConfirmModal";
import { toast } from "react-hot-toast";
import { useNavigate } from "@/lib/react-router-compat";
import { AdvancedDataTable } from "@/components/ui/advanced-data-table";

import { usePatientColumns } from "./patient/usePatientColumns";
import { PatientMetricsBanner } from "./patient/PatientMetricsBanner";
import { PatientFilterToolbar } from "./patient/PatientFilterToolbar";

export default function PatientList() {
  const navigate = useNavigate();
  const [size] = useState(100);
  const [genderFilter, setGenderFilter] = useState("ALL");
  const [poorIdFilter, setPoorIdFilter] = useState("ALL");
  const [bloodTypeFilter, setBloodTypeFilter] = useState("ALL");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PatientDto | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["patients", 0, size],
    queryFn: () => clinicService.getPatients(0, size).then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clinicService.deletePatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Patient record deleted successfully");
      setIsConfirmOpen(false);
    },
    onError: () => toast.error("Failed to delete patient record"),
  });

  const allPatients: PatientDto[] = data?.content || [];

  // Calculate dynamic counts from full dataset
  const counts = useMemo(() => {
    const male = allPatients.filter((p) => p.gender?.toUpperCase() === "MALE").length;
    const female = allPatients.filter((p) => p.gender?.toUpperCase() === "FEMALE").length;
    const other = allPatients.filter(
      (p) => p.gender && p.gender.toUpperCase() !== "MALE" && p.gender.toUpperCase() !== "FEMALE"
    ).length;
    const poorIdCount = allPatients.filter((p) => Boolean(p.poorId)).length;
    const regularCount = allPatients.length - poorIdCount;

    const bloodTypes: Record<string, number> = {};
    allPatients.forEach((p) => {
      if (p.bloodType) {
        const bt = p.bloodType.toUpperCase().trim();
        bloodTypes[bt] = (bloodTypes[bt] || 0) + 1;
      }
    });

    return {
      total: allPatients.length,
      male,
      female,
      other,
      poorIdCount,
      regularCount,
      bloodTypes,
    };
  }, [allPatients]);

  // Apply dynamic multi-attribute filtering
  const filteredData = useMemo(() => {
    return allPatients.filter((p: PatientDto) => {
      const pGender = (p.gender || "").toUpperCase();
      const matchesGender =
        genderFilter === "ALL" ||
        (genderFilter === "MALE" && pGender === "MALE") ||
        (genderFilter === "FEMALE" && pGender === "FEMALE") ||
        (genderFilter === "OTHER" && pGender !== "MALE" && pGender !== "FEMALE");

      const matchesPoorId =
        poorIdFilter === "ALL" ||
        (poorIdFilter === "POOR_ID_ONLY" && Boolean(p.poorId)) ||
        (poorIdFilter === "REGULAR_ONLY" && !p.poorId);

      const matchesBloodType =
        bloodTypeFilter === "ALL" ||
        (p.bloodType && p.bloodType.toUpperCase() === bloodTypeFilter.toUpperCase());

      return matchesGender && matchesPoorId && matchesBloodType;
    });
  }, [allPatients, genderFilter, poorIdFilter, bloodTypeFilter]);

  const hasActiveFilters =
    genderFilter !== "ALL" || poorIdFilter !== "ALL" || bloodTypeFilter !== "ALL";

  const handleResetFilters = () => {
    setGenderFilter("ALL");
    setPoorIdFilter("ALL");
    setBloodTypeFilter("ALL");
  };

  const handleEditPatient = (patient: PatientDto) => {
    setSelectedItem(patient);
    setIsFormOpen(true);
  };

  const handleDeletePatient = (patient: PatientDto) => {
    setSelectedItem(patient);
    setIsConfirmOpen(true);
  };

  const columns = usePatientColumns({
    onEdit: handleEditPatient,
    onDelete: handleDeletePatient,
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 pb-12">
      {/* Metrics Summary Banner */}
      <PatientMetricsBanner counts={counts} />

      {/* Main Header & Dynamic Filter Toolbar */}
      <PatientFilterToolbar
        filteredCount={filteredData.length}
        genderFilter={genderFilter}
        setGenderFilter={setGenderFilter}
        poorIdFilter={poorIdFilter}
        setPoorIdFilter={setPoorIdFilter}
        bloodTypeFilter={bloodTypeFilter}
        setBloodTypeFilter={setBloodTypeFilter}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        onAddPatient={() => {
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
        searchPlaceholder="Search by patient name, MRN, or phone..."
        isLoading={isLoading}
        onRowClick={(item) => navigate(`/clinic/patients/${item.id}`)}
      />

      {/* Form & Confirmation Modals */}
      <PatientFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} itemToEdit={selectedItem} />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => selectedItem && deleteMutation.mutate(selectedItem.id)}
        title="Delete Patient Record"
        message="Are you sure you want to permanently delete this clinical patient record?"
        confirmText="Delete Record"
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
