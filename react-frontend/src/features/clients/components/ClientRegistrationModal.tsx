import { Plus, X } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import {Modal, ModalBody, Label, TextInput, Select, Avatar, FileInput, Button, Checkbox} from '@/lib/flowbite-compat';
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import {
  User,
  MapPin,
  ClipboardList,
  Star,
  ChevronRight,
  Check,
} from "lucide-react";
import ClientAdvancedFeatures from "./ClientAdvancedFeatures";
import DatePicker from '@/components/common/DatePicker';
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import api from '@/services/api';

interface ClientRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  formData: any;
  setFormData: (data: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clientId?: number | string;
}

const ClientRegistrationModal: React.FC<ClientRegistrationModalProps> = ({
  isOpen,
  onClose,
  isEditMode,
  formData,
  setFormData,
  handleSubmit,
  handlePhotoChange,
  clientId,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const prevClientId = useRef(clientId);

  const [isAddingSupport, setIsAddingSupport] = useState(false);
  const [newSupportInput, setNewSupportInput] = useState("");

  const { data: expectedSupports = [], refetch: refetchSupports } = useQuery({
    queryKey: ["expectedSupports"],
    queryFn: async () => {
      const res = await api.get("/lookups/expected-supports");
      return res.data;
    },
  });

  const handleAddSupport = async () => {
    if (newSupportInput.trim()) {
      try {
        await api.post("/lookups/expected-supports", {
          name: newSupportInput.trim(),
        });
        handleExpectedSupportChange(newSupportInput.trim(), true);
        setNewSupportInput("");
        setIsAddingSupport(false);
        refetchSupports();
      } catch (err) {
        console.error("Failed to add expected support", err);
      }
    }
  };

  const handleExpectedSupportChange = (name: string, isChecked: boolean) => {
    let current = formData.expectedSupport
      ? formData.expectedSupport
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean)
      : [];
    if (isChecked) {
      if (!current.includes(name)) current.push(name);
    } else {
      current = current.filter((n: string) => n !== name);
    }

    let updates: any = { expectedSupport: current.join(",") };
    if (name.includes("Further Education"))
      updates.furtherEducation = isChecked;
    if (name.includes("Placement")) updates.placement = isChecked;
    if (name.includes("Futures Training"))
      updates.trainingFromFutures = isChecked;
    if (name.includes("Social Support"))
      updates.socialSupportRequired = isChecked;

    setFormData({ ...formData, ...updates });
  };

  useEffect(() => {
    if (!prevClientId.current && clientId) {
      setCurrentStep(4);
    }
    prevClientId.current = clientId;
  }, [clientId]);

  const isStep1Valid = () => {
    return !!(
      formData.firstName?.trim() &&
      formData.lastName?.trim() &&
      formData.clientCode?.trim() &&
      formData.branch?.trim() &&
      formData.gender?.trim() &&
      formData.status?.trim()
    );
  };

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
    }
  }, [isOpen]);

  const handleNextStep = (e: any) => {
    if (e && e.preventDefault) e.preventDefault();

    if (currentStep === 1 && !isStep1Valid()) {
      const form = document.getElementById("clientForm") as HTMLFormElement;
      if (form) {
        form.reportValidity();
      }
      return;
    }

    if (currentStep === 3 && !isEditMode) {
      handleSubmit(e);
    } else {
      if (currentStep < 4) setCurrentStep((c) => c + 1);
    }
  };

  const handleSave = (e: any) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!isStep1Valid()) {
      const form = document.getElementById("clientForm") as HTMLFormElement;
      if (form) {
        setCurrentStep(1);
        setTimeout(() => {
          form.reportValidity();
        }, 100);
      }
      return;
    }
    handleSubmit(e);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep((c) => c - 1);
  };

  const steps = [
    { num: 1, title: "Basic Info", icon: User },
    { num: 2, title: "Contact", icon: MapPin },
    { num: 3, title: "Assessment", icon: ClipboardList },
    { num: 4, title: "Advanced", icon: Star },
  ];

  return (
    <Modal show={isOpen} onClose={onClose} size="4xl">
      <CustomModalHeader
        title={
          isEditMode ? "Modify Client Profile" : "Execute New Registration"
        }
        subtitle="System Node: Client_Registry_v4"
        onClose={onClose}
      />

      <ModalBody className="bg-gray-50 dark:bg-gray-900 px-0 py-0 overflow-hidden flex flex-col">
        {/* Stepper Header */}
        <div className="bg-white dark:bg-gray-800 border-b px-4 md:px-6 py-4 flex justify-between items-center overflow-x-auto custom-scrollbar">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted =
              currentStep > step.num || (isEditMode && step.num <= 3);
            const isActive = currentStep === step.num;
            const isLocked = step.num === 4 && !isEditMode && !clientId;

            return (
              <React.Fragment key={step.num}>
                <div
                  className={`flex items-center gap-2 transition-all ${isActive ?"opacity-100 scale-105": isLocked ?"opacity-30":"opacity-60"} ${!isLocked ?"cursor-pointer hover:opacity-100":"cursor-not-allowed"}`}
                  onClick={() => {
                    if (!isLocked) {
                      if (step.num > 1 && !isStep1Valid()) {
                        const form = document.getElementById(
                          "clientForm",
                        ) as HTMLFormElement;
                        if (form) {
                          setCurrentStep(1);
                          setTimeout(() => {
                            form.reportValidity();
                          }, 100);
                        }
                      } else {
                        setCurrentStep(step.num);
                      }
                    }
                  }}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${isActive ?"bg-blue-600 text-white shadow-blue-500/30": isCompleted ?"bg-emerald-500 text-white shadow-emerald-500/30":"bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}
                  >
                    {isCompleted && !isActive ? (
                      <Check size={14} />
                    ) : (
                      <Icon size={14} />
                    )}
                  </div>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider hidden sm:block ${isActive ?"text-blue-600 dark:text-blue-400":"text-gray-500 dark:text-gray-400"}`}
                  >
                    {step.title}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="flex-1 mx-2 sm:mx-4 max-w-[60px] border-t-2" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <form id="clientForm" onSubmit={handleSubmit} className="space-y-8">
            {currentStep === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <User className="text-blue-500" size={20} /> Basic
                    Information
                  </h3>
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Photo Section */}
                    <div className="flex flex-col items-center justify-start w-full md:w-1/4 pt-2">
                      <div className="relative group w-32 h-40 mb-4 rounded-xl overflow-hidden shadow-md border-4 border-white bg-gray-100 dark:bg-gray-800">
                        {formData.photo ? (
                          <img
                            src={formData.photo}
                            alt="Client"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl font-black text-gray-300">
                            {formData.firstName && formData.lastName
                              ? `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`
                              : "CN"}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                          <p className="text-[10px] font-black text-white uppercase tracking-widest">
                            Replace
                          </p>
                        </div>
                      </div>
                      <div className="w-full text-center relative">
                        <Label
                          htmlFor="photo"
                          className="cursor-pointer bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-md text-blue-600 dark:text-blue-400 font-bold text-xs uppercase hover:bg-white transition-all inline-block shadow-sm"
                        >
                          Upload Media
                        </Label>
                        <FileInput
                          id="photo"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {/* Basic Fields */}
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="firstName"
                            className="text-xs font-bold text-gray-500 mb-1 block"
                          >
                            First Name
                          </Label>
                          <TextInput
                            id="firstName"
                            placeholder="John"
                            required
                            value={formData.firstName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                firstName: e.target.value,
                              })
                            }
                            className="rounded-md"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="lastName"
                            className="text-xs font-bold text-gray-500 mb-1 block"
                          >
                            Last Name
                          </Label>
                          <TextInput
                            id="lastName"
                            placeholder="Doe"
                            required
                            value={formData.lastName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lastName: e.target.value,
                              })
                            }
                            className="rounded-md"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="clientCode"
                            className="text-xs font-bold text-gray-500 mb-1 block"
                          >
                            Client Code
                          </Label>
                          <TextInput
                            id="clientCode"
                            placeholder="MTP-001"
                            required
                            value={formData.clientCode}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                clientCode: e.target.value,
                              })
                            }
                            className="rounded-md"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="branch"
                            className="text-xs font-bold text-gray-500 mb-1 block"
                          >
                            Branch Office
                          </Label>
                          <Select
                            id="branch"
                            required
                            value={formData.branch}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                branch: e.target.value,
                              })
                            }
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
                          <Label
                            htmlFor="gender"
                            className="text-xs font-bold text-gray-500 mb-1 block"
                          >
                            Gender
                          </Label>
                          <Select
                            id="gender"
                            required
                            value={formData.gender}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                gender: e.target.value,
                              })
                            }
                            className="rounded-md"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </Select>
                        </div>
                        <div>
                          <Label
                            htmlFor="dateOfBirth"
                            className="text-xs font-bold text-gray-500 mb-1 block"
                          >
                            Date of Birth
                          </Label>
                          <DatePicker
                            value={
                              formData.dateOfBirth
                                ? new Date(formData.dateOfBirth)
                                : null
                            }
                            onChange={(date) =>
                              setFormData({
                                ...formData,
                                dateOfBirth: format(date, "yyyy-MM-dd"),
                              })
                            }
                            placeholder="mm / dd / yyyy"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="maritalStatus"
                            className="text-xs font-bold text-gray-500 mb-1 block"
                          >
                            Marital Status
                          </Label>
                          <Select
                            id="maritalStatus"
                            value={formData.maritalStatus}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                maritalStatus: e.target.value,
                              })
                            }
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
                          <Label
                            htmlFor="idCard"
                            className="text-xs font-bold text-gray-500 mb-1 block"
                          >
                            ID Card Number
                          </Label>
                          <TextInput
                            id="idCard"
                            placeholder="e.g. 0123456789"
                            value={formData.idCard}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                idCard: e.target.value,
                              })
                            }
                            className="rounded-md"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="status"
                            className="text-xs font-bold text-gray-500 mb-1 block"
                          >
                            Registration Status
                          </Label>
                          <Select
                            id="status"
                            required
                            value={formData.status}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                status: e.target.value,
                              })
                            }
                            className="rounded-md"
                          >
                            <option value="Active">Active</option>
                            <option value="Pending">Pending</option>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 border-t pt-4 mt-2">
                        <div>
                          <Label
                            htmlFor="placeOfBirth"
                            className="text-xs font-bold text-gray-500 mb-1 block"
                          >
                            Place of Birth
                          </Label>
                          <TextInput
                            id="placeOfBirth"
                            placeholder="e.g. Phnom Penh"
                            value={formData.placeOfBirth}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                placeOfBirth: e.target.value,
                              })
                            }
                            className="rounded-md"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="nationality"
                            className="text-xs font-bold text-gray-500 mb-1 block"
                          >
                            Nationality
                          </Label>
                          <TextInput
                            id="nationality"
                            placeholder="Cambodian"
                            value={formData.nationality}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                nationality: e.target.value,
                              })
                            }
                            className="rounded-md"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="citizenship"
                            className="text-xs font-bold text-gray-500 mb-1 block"
                          >
                            Citizenship
                          </Label>
                          <TextInput
                            id="citizenship"
                            placeholder="Cambodian"
                            value={formData.citizenship}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                citizenship: e.target.value,
                              })
                            }
                            className="rounded-md"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="height"
                            className="text-xs font-bold text-gray-500 mb-1 block"
                          >
                            Height (cm)
                          </Label>
                          <TextInput
                            id="height"
                            placeholder="e.g. 170"
                            value={formData.height}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                height: e.target.value,
                              })
                            }
                            className="rounded-md"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="weight"
                            className="text-xs font-bold text-gray-500 mb-1 block"
                          >
                            Weight (kg)
                          </Label>
                          <TextInput
                            id="weight"
                            placeholder="e.g. 65"
                            value={formData.weight}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                weight: e.target.value,
                              })
                            }
                            className="rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <MapPin className="text-emerald-500" size={20} /> Contact &
                    Location
                  </h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Label
                          htmlFor="email"
                          className="text-xs font-bold text-gray-500 mb-1 block"
                        >
                          Email Address
                        </Label>
                        <TextInput
                          id="email"
                          type="email"
                          placeholder="client@mtp.org"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="rounded-md"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="phone"
                          className="text-xs font-bold text-gray-500 mb-1 block"
                        >
                          Contact Phone
                        </Label>
                        <TextInput
                          id="phone"
                          placeholder="+855 12 345 678"
                          value={formData.contactPhone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              contactPhone: e.target.value,
                            })
                          }
                          className="rounded-md"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Label
                          htmlFor="relativePhone"
                          className="text-xs font-bold text-gray-500 mb-1 block"
                        >
                          Relative Phone (Emergency)
                        </Label>
                        <TextInput
                          id="relativePhone"
                          placeholder="+855 12 987 654"
                          value={formData.relativePhone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              relativePhone: e.target.value,
                            })
                          }
                          className="rounded-md"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="province"
                          className="text-xs font-bold text-gray-500 mb-1 block"
                        >
                          Province
                        </Label>
                        <Select
                          id="province"
                          value={formData.province}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              province: e.target.value,
                            })
                          }
                          className="rounded-md"
                        >
                          <option value="Phnom Penh">Phnom Penh</option>
                          <option value="Battambang">Battambang</option>
                          <option value="Siem Reap">Siem Reap</option>
                          <option value="Kampong Cham">Kampong Cham</option>
                          <option value="Sihanoukville">Sihanoukville</option>
                          <option value="Other">Other</option>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="address"
                        className="text-xs font-bold text-gray-500 mb-1 block"
                      >
                        Full Address
                      </Label>
                      <TextInput
                        id="address"
                        placeholder="House 123, Street 456..."
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        className="rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <ClipboardList className="text-purple-500" size={20} />{" "}
                    Assessment & Needs
                  </h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label
                          htmlFor="currentSituation"
                          className="text-xs font-bold text-gray-500 mb-1 block"
                        >
                          Current Situation
                        </Label>
                        <TextInput
                          id="currentSituation"
                          placeholder="e.g. Unemployed, Student..."
                          value={formData.currentSituation}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              currentSituation: e.target.value,
                            })
                          }
                          className="rounded-md"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="hearBy"
                          className="text-xs font-bold text-gray-500 mb-1 block"
                        >
                          How did they hear about us?
                        </Label>
                        <TextInput
                          id="hearBy"
                          placeholder="e.g. Facebook, Friend, Poster..."
                          value={formData.hearBy}
                          onChange={(e) =>
                            setFormData({ ...formData, hearBy: e.target.value })
                          }
                          className="rounded-md"
                        />
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-5 rounded-md shadow-sm">
                      <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">
                        Expected Support
                      </h4>

                      <div className="flex flex-col gap-3 max-h-60 overflow-y-auto custom-scrollbar pr-2 pl-3">
                        {/* Original 4 Core Checkboxes */}
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="furtherEducation"
                            checked={formData.furtherEducation}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                furtherEducation: e.target.checked,
                              })
                            }
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500 rounded"
                          />
                          <Label
                            htmlFor="furtherEducation"
                            className="text-[15px] cursor-pointer text-gray-700 dark:text-gray-300"
                          >
                            Further Education (Meeting with social worker)
                          </Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="placement"
                            checked={formData.placement}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                placement: e.target.checked,
                              })
                            }
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500 rounded"
                          />
                          <Label
                            htmlFor="placement"
                            className="text-[15px] cursor-pointer text-gray-700 dark:text-gray-300"
                          >
                            Placement (Skills assessment)
                          </Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="trainingFromFutures"
                            checked={formData.trainingFromFutures}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                trainingFromFutures: e.target.checked,
                              })
                            }
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500 rounded"
                          />
                          <Label
                            htmlFor="trainingFromFutures"
                            className="text-[15px] cursor-pointer text-gray-700 dark:text-gray-300"
                          >
                            Futures Training
                          </Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="socialSupportRequired"
                            checked={formData.socialSupportRequired}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                socialSupportRequired: e.target.checked,
                              })
                            }
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500 rounded"
                          />
                          <Label
                            htmlFor="socialSupportRequired"
                            className="text-[15px] cursor-pointer text-gray-700 dark:text-gray-300"
                          >
                            Social Support
                          </Label>
                        </div>

                        {/* Dynamically Added Checkboxes */}
                        {expectedSupports
                          .filter(
                            (support: any) =>
                              ![
                                "Further Education",
                                "Placement",
                                "Futures Training",
                                "Social Support",
                              ].some((core) => support.name.includes(core)),
                          )
                          .map((support: any) => {
                            const isChecked =
                              formData.expectedSupport?.includes(support.name);
                            return (
                              <div
                                key={support.id}
                                className="flex items-center justify-between group"
                              >
                                <div className="flex items-center gap-3">
                                  <Checkbox
                                    id={`support-${support.id}`}
                                    checked={!!isChecked}
                                    onChange={(e) =>
                                      handleExpectedSupportChange(
                                        support.name,
                                        e.target.checked,
                                      )
                                    }
                                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 rounded"
                                  />
                                  <Label
                                    htmlFor={`support-${support.id}`}
                                    className="text-[15px] cursor-pointer text-gray-700 dark:text-gray-300"
                                  >
                                    {support.name}
                                  </Label>
                                </div>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (
                                      window.confirm(
                                        `Delete the custom option "${support.name}" permanently?`,
                                      )
                                    ) {
                                      try {
                                        await api.delete(
                                          `/lookups/expected-supports/${support.id}`,
                                        );
                                        handleExpectedSupportChange(
                                          support.name,
                                          false,
                                        );
                                        refetchSupports();
                                      } catch (err) {
                                        console.error(
                                          "Failed to delete support option",
                                          err,
                                        );
                                      }
                                    }
                                  }}
                                  className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Delete custom option"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            );
                          })}
                      </div>

                      {isAddingSupport ? (
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                          <TextInput
                            sizing="sm"
                            placeholder="New option name..."
                            value={newSupportInput}
                            onChange={(e) => setNewSupportInput(e.target.value)}
                            className="flex-1"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddSupport();
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            color="blue"
                            onClick={handleAddSupport}
                            disabled={!newSupportInput.trim()}
                          >
                            Add
                          </Button>
                          <button
                            type="button"
                            onClick={() => setIsAddingSupport(false)}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="mt-4 pt-3 border-t">
                          <button
                            type="button"
                            onClick={() => setIsAddingSupport(true)}
                            className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 pl-3"
                          >
                            <Plus size={16} /> Add Custom Option
                          </button>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="socialSupportProblem"
                        className="text-xs font-bold text-gray-500 mb-1 block"
                      >
                        Social Support Problem
                      </Label>
                      <TextInput
                        id="socialSupportProblem"
                        placeholder="Any specific social support problems?"
                        value={formData.socialSupportProblem}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            socialSupportProblem: e.target.value,
                          })
                        }
                        className="rounded-md"
                      />
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-md border-orange-100 dark:border-orange-800/30">
                      <h4 className="text-sm font-bold text-orange-700 dark:text-orange-400 mb-4 uppercase tracking-wider">
                        ID Poor Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label
                            htmlFor="idpoorStatus"
                            className="text-xs font-bold text-gray-500 mb-1 block"
                          >
                            ID Poor Status
                          </Label>
                          <Select
                            id="idpoorStatus"
                            value={formData.idpoorStatus}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                idpoorStatus: e.target.value,
                              })
                            }
                            className="rounded-md"
                          >
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                            <option value="Pending">Pending</option>
                          </Select>
                        </div>
                        <div>
                          <Label
                            htmlFor="idpoorLevel"
                            className="text-xs font-bold text-gray-500 mb-1 block"
                          >
                            ID Poor Level
                          </Label>
                          <TextInput
                            id="idpoorLevel"
                            placeholder="e.g. Level 1"
                            value={formData.idpoorLevel}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                idpoorLevel: e.target.value,
                              })
                            }
                            className="rounded-md"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="idpoorAccountNumber"
                            className="text-xs font-bold text-gray-500 mb-1 block"
                          >
                            Account Number
                          </Label>
                          <TextInput
                            id="idpoorAccountNumber"
                            placeholder="ID Poor Account No"
                            value={formData.idpoorAccountNumber}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                idpoorAccountNumber: e.target.value,
                              })
                            }
                            className="rounded-md"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="idpoorValiddate"
                            className="text-xs font-bold text-gray-500 mb-1 block"
                          >
                            Valid Until
                          </Label>
                          <DatePicker
                            value={
                              formData.idpoorValiddate
                                ? new Date(formData.idpoorValiddate)
                                : null
                            }
                            onChange={(date) =>
                              setFormData({
                                ...formData,
                                idpoorValiddate: format(date, "yyyy-MM-dd"),
                              })
                            }
                            placeholder="mm / dd / yyyy"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
          {currentStep === 4 && clientId && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 h-full">
              <ClientAdvancedFeatures clientId={clientId} formData={formData} />
            </div>
          )}
        </div>
      </ModalBody>

      <div className="flex justify-between items-center w-full px-6 py-4 bg-white dark:bg-gray-800 rounded-b-lg border-t">
        <div>
          {currentStep > 1 && (
            <Button
              color="light"
              size="sm"
              onClick={handlePrevStep}
              className="font-bold uppercase tracking-wider text-[10px]"
            >
              Previous
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            color="light"
            size="sm"
            onClick={onClose}
            className="font-bold uppercase tracking-wider text-[10px] border-transparent hover:"
          >
            Cancel
          </Button>
          {isEditMode && currentStep < 4 && (
            <Button
              color="emerald"
              size="sm"
              onClick={handleSave}
              className="font-bold uppercase tracking-wider text-[10px] shadow-sm shadow-emerald-500/20"
            >
              Save Changes
            </Button>
          )}
          {currentStep < 4 ? (
            <Button
              color="blue"
              size="sm"
              onClick={handleNextStep}
              className="font-bold uppercase tracking-wider text-[10px] shadow-sm shadow-blue-500/20"
            >
              {currentStep === 3 && !isEditMode
                ? "Create Basic Profile"
                : "Next Step"}
              <ChevronRight size={14} className="ml-1" />
            </Button>
          ) : (
            <Button
              color="emerald"
              size="sm"
              onClick={onClose}
              className="font-bold uppercase tracking-wider text-[10px] shadow-sm shadow-emerald-500/20"
            >
              Finish & Close
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ClientRegistrationModal;
