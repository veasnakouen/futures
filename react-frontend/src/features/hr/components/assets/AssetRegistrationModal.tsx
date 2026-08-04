import React from "react";
import { Modal, ModalBody, TextInput, Label, Select, Checkbox } from "@/lib/flowbite-compat";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import DatePicker from "@/components/common/DatePicker";
import { UseFormReturn } from "react-hook-form";
import { AssetFormData } from "@/schemas/assetSchema";
import { QrCode, Layers, ShieldCheck, FileText, Sparkles } from "lucide-react";

interface AssetRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  form: UseFormReturn<AssetFormData>;
  assetCategories: string[];
  onSubmit: (data: AssetFormData) => void;
  isProcessing: boolean;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AssetRegistrationModal: React.FC<AssetRegistrationModalProps> = ({
  isOpen,
  onClose,
  isEditMode,
  currentStep,
  setCurrentStep,
  form,
  assetCategories,
  onSubmit,
  isProcessing,
  handleImageChange,
}) => {
  if (!isOpen) return null;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const imageUrl = watch("imageUrl");
  const purchaseDate = watch("purchaseDate");
  const warrantyExpiryDate = watch("warrantyExpiryDate");

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl">
      <CustomModalHeader
        title={isEditMode ? "Update Hardware Node" : "Register Hardware Asset"}
        subtitle={
          isEditMode
            ? "Modify system specification and audit attributes"
            : "Add new hardware node to central inventory ledger"
        }
        onClose={onClose}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="p-6">
          {/* Step Indicator Tabs */}
          <div className="flex border-b border-gray-100 dark:border-gray-700 mb-6">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`pb-3 px-4 text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                currentStep === 1
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              1. General Details
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className={`pb-3 px-4 text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                currentStep === 2
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              2. Financials & Warranty
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className={`pb-3 px-4 text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                currentStep === 3
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              3. Extended Spec
            </button>
          </div>

          {/* Consistent Fixed-Height Container to Prevent Layout Shifts */}
          <div className="min-h-[385px] flex flex-col justify-between">
            {/* STEP 1: General Details */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-xs font-bold mb-1 block">
                      Asset Name *
                    </Label>
                    <TextInput
                      id="name"
                      placeholder="e.g. MacBook Pro M3 Max"
                      {...register("name")}
                      color={errors.name ? "failure" : undefined}
                    />
                    {errors.name && (
                      <p className="text-[10px] text-red-500 font-bold mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="serialNumber" className="text-xs font-bold mb-1 block">
                      Serial Number *
                    </Label>
                    <TextInput
                      id="serialNumber"
                      placeholder="e.g. C02G1234MD6R"
                      {...register("serialNumber")}
                      color={errors.serialNumber ? "failure" : undefined}
                    />
                    {errors.serialNumber && (
                      <p className="text-[10px] text-red-500 font-bold mt-1">
                        {errors.serialNumber.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="assetType" className="text-xs font-bold mb-1 block">
                      Asset Category *
                    </Label>
                    <Select id="assetType" {...register("assetType")}>
                      {assetCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-xs font-bold mb-1 block">
                      Initial Status
                    </Label>
                    <Select id="status" {...register("status")}>
                      <option value="Available">Available (In Stock)</option>
                      <option value="Assigned">Assigned (In Use)</option>
                      <option value="Maintenance">Maintenance / Repair</option>
                      <option value="Decommissioned">Decommissioned</option>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brand" className="text-xs font-bold mb-1 block">
                      Brand / Manufacturer
                    </Label>
                    <TextInput id="brand" placeholder="e.g. Apple, Dell, HP" {...register("brand")} />
                  </div>
                  <div>
                    <Label htmlFor="modelNumber" className="text-xs font-bold mb-1 block">
                      Model Number
                    </Label>
                    <TextInput id="modelNumber" placeholder="e.g. A2992" {...register("modelNumber")} />
                  </div>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700/50">
                  <Label htmlFor="imageUrl" className="text-xs font-bold mb-2 block">
                    Asset Hardware Photo
                  </Label>
                  <div className="flex items-center gap-4">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-14 h-14 rounded-xl object-cover ring-2 ring-blue-500/20 shadow-xs shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gray-200/80 dark:bg-gray-700/80 flex items-center justify-center text-gray-400 shrink-0 text-xs font-bold">
                        No Photo
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                      />
                      <p className="text-[10px] text-gray-400 mt-1">
                        High-resolution JPG or PNG for identification tag preview.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Financials & Warranty */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vendor" className="text-xs font-bold mb-1 block">
                      Vendor / Supplier
                    </Label>
                    <TextInput id="vendor" placeholder="e.g. iStore Direct" {...register("vendor")} />
                  </div>
                  <div>
                    <Label htmlFor="purchaseCost" className="text-xs font-bold mb-1 block">
                      Purchase Cost ($)
                    </Label>
                    <TextInput
                      id="purchaseCost"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...register("purchaseCost", { valueAsNumber: true })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-bold mb-1 block">Purchase Date</Label>
                    <DatePicker
                      value={purchaseDate ? new Date(purchaseDate) : null}
                      onChange={(date: Date) =>
                        setValue("purchaseDate", date ? date.toISOString().split("T")[0] : "")
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-bold mb-1 block">Warranty Expiry Date</Label>
                    <DatePicker
                      value={warrantyExpiryDate ? new Date(warrantyExpiryDate) : null}
                      onChange={(date: Date) =>
                        setValue("warrantyExpiryDate", date ? date.toISOString().split("T")[0] : "")
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="acquisitionType" className="text-xs font-bold mb-1 block">
                      Acquisition Channel
                    </Label>
                    <Select id="acquisitionType" {...register("acquisitionType")}>
                      <option value="Purchased">Direct Purchased</option>
                      <option value="Leased">Commercial Lease</option>
                      <option value="Donated">Grant / Partner Donation</option>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="assetCondition" className="text-xs font-bold mb-1 block">
                      Hardware Condition
                    </Label>
                    <Select id="assetCondition" {...register("assetCondition")}>
                      <option value="New">Brand New</option>
                      <option value="Good">Good Working Order</option>
                      <option value="Fair">Fair / Minor Wear</option>
                      <option value="Damaged">Needs Service</option>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="costCenter" className="text-xs font-bold mb-1 block">
                      Cost Center / Dept Allocation
                    </Label>
                    <TextInput id="costCenter" placeholder="e.g. IT-OPS-01" {...register("costCenter")} />
                  </div>
                  <div>
                    <Label htmlFor="usefulLifeYears" className="text-xs font-bold mb-1 block">
                      Estimated Useful Life (Years)
                    </Label>
                    <TextInput
                      id="usefulLifeYears"
                      type="number"
                      placeholder="e.g. 4"
                      {...register("usefulLifeYears", { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Extended Spec & Internal Controls */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="barcode" className="text-xs font-bold mb-1 block">
                      Barcode Tag ID
                    </Label>
                    <TextInput id="barcode" placeholder="e.g. BC-994821" {...register("barcode")} />
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-xs font-bold mb-1 block">
                      Storage Node / Room Location
                    </Label>
                    <TextInput id="location" placeholder="e.g. IT Rack B-04" {...register("location")} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="productFamily" className="text-xs font-bold mb-1 block">
                      Architecture / Product Family
                    </Label>
                    <TextInput id="productFamily" placeholder="e.g. Apple Silicon, ARM64, x86_64" {...register("productFamily")} />
                  </div>
                  <div>
                    <Label htmlFor="donorOrPartnerName" className="text-xs font-bold mb-1 block">
                      Donor / Partner Organization
                    </Label>
                    <TextInput id="donorOrPartnerName" placeholder="Optional for grant assets" {...register("donorOrPartnerName")} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl cursor-pointer hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-800">
                    <Checkbox {...register("isReturnable")} />
                    <div>
                      <span className="text-xs font-black block text-gray-800 dark:text-gray-200">Returnable Asset</span>
                      <span className="text-[10px] text-gray-400 block">Must be returned on offboarding</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl cursor-pointer hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-800">
                    <Checkbox {...register("isKit")} />
                    <div>
                      <span className="text-xs font-black block text-gray-800 dark:text-gray-200">Kit / Bundle Package</span>
                      <span className="text-[10px] text-gray-400 block">Includes bundled peripherals</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl cursor-pointer hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-800">
                    <Checkbox {...register("isIntangible")} />
                    <div>
                      <span className="text-xs font-black block text-gray-800 dark:text-gray-200">Digital / Cloud Asset</span>
                      <span className="text-[10px] text-gray-400 block">Software seat or intangible license</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl cursor-pointer hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-800">
                    <Checkbox {...register("isActive")} />
                    <div>
                      <span className="text-xs font-black block text-gray-800 dark:text-gray-200">Active Audit Node</span>
                      <span className="text-[10px] text-gray-400 block">Tracked in live ledger balance</span>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>
        </ModalBody>

        <CustomModalFooter
          onClose={onClose}
          isEditMode={isEditMode}
          submitText={isEditMode ? "Update Asset Record" : "Commit Asset to Stock"}
          submitDisabled={isProcessing}
        />
      </form>
    </Modal>
  );
};

export default AssetRegistrationModal;

