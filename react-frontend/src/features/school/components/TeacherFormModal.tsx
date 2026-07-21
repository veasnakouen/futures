"use client";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { schoolService, TeacherDto, BranchDto } from "../../../services/schoolService";
import { toast } from "react-hot-toast";
import CustomModalHeader from "../../../components/common/CustomModalHeader";
import CustomModalFooter from "../../../components/common/CustomModalFooter";
import { Modal, ModalBody } from "@/lib/flowbite-compat";
import DatePicker from "../../../components/common/DatePicker";
import { format } from "date-fns";
import AddressFields from "../../../components/common/AddressFields";
import ImageUploadField from "../../../components/common/ImageUploadField";
import { X } from "lucide-react";
import Select from "react-select";

const selectClassNames = {
  control: ({ isFocused }: { isFocused: boolean }) =>
    `min-h-[42px] w-full rounded-lg border border-gray-300 bg-gray-50/50 px-2 py-0.5 text-sm shadow-sm transition-all cursor-pointer hover:bg-white ` +
    `${isFocused ? 'ring-2 ring-blue-500/20 border-blue-500 bg-white outline-none' : 'hover:border-gray-400'} ` +
    `dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-100 dark:hover:border-gray-500 dark:hover:bg-gray-800`,
  menu: () =>
    "mt-1 rounded-lg border border-gray-200 bg-white shadow-lg z-[100] dark:border-gray-700 dark:bg-gray-800 overflow-hidden",
  option: ({ isFocused, isSelected }: { isFocused: boolean; isSelected: boolean }) =>
    `relative flex cursor-pointer select-none items-center rounded-md py-2 px-3 text-sm outline-none transition-colors mx-1 my-0.5 w-[calc(100%-8px)] ` +
    `${isSelected ? 'bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/40 dark:text-blue-300' : isFocused ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`,
  multiValue: () =>
    "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-md overflow-hidden flex items-center m-0.5 border border-blue-100 dark:border-blue-800/50",
  multiValueLabel: () => "px-2 py-1 text-xs font-medium",
  multiValueRemove: () =>
    "px-1.5 py-1 hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-100 cursor-pointer transition-colors",
  placeholder: () => "text-gray-400 dark:text-gray-500 ml-1",
  singleValue: () => "text-gray-900 dark:text-gray-100 ml-1",
  valueContainer: () => 
    "p-0 gap-1 max-h-[85px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full",
  input: () => "text-gray-900 dark:text-gray-100 m-0 ml-1",
  indicatorSeparator: () => "hidden",
  dropdownIndicator: () => "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1 cursor-pointer transition-colors",
  clearIndicator: () => "text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 p-1 cursor-pointer transition-colors",
};

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  subject: z.string().optional(),
  courseIds: z.array(z.string()).optional(),
  hireDate: z.string().min(1, "Hire date is required"),
  baseSalary: z.number().min(0, "Base salary must be positive").optional(),
  branchId: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    village: z.string().optional(),
    commune: z.string().optional(),
    district: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  imageUrl: z.string().optional(),
  facebookLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  instagramLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  twitterLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  linkedinLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  teacherToEdit?: TeacherDto | null;
}

export default function TeacherFormModal({ isOpen, onClose, teacherToEdit }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!teacherToEdit;
  const { t } = useTranslation();

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

  const { data: branches = [] } = useQuery<BranchDto[]>({
    queryKey: ["branches"],
    queryFn: () => schoolService.getBranches().then((res) => res.data),
  });

  const { data: coursesData } = useQuery({
    queryKey: ["courses_all"],
    queryFn: () => schoolService.getCourses(0, 100).then((res) => res.data),
  });

  const hireDate = watch("hireDate");

  useEffect(() => {
    if (isOpen) {
      if (teacherToEdit) {
        reset({
          firstName: teacherToEdit.firstName,
          lastName: teacherToEdit.lastName,
          email: teacherToEdit.email,
          subject: teacherToEdit.subject || "",
          courseIds: teacherToEdit.courseIds || [],
          hireDate: teacherToEdit.hireDate,
          baseSalary: teacherToEdit.baseSalary || 0,
          branchId: teacherToEdit.branchId || "",
          address: teacherToEdit.address || {},
          imageUrl: teacherToEdit.imageUrl || "",
          facebookLink: teacherToEdit.facebookLink || "",
          instagramLink: teacherToEdit.instagramLink || "",
          twitterLink: teacherToEdit.twitterLink || "",
          linkedinLink: teacherToEdit.linkedinLink || "",
        });
      } else {
        reset({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          courseIds: [],
          hireDate: format(new Date(), "yyyy-MM-dd"),
          baseSalary: 0,
          branchId: "",
          address: {},
          imageUrl: "",
          facebookLink: "",
          instagramLink: "",
          twitterLink: "",
          linkedinLink: "",
        });
      }
    }
  }, [isOpen, teacherToEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      isEdit && teacherToEdit
        ? schoolService.updateTeacher(teacherToEdit.id, data)
        : schoolService.createTeacher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success(isEdit ? t("teacherUpdatedSuccess") : t("teacherCreatedSuccess"));
      onClose();
    },
    onError: () => {
      toast.error(isEdit ? t("teacherUpdatedFail") : t("teacherCreatedFail"));
    },
  });

  const onSubmit = (data: FormValues) => {
    const payload = { ...data };
    if (payload.branchId === "") {
      delete payload.branchId;
    }
    // Automatically assign the courses that match the selected subjects
    payload.courseIds = courseOptions.map((c: any) => c.value);
    
    mutation.mutate(payload);
  };

  const selectedSubjectsArray = (watch("subject") || "").split(",").filter(Boolean);
  const selectedCourseIds = watch("courseIds") || [];

  const subjectOptions = [
    { value: "Mathematics", label: t("mathematics") },
    { value: "Science", label: t("science") },
    { value: "English", label: t("english") },
    { value: "History", label: t("history") },
    { value: "Art", label: t("art") },
    { value: "Music", label: t("music") },
    { value: "Physical Education", label: t("physicalEducation") },
    { value: "Computer Science", label: t("computerScience") },
  ];

  const courseOptions = coursesData?.content
    ?.filter((c: any) => {
      const matchesSubject = selectedSubjectsArray.length > 0 && selectedSubjectsArray.includes(c.subject);
      const isAlreadyAssigned = selectedCourseIds.includes(c.id);
      return matchesSubject || isAlreadyAssigned;
    })
    .map((c: any) => ({
      value: c.id,
      label: c.name,
    })) || [];

  const toggleCourse = (courseId: string) => {
    if (selectedCourseIds.includes(courseId)) {
      setValue("courseIds", selectedCourseIds.filter(id => id !== courseId), { shouldDirty: true });
    } else {
      setValue("courseIds", [...selectedCourseIds, courseId], { shouldDirty: true });
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="3xl">
      <CustomModalHeader
        title={isEdit ? t("editTeacher") : t("newTeacher")}
        onClose={onClose}
        icon={null}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="p-6 space-y-8">
          
          {/* Section 1: Personal Information */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0 flex justify-center items-start pt-2">
              <ImageUploadField
                label=""
                isAvatar={true}
                value={watch("imageUrl")}
                onChange={(url) => setValue("imageUrl", url)}
              />
            </div>
            
            <div className="flex-grow space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                    {t("firstName")}<span className="text-red-500">{t("*")}</span>
                  </label>
                  <input
                    {...register("firstName")}
                    className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Jane"
                  />
                  {errors.firstName && (
                    <span className="text-red-500 text-xs mt-1">{errors.firstName.message}</span>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                    {t("lastName")}<span className="text-red-500">{t("*")}</span>
                  </label>
                  <input
                    {...register("lastName")}
                    className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Smith"
                  />
                  {errors.lastName && (
                    <span className="text-red-500 text-xs mt-1">{errors.lastName.message}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                  {t("emailAddress")}
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="jane.smith@example.com"
                />
                {errors.email && (
                  <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Employment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Employment Details
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                  {t("subject")}
                </label>
                <Controller
                  name="subject"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      unstyled
                      isMulti
                      isClearable
                      options={subjectOptions}
                      value={subjectOptions.filter(opt => (field.value || "").split(",").includes(opt.value))}
                      onChange={(selected: any) => {
                        const val = selected ? selected.map((s: any) => s.value).join(",") : "";
                        field.onChange(val);
                      }}
                      placeholder={t("selectSubject")}
                      classNames={selectClassNames}
                    />
                  )}
                />
                {errors.subject && (
                  <span className="text-red-500 text-xs mt-1">{errors.subject.message}</span>
                )}
              </div>
              
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                  {t("hireDate")}<span className="text-red-500">{t("*")}</span>
                </label>
                <DatePicker
                  value={hireDate ? new Date(hireDate) : null}
                  onChange={(date) => setValue("hireDate", format(date, "yyyy-MM-dd"))}
                  placeholder="Select Date"
                />
                {errors.hireDate && (
                  <span className="text-red-500 text-xs mt-1">{errors.hireDate.message}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                  {t("baseSalary")}
                </label>
                <input
                  type="number"
                  {...register("baseSalary", { valueAsNumber: true })}
                  className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="50000"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                  {t("branch")}
                </label>
                <select
                  {...register("branchId")}
                  className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="">{t("selectBranch")}</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.branchName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Social Media Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Social Media Links
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                  Facebook URL
                </label>
                <input
                  {...register("facebookLink")}
                  type="url"
                  className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="https://facebook.com/..."
                />
                {errors.facebookLink && <span className="text-red-500 text-xs mt-1">{errors.facebookLink.message}</span>}
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                  Instagram URL
                </label>
                <input
                  {...register("instagramLink")}
                  type="url"
                  className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="https://instagram.com/..."
                />
                {errors.instagramLink && <span className="text-red-500 text-xs mt-1">{errors.instagramLink.message}</span>}
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                  Twitter URL
                </label>
                <input
                  {...register("twitterLink")}
                  type="url"
                  className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="https://twitter.com/..."
                />
                {errors.twitterLink && <span className="text-red-500 text-xs mt-1">{errors.twitterLink.message}</span>}
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                  LinkedIn URL
                </label>
                <input
                  {...register("linkedinLink")}
                  type="url"
                  className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="https://linkedin.com/in/..."
                />
                {errors.linkedinLink && <span className="text-red-500 text-xs mt-1">{errors.linkedinLink.message}</span>}
              </div>
            </div>
          </div>

          {/* Section 4: Address Details */}
          <AddressFields<FormValues> register={register} errors={errors} prefix="address" watch={watch} setValue={setValue} />

        </ModalBody>

        <CustomModalFooter
          onClose={onClose}
          submitText={isEdit ? t("saveChanges") : t("createTeacher")}
          submitDisabled={mutation.isPending}
        />
      </form>
    </Modal>
  );
}
