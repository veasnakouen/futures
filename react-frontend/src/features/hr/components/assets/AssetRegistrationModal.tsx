import React from "react";
import { Modal, ModalBody, ModalFooter, Button, TextInput, Label, Select, Checkbox } from "@/lib/flowbite-compat";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import DatePicker from "@/components/common/DatePicker";
import { UseFormReturn } from "react-hook-form";
import { AssetFormData } from "@/schemas/assetSchema";

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
        <ModalBody className="p-6 space-y-6">
          {/* Step Indicator Tabs */}
          <div className="flex border-b border-gray-100 dark:border-gray-700 mb-6">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`pb-3 px-4 text-xs font-black uppercase tracking-widest transition-all ${
                currentStep === 1
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              1. General Details
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className={`pb-3 px-4 text-xs font-black uppercase tracking-widest transition-all ${
                currentStep === 2
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              2. Financials & Warranty
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className={`pb-3 px-4 text-xs font-black uppercase tracking-widest transition-all ${
                currentStep === 3
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              3. Extended Spec
            </button>
          </div>

          {/* STEP 1: General Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
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

              <div>
                <Label htmlFor="imageUrl" className="text-xs font-bold mb-1 block">
                  Asset Hardware Photo
                </Label>
                <div className="flex items-center gap-4">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-12 h-12 rounded-lg object-cover ring-2 ring-blue-500/20"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 dark:file:bg-gray-800 dark:file:text-gray-300"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Financials & Warranty */}
          {currentStep === 2 && (
            <div className="space-y-4">
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
            </div>
          )}

          {/* STEP 3: Extended Spec */}
          {currentStep === 3 && (
            <div className="space-y-4">
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

              <div className="grid grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl cursor-pointer">
                  <Checkbox {...register("isReturnable")} />
                  <span className="text-xs font-bold">Returnable Asset</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl cursor-pointer">
                  <Checkbox {...register("isKit")} />
                  <span className="text-xs font-bold">Kit / Bundle Package</span>
                </label>
              </div>
            </div>
          )}
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
