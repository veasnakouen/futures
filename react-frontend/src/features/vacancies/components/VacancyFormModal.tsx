import React from "react";
import {
  Modal,
  ModalBody,
  Button,
  Label,
  TextInput,
  Select,
  Textarea,
  Spinner,
} from '@/lib/flowbite-compat';
import DatePicker from '@/components/common/DatePicker';
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import {
  X,
  Briefcase,
  Calendar,
  MapPin,
  DollarSign,
  Camera,
} from "lucide-react";
import { format } from "date-fns";
import { uploadToCloudinary } from '@/utils/cloudinary';
import toast from "react-hot-toast";
import ImageCropperModal from "@/components/common/ImageCropperModal";

interface VacancyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  isViewMode?: boolean;
  formData: any;
  setFormData: (data: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  employers?: any[];
  jobPositions?: any[];
  onQuickEmployer?: () => void;
  onQuickJobPosition?: () => void;
}

const VacancyFormModal: React.FC<VacancyFormModalProps> = ({
  isOpen,
  onClose,
  isEditMode,
  isViewMode,
  formData,
  setFormData,
  handleSubmit,
  employers,
  jobPositions,
  onQuickEmployer,
  onQuickJobPosition,
}) => {
  const [isUploading, setIsUploading] = React.useState(false);
  const [cropImageSrc, setCropImageSrc] = React.useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCropImageSrc(reader.result as string);
      setIsCropModalOpen(true);
    };
    reader.readAsDataURL(file);

    // Clear the input value so selecting the same file again triggers onChange
    e.target.value = "";
  };

  const executeUpload = async (fileToUpload: File) => {
    try {
      setIsUploading(true);
      const url = await uploadToCloudinary(fileToUpload);
      setFormData({ ...formData, imageUrl: url });
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <>
      <Modal
        show={isOpen}
        onClose={onClose}
        size="2xl"
        theme={{
          content: {
            inner:
              "relative flex max-h-[90dvh] flex-col rounded-lg bg-white shadow dark:bg-gray-700 !overflow-visible",
          },
        }}
      >
        <CustomModalHeader
          title={
            isViewMode
              ? "Vacancy Details"
              : isEditMode
                ? "Modify Career Node"
                : "Initialize Vacancy"
          }
          subtitle="Recruitment Module"
          icon={<Briefcase size={24} />}
          onClose={onClose}
        />

        <ModalBody className="p-6 pb-4 dark:bg-gray-800">
          <form id="vacancy-form" onSubmit={handleSubmit} className="space-y-6">
            <fieldset disabled={isViewMode}>
              {/* Image Upload */}
              <div className="flex flex-col items-center justify-center mb-6 p-4 border border-dashed border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800/50">
                <label className="relative group cursor-pointer block">
                  <div className="w-24 h-24 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-sm border-2 border-transparent group-hover:border-blue-500 dark:group-hover:border-blue-400 transition-colors flex items-center justify-center">
                    {formData.imageUrl ? (
                      <img
                        src={formData.imageUrl}
                        alt="Vacancy"
                        className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                      />
                    ) : (
                      <Briefcase
                        size={32}
                        className="text-gray-400 group-hover:text-blue-500 transition-colors"
                      />
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                        <Spinner size="sm" color="info" />
                      </div>
                    )}
                  </div>
                  {!isViewMode && (
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  )}
                </label>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-3">
                  Vacancy Cover Image
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">
                    Job Designation
                  </Label>
                  <Select
                    required
                    value={formData.jobPositionId || ""}
                    onChange={(e) => {
                      if (e.target.value === "__add_new__") {
                        e.target.value = formData.jobPositionId || "";
                        onQuickJobPosition?.();
                      } else {
                        setFormData({
                          ...formData,
                          jobPositionId: e.target.value,
                        });
                      }
                    }}
                    className="rounded-md w-full"
                  >
                    <option value="">Select Job Position...</option>
                    {jobPositions?.map((jp) => (
                      <option key={jp.id} value={jp.id}>
                        {jp.name}
                      </option>
                    ))}
                    <option disabled>──────────────</option>
                    <option value="__add_new__">＋ Add New Job Position</option>
                  </Select>
                </div>

                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">
                    Company Entity
                  </Label>
                  <Select
                    required
                    value={formData.employerId}
                    onChange={(e) => {
                      if (e.target.value === "__add_new__") {
                        e.target.value = formData.employerId || "";
                        onQuickEmployer?.();
                      } else {
                        setFormData({
                          ...formData,
                          employerId: e.target.value,
                        });
                      }
                    }}
                    className="rounded-md w-full"
                  >
                    <option value="">Select Employer...</option>
                    {employers?.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name || emp.companyName}
                      </option>
                    ))}
                    <option disabled>──────────────</option>
                    <option value="__add_new__">＋ Add New Employer</option>
                  </Select>
                </div>

                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">
                    Application Deadline
                  </Label>
                  <DatePicker
                    value={
                      formData.closingDate
                        ? new Date(formData.closingDate)
                        : null
                    }
                    onChange={(date) =>
                      setFormData({
                        ...formData,
                        closingDate: format(date, "yyyy-MM-dd"),
                      })
                    }
                    placeholder="Select Deadline..."
                    disabled={isViewMode}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">
                    Compensatory Range (Min - Max)
                  </Label>
                  <div className="flex gap-2">
                    <TextInput
                      icon={DollarSign}
                      className="font-mono font-bold flex-1"
                      value={formData.salary || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, salary: e.target.value })
                      }
                      placeholder="Min"
                    />
                    <TextInput
                      className="font-mono font-bold flex-1"
                      value={formData.salarymax || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, salarymax: e.target.value })
                      }
                      placeholder="Max"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">
                    Location Node
                  </Label>
                  <TextInput
                    icon={MapPin}
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">
                    Work Modality / Schedule
                  </Label>
                  <div className="flex gap-2">
                    <Select
                      value={
                        formData.contractType || formData.jobType || "Full-Time"
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contractType: e.target.value,
                          jobType: e.target.value,
                        })
                      }
                      className="rounded-md flex-1"
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Internship">Internship</option>
                      <option value="Contract">Contract</option>
                    </Select>
                    <TextInput
                      className="flex-1"
                      value={formData.schedule || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, schedule: e.target.value })
                      }
                      placeholder="e.g. Mon-Fri 9-5"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">
                    Current Lifecycle Status
                  </Label>
                  <Select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="rounded-md"
                  >
                    <option>Active</option>
                    <option>Paused</option>
                    <option>Closed</option>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">
                  Responsibilities
                </Label>
                <Textarea
                  value={
                    formData.responsibilities || formData.description || ""
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      responsibilities: e.target.value,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="rounded-md"
                />
              </div>

              <div>
                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">
                  Requirements
                </Label>
                <Textarea
                  value={formData.requirement || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, requirement: e.target.value })
                  }
                  rows={4}
                  className="rounded-md"
                />
              </div>

              <div>
                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">
                  Application Information
                </Label>
                <Textarea
                  value={formData.applicationInformation || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      applicationInformation: e.target.value,
                    })
                  }
                  rows={3}
                  className="rounded-md"
                  placeholder="How to apply, what to include, etc."
                />
              </div>
            </fieldset>
          </form>
        </ModalBody>

        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <CustomModalFooter
            onClose={onClose}
            isEditMode={isEditMode}
            submitText={isEditMode ? "Synchronize Record" : "Deploy Vacancy"}
            cancelText={isViewMode ? "Close" : "Discard"}
            formId="vacancy-form"
            hideSubmit={isViewMode}
            hideBorder={true}
          />
        </div>
      </Modal>

      {cropImageSrc && (
        <ImageCropperModal
          isOpen={isCropModalOpen}
          onClose={() => {
            setIsCropModalOpen(false);
            setCropImageSrc(null);
            setSelectedFile(null);
          }}
          imageSrc={cropImageSrc}
          onCropComplete={(croppedFile: File) => executeUpload(croppedFile)}
          onSkip={() => selectedFile && executeUpload(selectedFile)}
          aspectRatio={1}
        />
      )}
    </>
  );
};

export default VacancyFormModal;
