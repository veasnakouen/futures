import React from "react";
import { Modal, ModalBody, Label, TextInput, Select, FileInput } from "@/lib/flowbite-compat";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import { Building2 } from "lucide-react";

interface Props {
  state: any;
}

export default function EmployerModal({ state }: Props) {
  const {
    t,
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    isViewMode,
    formData,
    setFormData,
    jobCategories,
    handleSubmit,
    handleLogoChange,
    resetForm,
  } = state;

  if (!isModalOpen) return null;

  return (
    <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
      <CustomModalHeader
        title={isViewMode ? "Employer Record Details" : isEditMode ? "Update Employer Info" : "Register Partner Employer"}
        subtitle="Corporate Partner Directory & Placement Node"
        icon={<Building2 className="w-5 h-5" />}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
      />
      <ModalBody className="p-6 space-y-4">
        <form id="employerForm" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider mb-1 block">Company Name</Label>
              <TextInput
                id="name"
                disabled={isViewMode}
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Phnom Penh Tech Solutions"
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-xs font-bold uppercase tracking-wider mb-1 block">Job Category / Industry</Label>
              <Select
                id="category"
                disabled={isViewMode}
                value={formData.jobCategoryId}
                onChange={(e) => setFormData({ ...formData, jobCategoryId: e.target.value })}
              >
                <option value="">Select Industry...</option>
                {jobCategories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="contactPerson" className="text-xs font-bold uppercase tracking-wider mb-1 block">Contact Person</Label>
              <TextInput
                id="contactPerson"
                disabled={isViewMode}
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="e.g. Vannak Touch"
              />
            </div>

            <div>
              <Label htmlFor="contactPhone" className="text-xs font-bold uppercase tracking-wider mb-1 block">Contact Phone</Label>
              <TextInput
                id="contactPhone"
                disabled={isViewMode}
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="+855 12 999 888"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider mb-1 block">Corporate Email</Label>
              <TextInput
                id="email"
                type="email"
                disabled={isViewMode}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="hr@company.com.kh"
              />
            </div>

            <div>
              <Label htmlFor="status" className="text-xs font-bold uppercase tracking-wider mb-1 block">Partnership Status</Label>
              <Select
                id="status"
                disabled={isViewMode}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending Audit</option>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="address" className="text-xs font-bold uppercase tracking-wider mb-1 block">Company Address</Label>
            <TextInput
              id="address"
              disabled={isViewMode}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Vattanac Capital Tower, Floor 14..."
            />
          </div>

          {!isViewMode && (
            <div>
              <Label htmlFor="logo" className="text-xs font-bold uppercase tracking-wider mb-1 block">Company Logo</Label>
              <FileInput id="logo" accept="image/*" onChange={handleLogoChange} />
            </div>
          )}
        </form>
      </ModalBody>
      <CustomModalFooter
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        onSubmit={isViewMode ? undefined : handleSubmit as any}
        submitText={isEditMode ? "Save Changes" : "Register Employer"}
        hideSubmit={isViewMode}
      />
    </Modal>
  );
}
