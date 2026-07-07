"use client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { schoolService, StudentDto, CreateStudentCommand, UpdateStudentCommand } from "../../../services/schoolService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "../../../components/common/CustomModalFooter";
import {Modal, ModalBody} from "@/lib/flowbite-compat";
import ImageUploadField from "../../../components/common/ImageUploadField";
import DatePicker from "../../../components/common/DatePicker";
import { format } from "date-fns";
import DynamicCustomFields, { CustomFieldDefinition } from "../../../components/common/DynamicCustomFields";
import AddressFields from "../../../components/common/AddressFields";
import { useClients, useAllUsers } from "../../../hooks/useHR";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  enrollmentDate: z.string().min(1, "Enrollment date is required"),

  middleName: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  studentPhone: z.string().optional(),
  currentAddress: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
    district: z.string().optional(),
    commune: z.string().optional(),
    village: z.string().optional(),
  }).optional(),
  permanentAddress: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
    district: z.string().optional(),
    commune: z.string().optional(),
    village: z.string().optional(),
  }).optional(),
  studentCode: z.string().optional(),
  branchId: z.string().optional(),
  classroomId: z.string().optional(),
  dormitoryId: z.string().optional(),

  medicalConditions: z.string().optional(),
  clinicPatientId: z.string().optional(),
  parentRelationships: z.array(z.object({ parentId: z.string(), relationshipType: z.string() })).optional(),
  extracurricularIds: z.array(z.string()).optional(),
  customAttributes: z.record(z.string(), z.any()).optional(),
  imageUrl: z.string().optional(),
  
  isIdPoor: z.boolean().optional(),
  idPoorNumber: z.string().optional(),
  broughtByOutreachWorker: z.boolean().optional(),
  outreachWorkerName: z.string().optional(),
  outreachOrganization: z.string().optional(),
  globalClientId: z.number().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  studentToEdit?: StudentDto | null;
}

export default function StudentFormModal({ isOpen, onClose, studentToEdit }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!studentToEdit;
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"basic" | "contact" | "parents" | "extracurriculars" | "medical" | "custom" | "outreach">("basic");

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

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const dateOfBirth = watch("dateOfBirth");
  const enrollmentDate = watch("enrollmentDate");
  const currentParentRelationships = watch("parentRelationships") || [];
  const currentExtracurricularIds = watch("extracurricularIds") || [];

  const { data: clientsData, isLoading: clientsLoading } = useClients();
  const { data: usersData, isLoading: usersLoading } = useAllUsers();

  const handleClientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = e.target.value;
    if (!clientId) {
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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
        <ModalBody className="p-0 flex flex-col flex-1 overflow-hidden">
          <div className="flex overflow-x-auto whitespace-nowrap border-b custom-scrollbar shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("basic")}
              className={`flex-1 min-w-[120px] py-3 text-sm font-medium text-center transition-colors duration-200 ${activeTab ==="basic"?"text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500":"text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`}
            >
              {t("basicInfo")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("contact")}
              className={`flex-1 min-w-[150px] py-3 text-sm font-medium text-center transition-colors duration-200 ${activeTab ==="contact"?"text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500":"text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`}
            >
              {t("contactPlacement")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("parents")}
              className={`flex-1 min-w-[100px] py-3 text-sm font-medium text-center transition-colors duration-200 ${activeTab ==="parents"?"text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500":"text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`}
            >
              {t("parents")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("extracurriculars")}
              className={`flex-1 min-w-[100px] py-3 text-sm font-medium text-center transition-colors duration-200 ${activeTab ==="extracurriculars"?"text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500":"text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`}
            >
              {t("activities")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("medical")}
              className={`flex-1 min-w-[100px] py-3 text-sm font-medium text-center transition-colors duration-200 ${activeTab ==="medical"?"text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500":"text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`}
            >
              {t("medical")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("outreach")}
              className={`flex-1 min-w-[100px] py-3 text-sm font-medium text-center transition-colors duration-200 ${activeTab ==="outreach"?"text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500":"text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`}
            >
              Background
            </button>
            {customFields && customFields.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab("custom")}
                className={`flex-1 min-w-[120px] py-3 text-sm font-medium text-center transition-colors duration-200 ${activeTab ==="custom"?"text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500":"text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`}
              >
                {t("customFields")}
              </button>
            )}
          </div>

          <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar h-[500px]">
            {activeTab === "basic" && (
              <div className="animate-fade-in space-y-4">
                
                {!isEdit && (
                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                    <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                      Link to Existing Global Client (Optional)
                    </label>
                    <select
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      onChange={handleClientSelect}
                      disabled={clientsLoading}
                    >
                      <option value="">-- Select a Client to auto-fill details --</option>
                      {clientsData?.content?.map((client: any) => (
                        <option key={client.id} value={client.id}>
                          {client.firstName} {client.lastName} ({client.contactPhone || 'No Phone'})
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                      Selecting a client will automatically fill their personal information and keep their records synced.
                    </p>
                  </div>
                )}

                <div className="flex justify-center mb-6">
                  <ImageUploadField
                    label=""
                    isAvatar={true}
                    value={watch("imageUrl")}
                    onChange={(url) => setValue("imageUrl", url)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t("firstName")}
                    </label>
                    <input
                      {...register("firstName")}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="John"
                    />
                    {errors.firstName && <span className="text-red-500 text-xs mt-1">{errors.firstName.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t("middleName")}
                    </label>
                    <input
                      {...register("middleName")}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="Robert"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t("lastName")}
                    </label>
                    <input
                      {...register("lastName")}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="Doe"
                    />
                    {errors.lastName && <span className="text-red-500 text-xs mt-1">{errors.lastName.message}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t("emailAddress")}
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="john.doe@example.com"
                    />
                    {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t("studentCode")}
                    </label>
                    <input
                      {...register("studentCode")}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="STU-12345"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t("gender")}
                    </label>
                    <select
                      {...register("gender")}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">{t("selectGender")}</option>
                      <option value="MALE">{t("male")}</option>
                      <option value="FEMALE">{t("female")}</option>
                      <option value="OTHER">{t("other")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t("nationality")}
                    </label>
                    <input
                      {...register("nationality")}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="Cambodian"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t("dateOfBirth")}
                    </label>
                    <DatePicker
                      value={dateOfBirth ? new Date(dateOfBirth) : null}
                      onChange={(date) => setValue("dateOfBirth", format(date, "yyyy-MM-dd"))}
                      placeholder="Select Date"
                    />
                    {errors.dateOfBirth && <span className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t("enrollmentDate")}
                    </label>
                    <DatePicker
                      value={enrollmentDate ? new Date(enrollmentDate) : null}
                      onChange={(date) => setValue("enrollmentDate", format(date, "yyyy-MM-dd"))}
                      placeholder="Select Date"
                    />
                    {errors.enrollmentDate && <span className="text-red-500 text-xs mt-1">{errors.enrollmentDate.message}</span>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("studentPhone")}
                  </label>
                  <input
                    {...register("studentPhone")}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="+855 12 345 678"
                  />
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{t("currentAddress")}</h4>
                  <AddressFields<FormValues> register={register} errors={errors} prefix="currentAddress" watch={watch} setValue={setValue} />
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{t("permanentAddress")}</h4>
                  <AddressFields<FormValues> register={register} errors={errors} prefix="permanentAddress" watch={watch} setValue={setValue} />
                </div>

                <h3 className="text-sm font-semibold text-gray-900 dark:text-white pt-2 border-t">{t("placement")}</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t("branch")}
                    </label>
                    <select
                      {...register("branchId")}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">{t("selectBranch")}</option>
                      {(branchesData?.content || (Array.isArray(branchesData) ? branchesData : [])).map((branch: any) => (
                        <option key={branch.id} value={branch.id}>{branch.branchName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t("classroomId")}
                    </label>
                    <input
                      {...register("classroomId")}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t("dormitoryId")}
                    </label>
                    <input
                      {...register("dormitoryId")}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "parents" && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("selectParentsGuardians")}
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {t("chooseParentsDesc")}
                  </p>
                </div>
                {(!parentsData || (parentsData.content ? parentsData.content.length === 0 : parentsData.length === 0)) && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
                    <p className="text-sm text-gray-500 italic">No parents found in the database.</p>
                  </div>
                )}
                <div className="grid grid-cols-1 gap-3">
                  {(parentsData?.content || (Array.isArray(parentsData) ? parentsData : [])).map((parent: any) => {
                    const isSelected = currentParentRelationships.some((pr: any) => pr.parentId === parent.id);
                    return (
                      <div
                        key={parent.id}
                        className={`flex flex-col p-4 rounded-xl transition-all duration-200 cursor-pointer ${isSelected ?"bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700":"bg-white hover:border-blue-300 hover:shadow-sm dark:bg-gray-800  dark:hover:"}`}
                        onClick={(e) => {
                          // Prevent toggling when clicking the select dropdown
                          if ((e.target as HTMLElement).tagName !== 'SELECT') {
                            handleParentToggle(parent.id);
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`flex items-center justify-center w-5 h-5 rounded-md mr-3 ${isSelected ?'bg-blue-600 border-blue-600':'bg-white dark:bg-gray-700 '}`}>
                              {isSelected && (
                                <svg className="w-3.5 h-3.5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {parent.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {parent.contactNumber}
                              </p>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="w-1/3" onClick={e => e.stopPropagation()}>
                              <select
                                className="w-full px-2 py-1.5 text-sm font-medium border-blue-200 dark:border-blue-800 rounded bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400 focus:ring-2 focus:ring-blue-500 shadow-sm"
                                value={currentParentRelationships.find((pr: any) => pr.parentId === parent.id)?.relationshipType || "MOTHER"}
                                onChange={(e) => handleRelationshipTypeChange(parent.id, e.target.value)}
                              >
                                <option value="MOTHER">{t("mother")}</option>
                                <option value="FATHER">{t("father")}</option>
                                <option value="UNCLE">{t("uncle")}</option>
                                <option value="AUNT">{t("aunt")}</option>
                                <option value="BROTHER">{t("brother")}</option>
                                <option value="SISTER">{t("sister")}</option>
                                <option value="GRANDPARENT">{t("grandparent")}</option>
                                <option value="GUARDIAN">{t("guardian")}</option>
                                <option value="OTHER">{t("other")}</option>
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "extracurriculars" && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("selectExtracurricularActivities")}
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {t("enrollActivitiesDesc")}
                  </p>
                </div>
                {(!extracurricularsData || (extracurricularsData.content ? extracurricularsData.content.length === 0 : extracurricularsData.length === 0)) && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
                    <p className="text-sm text-gray-500 italic">No activities found in the database.</p>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(extracurricularsData?.content || (Array.isArray(extracurricularsData) ? extracurricularsData : [])).map((activity: any) => {
                    const isSelected = currentExtracurricularIds.includes(activity.id);
                    return (
                      <div
                        key={activity.id}
                        className={`flex items-center p-4 rounded-xl transition-all duration-200 cursor-pointer ${isSelected ?"bg-indigo-50 border-indigo-300 dark:bg-indigo-900/20 dark:border-indigo-700 shadow-sm":"bg-white hover:border-indigo-200 hover:shadow-sm dark:bg-gray-800  dark:hover:"}`}
                        onClick={() => handleExtracurricularToggle(activity.id)}
                      >
                        <div className={`flex items-center justify-center w-5 h-5 rounded-md mr-3 ${isSelected ?'bg-indigo-600 border-indigo-600':'bg-white dark:bg-gray-700 '}`}>
                          {isSelected && (
                            <svg className="w-3.5 h-3.5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-semibold ${isSelected ?'text-indigo-900 dark:text-indigo-300':'text-gray-900 dark:text-white'}`}>
                            {activity.name}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "medical" && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("clinicPatientId")}
                  </label>
                  <input
                    {...register("clinicPatientId")}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Link to mtp-clinic-service (Optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("emergencyMedicalNotes")}
                  </label>
                  <textarea
                    {...register("medicalConditions")}
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="List any known allergies, medications, or specific medical conditions here..."
                  />
                </div>
              </div>
            )}

            {activeTab === "custom" && customFields && customFields.length > 0 && (
              <div className="space-y-4 animate-fade-in">
                <DynamicCustomFields definitions={customFields} prefix="customAttributes." />
              </div>
            )}

            {activeTab === "outreach" && (
              <div className="space-y-6 animate-fade-in">
                {/* ID Poor Section */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isIdPoor"
                      {...register("isIdPoor")}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="isIdPoor" className="text-sm font-bold text-gray-900 dark:text-white">
                      Has ID Poor Card
                    </label>
                  </div>
                  
                  {watch("isIdPoor") && (
                    <div className="ml-8 animate-fade-in">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ID Poor Number
                      </label>
                      <input
                        {...register("idPoorNumber")}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 border border-gray-200 dark:border-gray-600"
                        placeholder="Enter ID Poor Number..."
                      />
                    </div>
                  )}
                </div>

                {/* Outreach Worker Section */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="broughtByOutreachWorker"
                      {...register("broughtByOutreachWorker")}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="broughtByOutreachWorker" className="text-sm font-bold text-gray-900 dark:text-white">
                      Brought by Outreach Worker
                    </label>
                  </div>
                  
                  {watch("broughtByOutreachWorker") && (
                    <div className="ml-8 space-y-4 animate-fade-in">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Outreach Worker Name
                        </label>
                        {usersLoading ? (
                          <div className="text-sm text-gray-500">Loading users...</div>
                        ) : (
                          <select
                            {...register("outreachWorkerName")}
                            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 border border-gray-200 dark:border-gray-600"
                          >
                            <option value="">Select an outreach worker...</option>
                            {usersData?.map((u: any) => (
                              <option key={u.id} value={`${u.firstName} ${u.lastName}`}>
                                {u.firstName} {u.lastName} {u.userName ? `(${u.userName})` : ''}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Outreach Organization
                        </label>
                        <input
                          {...register("outreachOrganization")}
                          className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 border border-gray-200 dark:border-gray-600"
                          placeholder="Organization name..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
