"use client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PillTabs from "@/components/common/PillTabs";
import { schoolService, StudentDto, CreateStudentCommand, UpdateStudentCommand } from "../../../services/schoolService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "../../../components/common/CustomModalFooter";
import { Modal, ModalBody } from "@/lib/flowbite-compat";

import { studentSchema, FormValues } from "./student-form-tabs/StudentFormSchema";
import BasicInfoTab from "./student-form-tabs/BasicInfoTab";
import ContactPlacementTab from "./student-form-tabs/ContactPlacementTab";
import ParentsTab from "./student-form-tabs/ParentsTab";
import ActivitiesTab from "./student-form-tabs/ActivitiesTab";
import MedicalTab from "./student-form-tabs/MedicalTab";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  studentToEdit?: StudentDto | null;
}

export default function StudentFormModal({ isOpen, onClose, studentToEdit }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!studentToEdit;
  const { t } = useTranslation();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { data: parentsData } = useQuery({
    queryKey: ["parents"],
    queryFn: () => schoolService.getParents(0, 100).then((res) => res.data),
    enabled: isOpen,
  });

  const { data: extracurricularsData } = useQuery({
    queryKey: ["extracurriculars"],
    queryFn: () => schoolService.getExtracurriculars(0, 100).then((res) => res.data),
    enabled: isOpen,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(studentSchema),
  });
  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (isOpen) {
      if (studentToEdit) reset(studentToEdit as any);
      else reset({ gender: "OTHER" });
      setCurrentStepIndex(0);
    }
  }, [isOpen, studentToEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      return isEdit
        ? schoolService.updateStudent(studentToEdit!.id, data as UpdateStudentCommand)
        : schoolService.createStudent(data as CreateStudentCommand);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success(isEdit ? "Student updated" : "Student created");
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Operation failed");
    },
  });

  const onSubmit = (data: FormValues) => mutation.mutate(data);

  if (!isOpen) return null;

  const tabs = [
    { id: "basic", label: t("basicInfo") },
    { id: "contact", label: t("contactPlacement") },
    { id: "parents", label: t("parentsGuardians") },
    { id: "activities", label: t("activities") },
    { id: "medical", label: t("medicalHealth") },
  ];

  return (
    <Modal show={isOpen} onClose={onClose} size="xl" dismissible={false}>
      <CustomModalHeader
        title={isEdit ? t("editStudent") : t("registerStudent")}
        subtitle="School Management System"
        onClose={onClose}
      />
      <ModalBody className="p-0 bg-white dark:bg-gray-800">
        <div className="p-6 space-y-6">
          <PillTabs
            tabs={tabs}
            activeTab={tabs[currentStepIndex].id}
            onTabChange={(id) => setCurrentStepIndex(tabs.findIndex((t) => t.id === id))}
          />

          <form id="student-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {currentStepIndex === 0 && <BasicInfoTab form={form} t={t} />}
            {currentStepIndex === 1 && <ContactPlacementTab form={form} t={t} />}
            {currentStepIndex === 2 && <ParentsTab form={form} t={t} parentsData={parentsData} />}
            {currentStepIndex === 3 && <ActivitiesTab form={form} t={t} extracurricularsData={extracurricularsData} />}
            {currentStepIndex === 4 && <MedicalTab form={form} t={t} />}
          </form>
        </div>
      </ModalBody>
      <CustomModalFooter
        onClose={onClose}
        isEditMode={isEdit}
        submitText={isEdit ? t("save") : t("create")}
        formId="student-form"
        submitDisabled={mutation.isPending}
      />
    </Modal>
  );
}
