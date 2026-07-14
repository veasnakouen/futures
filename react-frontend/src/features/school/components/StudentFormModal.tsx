"use client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PillTabs from "@/components/common/PillTabs";
import { schoolService, StudentDto, CreateStudentCommand, UpdateStudentCommand } from "../../../services/schoolService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "../../../components/common/CustomModalFooter";
import { Modal, ModalBody } from "@/lib/flowbite-compat";
import ImageUploadField from "../../../components/common/ImageUploadField";
import DatePicker from "../../../components/common/DatePicker";
import { format } from "date-fns";
import DynamicCustomFields, { CustomFieldDefinition } from "../../../components/common/DynamicCustomFields";
import AddressFields from "../../../components/common/AddressFields";
import { useClients, useAllUsers } from "../../../hooks/useHR";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { studentSchema, FormValues } from "./student-form-tabs/StudentFormSchema";
import BasicInfoTab from "./student-form-tabs/BasicInfoTab";
import ContactPlacementTab from "./student-form-tabs/ContactPlacementTab";
import ParentsTab from "./student-form-tabs/ParentsTab";
import ActivitiesTab from "./student-form-tabs/ActivitiesTab";
import MedicalTab from "./student-form-tabs/MedicalTab";
import BackgroundTab from "./student-form-tabs/BackgroundTab";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  studentToEdit?: StudentDto | null;
}

export default function StudentFormModal({ isOpen, onClose, studentToEdit }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!studentToEdit;
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string | "basic" | "contact" | "parents" | "extracurriculars" | "medical" | "custom" | "outreach">("basic");

  // Fetch options for relations
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

  const { data: customFields } = useQuery<CustomFieldDefinition[]>({
    queryKey: ["customFields", "STUDENT"],
    queryFn: () => schoolService.getCustomFields("STUDENT").then(res => res.data),
    enabled: isOpen,
  });

  const { data: branchesData } = useQuery({
    queryKey: ["branches"],
    queryFn: () => schoolService.getBranches().then((res) => res.data),
    enabled: isOpen,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(studentSchema),
  });
  const { register, handleSubmit, reset, setValue, watch, control, formState: { errors } } = form;

  const dateOfBirth = watch("dateOfBirth");
  const enrollmentDate = watch("enrollmentDate");
  const currentParentRelationships = watch("parentRelationships") || [];
  const currentExtracurricularIds = watch("extracurricularIds") || [];

  const { data: clientsData, isLoading: clientsLoading } = useClients();
  const { data: usersData, isLoading: usersLoading } = useAllUsers();

  const handleClientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = e.target.value;
    if (!clientId || clientId === "none") {
      setValue("globalClientId", undefined);
      return;
    }
    const client = clientsData?.content?.find((c: any) => c.id.toString() === clientId);
    if (client) {
      setValue("globalClientId", client.id);
      setValue("firstName", client.firstName || "");
      setValue("lastName", client.lastName || "");
      setValue("email", client.email || "");
      if (client.dateOfBirth) setValue("dateOfBirth", client.dateOfBirth.split("T")[0]);
      if (client.gender) setValue("gender", client.gender);
      if (client.contactPhone) setValue("studentPhone", client.contactPhone);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (studentToEdit) {
        reset({
          firstName: studentToEdit.firstName,
          lastName: studentToEdit.lastName,
          email: studentToEdit.email,
          dateOfBirth: studentToEdit.dateOfBirth,
          enrollmentDate: studentToEdit.enrollmentDate,

          middleName: studentToEdit.middleName || "",
          gender: studentToEdit.gender || "",
          nationality: studentToEdit.nationality || "",
          studentPhone: studentToEdit.studentPhone || "",
          currentAddress: studentToEdit.currentAddress || {},
          permanentAddress: studentToEdit.permanentAddress || {},
          studentCode: studentToEdit.studentCode || "",
          branchId: studentToEdit.branchId || "",
          classroomId: studentToEdit.classroomId || "",
          dormitoryId: studentToEdit.dormitoryId || "",

          medicalConditions: studentToEdit.medicalRecord?.conditions || "",
          clinicPatientId: studentToEdit.clinicPatientId || "",
          parentRelationships: studentToEdit.parents?.map(p => ({ parentId: p.id, relationshipType: p.relationshipType || "OTHER" })) || [],
          extracurricularIds: studentToEdit.extracurriculars?.map(e => e.id) || [],
          customAttributes: studentToEdit.customAttributes ? JSON.parse(studentToEdit.customAttributes) : {},
          imageUrl: studentToEdit.imageUrl || "",

          isIdPoor: studentToEdit.isIdPoor || false,
          idPoorNumber: studentToEdit.idPoorNumber || "",
          broughtByOutreachWorker: studentToEdit.broughtByOutreachWorker || false,
          outreachWorkerName: studentToEdit.outreachWorkerName || "",
          outreachOrganization: studentToEdit.outreachOrganization || "",
          globalClientId: studentToEdit.globalClientId || undefined,
        });
      } else {
        reset({
          firstName: "",
          lastName: "",
          email: "",
          dateOfBirth: "",
          enrollmentDate: format(new Date(), "yyyy-MM-dd"),

          middleName: "",
          gender: "",
          nationality: "",
          studentPhone: "",
          currentAddress: {},
          permanentAddress: {},
          studentCode: "",
          branchId: "",
          classroomId: "",
          dormitoryId: "",

          medicalConditions: "",
          clinicPatientId: "",
          parentRelationships: [],
          extracurricularIds: [],
          customAttributes: {},
          imageUrl: "",

          isIdPoor: false,
          idPoorNumber: "",
          broughtByOutreachWorker: false,
          outreachWorkerName: "",
          outreachOrganization: "",
          globalClientId: undefined,
        });
      }
      setActiveTab("basic");
    }
  }, [isOpen, studentToEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      isEdit && studentToEdit
        ? schoolService.updateStudent(studentToEdit.id, data as UpdateStudentCommand)
        : schoolService.createStudent(data as CreateStudentCommand),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success(isEdit ? t("studentUpdatedSuccess") : t("studentCreatedSuccess"));
      onClose();
    },
    onError: () => {
      toast.error(isEdit ? t("studentUpdatedFail") : t("studentCreatedFail"));
    },
  });

  const onSubmit = (data: FormValues) => {
    const payload = {
      ...data,
      customAttributes: data.customAttributes ? JSON.stringify(data.customAttributes) : undefined,
    };
    mutation.mutate(payload as any);
  };

  const handleParentToggle = (id: string) => {
    const isSelected = currentParentRelationships.some(pr => pr.parentId === id);
    if (isSelected) {
      setValue("parentRelationships", currentParentRelationships.filter(pr => pr.parentId !== id));
    } else {
      setValue("parentRelationships", [...currentParentRelationships, { parentId: id, relationshipType: "MOTHER" }]);
    }
  };

  const handleRelationshipTypeChange = (id: string, type: string) => {
    setValue(
      "parentRelationships",
      currentParentRelationships.map(pr => pr.parentId === id ? { ...pr, relationshipType: type } : pr)
    );
  };

  const handleExtracurricularToggle = (id: string) => {
    const updated = currentExtracurricularIds.includes(id)
      ? currentExtracurricularIds.filter(eid => eid !== id)
      : [...currentExtracurricularIds, id];
    setValue("extracurricularIds", updated);
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <CustomModalHeader
        title={isEdit ? t("editStudent") : t("newStudent")}
        onClose={onClose}
        icon={null}
      />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col min-h-[65vh] sm:min-h-[600px] max-h-[80vh]">
        <ModalBody className="p-0 flex flex-col flex-1 overflow-hidden">
          <PillTabs
            className="mx-4 mt-2 mb-2"
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as any)}
            tabs={[
              { id: "basic", label: t("basicInfo") },
              { id: "contact", label: t("contactPlacement") },
              { id: "parents", label: t("parents") },
              { id: "extracurriculars", label: t("activities") },
              { id: "medical", label: t("medical") },
              { id: "outreach", label: "Background" },
              ...(customFields && customFields.length > 0 ? [{ id: "custom", label: t("customFields") }] : [])
            ]}
          />

          <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar flex-1 min-h-0">
            {activeTab === "basic" && (
              <BasicInfoTab
                form={form}
                t={t}
                clientsData={clientsData}
                clientsLoading={clientsLoading}
                handleClientSelect={!isEdit ? handleClientSelect : undefined}
              />
            )}

            {activeTab === "contact" && (
              <ContactPlacementTab
                form={form}
                t={t}
                branchesData={branchesData}
              />
            )}

            {activeTab === "parents" && (
              <ParentsTab
                form={form}
                t={t}
                parentsData={parentsData}
              />
            )}

            {activeTab === "extracurriculars" && (
              <ActivitiesTab
                form={form}
                t={t}
                extracurricularsData={extracurricularsData}
              />
            )}

            {activeTab === "medical" && (
              <MedicalTab
                form={form}
                t={t}
              />
            )}

            {activeTab === "custom" && customFields && customFields.length > 0 && (
              <div className="space-y-4 animate-fade-in">
                <DynamicCustomFields definitions={customFields} prefix="customAttributes." />
              </div>
            )}

            {activeTab === "outreach" && (
              <BackgroundTab
                form={form}
                t={t}
                usersData={usersData}
                usersLoading={usersLoading}
              />
            )}
          </div>
        </ModalBody>

        <CustomModalFooter
          onClose={onClose}
          submitText={isEdit ? t("saveChanges") : t("createStudent")}
          submitDisabled={mutation.isPending}
        />
      </form>
    </Modal>
  );
}
