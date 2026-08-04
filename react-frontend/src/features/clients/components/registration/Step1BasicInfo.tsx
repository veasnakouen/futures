import React from "react";
import { Label, TextInput, Select, FileInput } from "@/lib/flowbite-compat";
import DatePicker from "@/components/common/DatePicker";
import { format } from "date-fns";
import { User } from "lucide-react";

interface Props {
  formData: any;
  setFormData: (data: any) => void;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Step1BasicInfo({ formData, setFormData, handlePhotoChange }: Props) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <User className="text-blue-500" size={20} /> Basic Information
        </h3>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Photo Section */}
          <div className="flex flex-col items-center justify-start w-full md:w-1/4 pt-2">
            <div className="relative group w-32 h-40 mb-4 rounded-xl overflow-hidden shadow-md border-4 border-white bg-gray-100 dark:bg-gray-800">
              {formData.photo ? (
                <img src={formData.photo} alt="Client" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-black text-gray-300">
                  {formData.firstName && formData.lastName
                    ? `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`
                    : "CN"}
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Replace</p>
              </div>
            </div>
            <div className="w-full text-center relative">
              <Label
                htmlFor="photo"
                className="cursor-pointer bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-md text-blue-600 dark:text-blue-400 font-bold text-xs uppercase hover:bg-white transition-all inline-block shadow-sm"
              >
                Upload Media
              </Label>
              <FileInput id="photo" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </div>
          </div>

          {/* Basic Fields */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-xs font-bold text-gray-500 mb-1 block">First Name</Label>
                <TextInput
                  id="firstName"
                  placeholder="John"
                  required
                  value={formData.firstName || ""}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="rounded-md"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-xs font-bold text-gray-500 mb-1 block">Last Name</Label>
                <TextInput
                  id="lastName"
                  placeholder="Doe"
                  required
                  value={formData.lastName || ""}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientCode" className="text-xs font-bold text-gray-500 mb-1 block">Client Code</Label>
                <TextInput
                  id="clientCode"
                  placeholder="MTP-001"
                  required
                  value={formData.clientCode || ""}
                  onChange={(e) => setFormData({ ...formData, clientCode: e.target.value })}
                  className="rounded-md"
                />
              </div>
              <div>
                <Label htmlFor="branch" className="text-xs font-bold text-gray-500 mb-1 block">Branch Office</Label>
                <Select
                  id="branch"
                  required
                  value={formData.branch || "Phnom Penh"}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="rounded-md"
                >
                  <option value="Phnom Penh">Phnom Penh</option>
                  <option value="Battambang">Battambang</option>
                  <option value="Siem Reap">Siem Reap</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="gender" className="text-xs font-bold text-gray-500 mb-1 block">Gender</Label>
                <Select
                  id="gender"
                  required
                  value={formData.gender || "Male"}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="rounded-md"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="dateOfBirth" className="text-xs font-bold text-gray-500 mb-1 block">Date of Birth</Label>
                <DatePicker
                  value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
                  onChange={(date) => setFormData({ ...formData, dateOfBirth: date ? format(date, "yyyy-MM-dd") : "" })}
                  placeholder="mm / dd / yyyy"
                />
              </div>
              <div>
                <Label htmlFor="maritalStatus" className="text-xs font-bold text-gray-500 mb-1 block">Marital Status</Label>
                <Select
                  id="maritalStatus"
                  value={formData.maritalStatus || "Single"}
                  onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                  className="rounded-md"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="idCard" className="text-xs font-bold text-gray-500 mb-1 block">ID Card Number</Label>
                <TextInput
                  id="idCard"
                  placeholder="e.g. 0123456789"
                  value={formData.idCard || ""}
                  onChange={(e) => setFormData({ ...formData, idCard: e.target.value })}
                  className="rounded-md"
                />
              </div>
              <div>
                <Label htmlFor="status" className="text-xs font-bold text-gray-500 mb-1 block">Registration Status</Label>
                <Select
                  id="status"
                  required
                  value={formData.status || "Active"}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="rounded-md"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t pt-4 mt-2">
              <div>
                <Label htmlFor="placeOfBirth" className="text-xs font-bold text-gray-500 mb-1 block">Place of Birth</Label>
                <TextInput
                  id="placeOfBirth"
                  placeholder="e.g. Phnom Penh"
                  value={formData.placeOfBirth || ""}
                  onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                  className="rounded-md"
                />
              </div>
              <div>
                <Label htmlFor="nationality" className="text-xs font-bold text-gray-500 mb-1 block">Nationality</Label>
                <TextInput
                  id="nationality"
                  placeholder="Cambodian"
                  value={formData.nationality || ""}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  className="rounded-md"
                />
              </div>
              <div>
                <Label htmlFor="citizenship" className="text-xs font-bold text-gray-500 mb-1 block">Citizenship</Label>
                <TextInput
                  id="citizenship"
                  placeholder="Cambodian"
                  value={formData.citizenship || ""}
                  onChange={(e) => setFormData({ ...formData, citizenship: e.target.value })}
                  className="rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
