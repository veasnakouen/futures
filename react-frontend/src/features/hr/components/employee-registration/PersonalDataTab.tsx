import React, { useState } from "react";
import {
  Label,
  TextInput,
  Select,
  Textarea,
  Spinner,
  Button,
} from '@/lib/flowbite-compat';
import {
  Camera,
  User,
  ShieldCheck,
  Link as LinkIcon,
  Search,
} from "lucide-react";
import { type UseFormReturn } from "react-hook-form";
import { type EmployeeFormData } from '../../../../schemas/employeeSchema';
import { toast } from "react-hot-toast";
import { uploadToCloudinary } from '../../../../utils/cloudinary';
import { useQuery } from "@tanstack/react-query";
import api from '../../../../services/api';
import DatePickerField from "./DatePickerField";
import ImageCropperModal from "../../../../components/common/ImageCropperModal";

interface PersonalDataTabProps {
  formMethods: UseFormReturn<EmployeeFormData>;
  isAdminOrSuper: boolean;
  employeeId?: number;
  isUploading: Record<string, boolean>;
  setIsUploading: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const PersonalDataTab: React.FC<PersonalDataTabProps> = ({
  formMethods,
  isAdminOrSuper,
  employeeId,
  isUploading,
  setIsUploading,
}) => {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = formMethods;
  const formData = watch();
  const [showUserSelect, setShowUserSelect] = useState(false);

  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const { data: usersPage, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["systemUsersForAutofill"],
    queryFn: () => api.get("/admin/users?size=500").then((res) => res.data),
    enabled: showUserSelect && isAdminOrSuper,
    staleTime: 5 * 60 * 1000,
  });

  const systemUsers = usersPage?.content || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Image Upload */}
      <div className="flex flex-col items-center mb-8 bg-gray-50 dark:bg-gray-700/20 p-6 rounded-md border border-dashed border-gray-200 dark:border-gray-600">
        <div className="relative group">
          <div className="w-32 h-32 rounded-md bg-gray-200 dark:bg-gray-700 overflow-hidden border-4 border-white dark:border-gray-800 shadow-md">
            {formData.photo ? (
              <img
                src={formData.photo}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <User size={48} />
              </div>
            )}
            {isUploading["photo"] && (
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
                <Spinner size="lg" color="info" />
              </div>
            )}
          </div>
          <label className="absolute bottom-0 right-0 p-2.5 bg-blue-600 text-white rounded-md cursor-pointer shadow-lg hover:bg-blue-700 transition-all border border-white dark:border-gray-800">
            <Camera size={16} />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setCropImageSrc(reader.result as string);
                    setIsCropModalOpen(true);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
        </div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-4">
          Upload Official Personnel Photo
        </p>
      </div>

      {/* Admin Auto-Fill Feature */}
      {isAdminOrSuper && employeeId === undefined && (
        <div className="mb-6 p-5 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-xs font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                <ShieldCheck size={16} /> Admin Tool: Auto-fill from System User
              </h5>
              <p className="text-[10px] font-bold text-gray-500 mt-1">
                Quickly populate basic fields from an existing IT user account.
              </p>
            </div>
            {!showUserSelect ? (
              <Button
                size="xs"
                color="indigo"
                onClick={() => setShowUserSelect(true)}
                className="rounded-md font-bold uppercase text-[10px]"
              >
                <LinkIcon size={12} className="mr-2" /> Connect User
              </Button>
            ) : (
              <Button
                size="xs"
                color="light"
                onClick={() => setShowUserSelect(false)}
                className="rounded-md font-bold uppercase text-[10px]"
              >
                Cancel
              </Button>
            )}
          </div>

          {showUserSelect && (
            <div className="mt-4 pt-4 border-t border-indigo-100 dark:border-indigo-900/30 flex items-center gap-4">
              {isLoadingUsers ? (
                <div className="flex items-center gap-3 text-indigo-500 font-bold text-xs">
                  <Spinner size="sm" /> Fetching users...
                </div>
              ) : (
                <div className="flex-1 relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search size={14} />
                  </div>
                  <Select
                    className="pl-8 flex-1"
                    onChange={(e) => {
                      const uId = e.target.value;
                      if (!uId) return;
                      const u = systemUsers.find((x: any) => x.id === uId);
                      if (u) {
                        setValue("firstNameEnglish", u.firstName || "", {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        setValue("lastNameEnglish", u.lastName || "", {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        setValue("email", u.email || "", {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        toast.success(
                          `Populated details for ${u.firstName} ${u.lastName}`,
                        );
                      }
                    }}
                  >
                    <option value="">
                      -- Search & Select a User Account --
                    </option>
                    {systemUsers.map((u: any) => (
                      <option key={u.id} value={u.id}>
                        {u.firstName} {u.lastName} ({u.email || u.userName})
                      </option>
                    ))}
                  </Select>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-6 gap-6">
        <div className="col-span-1">
          <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">
            Title
          </Label>
          <Select
            {...register("title")}
            color={errors.title ? "failure" : undefined}
          >
            <option>Mr</option>
            <option>Ms</option>
            <option>Mrs</option>
            <option>Dr</option>
          </Select>
        </div>
        <div className="col-span-2">
          <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">
            First Name (EN)
          </Label>
          <TextInput {...register("firstNameEnglish")} />
          {errors.firstNameEnglish && (
            <p className="text-[10px] font-bold text-red-500 mt-1">
              {errors.firstNameEnglish.message}
            </p>
          )}
        </div>
        <div className="col-span-3">
          <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">
            Last Name (EN)
          </Label>
          <TextInput {...register("lastNameEnglish")} />
          {errors.lastNameEnglish && (
            <p className="text-[10px] font-bold text-red-500 mt-1">
              {errors.lastNameEnglish.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">
            First Name (KH)
          </Label>
          <TextInput {...register("firstNameKhmer")} placeholder="នាមខ្លួន" />
        </div>
        <div>
          <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">
            Last Name (KH)
          </Label>
          <TextInput {...register("lastNameKhmer")} placeholder="នាមត្រកូល" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div>
          <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">
            Gender
          </Label>
          <Select {...register("gender")}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </Select>
        </div>
        <DatePickerField
          label="Date of Birth"
          field="dateOfBirth"
          control={control}
        />
        <div>
          <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">
            Blood Group
          </Label>
          <Select {...register("bloodGroup")}>
            <option value="">Unknown</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>O+</option>
            <option>O-</option>
            <option>AB+</option>
            <option>AB-</option>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">
            Nationality
          </Label>
          <TextInput {...register("nationality")} />
        </div>
        <div>
          <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">
            Place of Birth
          </Label>
          <TextInput {...register("placeOfBirth")} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">
            Marital Status
          </Label>
          <Select {...register("maritalStatus")}>
            <option>Single</option>
            <option>Married</option>
            <option>Divorced</option>
            <option>Widowed</option>
          </Select>
        </div>
        <div>
          <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">
            Number of Children
          </Label>
          <TextInput type="number" {...register("children")} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">
            Identity Card Type
          </Label>
          <Select {...register("identityCardType")}>
            <option>National ID</option>
            <option>Passport</option>
            <option>Driving License</option>
          </Select>
        </div>
        <div>
          <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">
            Identity Card Number
          </Label>
          <TextInput {...register("identityCardNumber")} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">
            Contact Number
          </Label>
          <TextInput
            {...register("phoneNumber")}
            placeholder="+855 ..."
            color={errors.phoneNumber ? "failure" : undefined}
          />
          {errors.phoneNumber && (
            <p className="text-[10px] font-bold text-red-500 mt-1">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>
        <div>
          <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">
            Email Address
          </Label>
          <TextInput
            type="email"
            {...register("email")}
            placeholder="example@mtp.org"
            color={errors.email ? "failure" : undefined}
          />
          {errors.email && (
            <p className="text-[10px] font-bold text-red-500 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">
          Home Address
        </Label>
        <Textarea
          {...register("address")}
          placeholder="Full residential address..."
        />
      </div>

      {cropImageSrc && (
        <ImageCropperModal
          isOpen={isCropModalOpen}
          onClose={() => {
            setIsCropModalOpen(false);
            setCropImageSrc(null);
          }}
          imageSrc={cropImageSrc}
          onCropComplete={async (croppedFile: File) => {
            try {
              setIsUploading((prev) => ({ ...prev, photo: true }));
              const url = await uploadToCloudinary(croppedFile);
              setValue("photo", url, { shouldDirty: true });
            } catch (err) {
              toast.error("Failed to upload photo");
            } finally {
              setIsUploading((prev) => ({ ...prev, photo: false }));
            }
          }}
          aspectRatio={1}
        />
      )}
    </div>
  );
};

export default PersonalDataTab;
