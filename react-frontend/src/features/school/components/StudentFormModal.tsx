"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { schoolService, StudentDto, CreateStudentCommand, UpdateStudentCommand } from "../../../services/schoolService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "../../../components/common/CustomModalFooter";
import { Modal, ModalBody } from "@/lib/flowbite-compat";
import DatePicker from "../../../components/common/DatePicker";
import { format } from "date-fns";
import DynamicCustomFields, { CustomFieldDefinition } from "../../../components/common/DynamicCustomFields";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  enrollmentDate: z.string().min(1, "Enrollment date is required"),
  medicalConditions: z.string().optional(),
  parentRelationships: z.array(z.object({ parentId: z.number(), relationshipType: z.string() })).optional(),
  extracurricularIds: z.array(z.number()).optional(),
  customAttributes: z.record(z.string(), z.any()).optional(),
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
  const [activeTab, setActiveTab] = useState<"basic" | "parents" | "extracurriculars" | "medical" | "custom">("basic");

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

  useEffect(() => {
    if (isOpen) {
      if (studentToEdit) {
        reset({
          firstName: studentToEdit.firstName,
          lastName: studentToEdit.lastName,
          email: studentToEdit.email,
          dateOfBirth: studentToEdit.dateOfBirth,
          enrollmentDate: studentToEdit.enrollmentDate,
          medicalConditions: studentToEdit.medicalRecord?.conditions || "",
          parentRelationships: studentToEdit.parents?.map(p => ({ parentId: p.id, relationshipType: p.relationshipType || "OTHER" })) || [],
          extracurricularIds: studentToEdit.extracurriculars?.map(e => e.id) || [],
          customAttributes: studentToEdit.customAttributes ? JSON.parse(studentToEdit.customAttributes) : {},
        });
      } else {
        reset({
          firstName: "",
          lastName: "",
          email: "",
          dateOfBirth: "",
          enrollmentDate: format(new Date(), "yyyy-MM-dd"),
          medicalConditions: "",
          parentRelationships: [],
          extracurricularIds: [],
          customAttributes: {},
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
      toast.success(`Student ${isEdit ? "updated" : "created"} successfully`);
      onClose();
    },
    onError: () => {
      toast.error(`Failed to ${isEdit ? "update" : "create"} student`);
    },
  });

  const onSubmit = (data: FormValues) => {
    const payload = {
      ...data,
      customAttributes: data.customAttributes ? JSON.stringify(data.customAttributes) : undefined,
    };
    mutation.mutate(payload as any);
  };

  const handleParentToggle = (id: number) => {
    const isSelected = currentParentRelationships.some(pr => pr.parentId === id);
    if (isSelected) {
      setValue("parentRelationships", currentParentRelationships.filter(pr => pr.parentId !== id));
    } else {
      setValue("parentRelationships", [...currentParentRelationships, { parentId: id, relationshipType: "MOTHER" }]);
    }
  };

  const handleRelationshipTypeChange = (id: number, type: string) => {
    setValue(
      "parentRelationships",
      currentParentRelationships.map(pr => pr.parentId === id ? { ...pr, relationshipType: type } : pr)
    );
  };

  const handleExtracurricularToggle = (id: number) => {
    const updated = currentExtracurricularIds.includes(id)
      ? currentExtracurricularIds.filter(eid => eid !== id)
      : [...currentExtracurricularIds, id];
    setValue("extracurricularIds", updated);
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <CustomModalHeader
        title={isEdit ? "Edit Student" : "New Student"}
        onClose={onClose}
        icon={null}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="p-0">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setActiveTab("basic")}
              className={`flex-1 py-3 text-sm font-medium text-center ${activeTab === "basic" ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`}
            >
              Basic Info
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("parents")}
              className={`flex-1 py-3 text-sm font-medium text-center ${activeTab === "parents" ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`}
            >
              Parents
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("extracurriculars")}
              className={`flex-1 py-3 text-sm font-medium text-center ${activeTab === "extracurriculars" ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`}
            >
              Activities
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("medical")}
              className={`flex-1 py-3 text-sm font-medium text-center ${activeTab === "medical" ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`}
            >
              Medical
            </button>
            {customFields && customFields.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab("custom")}
                className={`flex-1 py-3 text-sm font-medium text-center ${activeTab === "custom" ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`}
              >
                Custom Fields
              </button>
            )}
          </div>

          <div className="p-4 space-y-4">
            {activeTab === "basic" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name
                    </label>
                    <input
                      {...register("firstName")}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="John"
                    />
                    {errors.firstName && <span className="text-red-500 text-xs mt-1">{errors.firstName.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name
                    </label>
                    <input
                      {...register("lastName")}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="Doe"
                    />
                    {errors.lastName && <span className="text-red-500 text-xs mt-1">{errors.lastName.message}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="john.doe@example.com"
                  />
                  {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date of Birth
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
                      Enrollment Date
                    </label>
                    <DatePicker
                      value={enrollmentDate ? new Date(enrollmentDate) : null}
                      onChange={(date) => setValue("enrollmentDate", format(date, "yyyy-MM-dd"))}
                      placeholder="Select Date"
                    />
                    {errors.enrollmentDate && <span className="text-red-500 text-xs mt-1">{errors.enrollmentDate.message}</span>}
                  </div>
                </div>
              </>
            )}

            {activeTab === "parents" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Parents / Guardians
                </label>
                {parentsData?.content?.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No parents found in the database.</p>
                )}
                {parentsData?.content?.map((parent: any) => (
                  <div key={parent.id} className="flex flex-col mb-2 p-2 border border-gray-100 dark:border-gray-700 rounded bg-white dark:bg-gray-800">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`parent-${parent.id}`}
                        checked={currentParentRelationships.some((pr: any) => pr.parentId === parent.id)}
                        onChange={() => handleParentToggle(parent.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor={`parent-${parent.id}`} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {parent.name} ({parent.contactNumber})
                      </label>
                    </div>
                    {currentParentRelationships.some((pr: any) => pr.parentId === parent.id) && (
                      <div className="ml-6 mt-2">
                        <select
                          className="w-full max-w-xs px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          value={currentParentRelationships.find((pr: any) => pr.parentId === parent.id)?.relationshipType || "MOTHER"}
                          onChange={(e) => handleRelationshipTypeChange(parent.id, e.target.value)}
                        >
                          <option value="MOTHER">Mother</option>
                          <option value="FATHER">Father</option>
                          <option value="UNCLE">Uncle</option>
                          <option value="AUNT">Aunt</option>
                          <option value="BROTHER">Brother</option>
                          <option value="SISTER">Sister</option>
                          <option value="GRANDPARENT">Grandparent</option>
                          <option value="GUARDIAN">Guardian</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "extracurriculars" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Extracurricular Activities
                </label>
                {extracurricularsData?.content?.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No activities found in the database.</p>
                )}
                {extracurricularsData?.content?.map((activity: any) => (
                  <div key={activity.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`activity-${activity.id}`}
                      checked={currentExtracurricularIds.includes(activity.id)}
                      onChange={() => handleExtracurricularToggle(activity.id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor={`activity-${activity.id}`} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      {activity.name}
                    </label>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "medical" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Medical Conditions / Notes
                </label>
                <textarea
                  {...register("medicalConditions")}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="List any known allergies, medications, or specific medical conditions here..."
                />
              </div>
            )}

            {activeTab === "custom" && customFields && customFields.length > 0 && (
              <div className="space-y-4">
                <DynamicCustomFields definitions={customFields} prefix="customAttributes." />
              </div>
            )}
          </div>
        </ModalBody>

        <CustomModalFooter
          onClose={onClose}
          submitText={isEdit ? "Save Changes" : "Create Student"}
          submitDisabled={mutation.isPending}
        />
      </form>
    </Modal>
  );
}
