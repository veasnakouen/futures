import React from "react";
import api from "@/services/api";
import toast from "react-hot-toast";
import { uploadToCloudinary } from "@/utils/cloudinary";
import {
  Button,
  Badge,
  Modal,
  ModalBody,
  ModalFooter,
  Label,
  TextInput,
  Textarea,
  Select,
  Alert,
  ToggleSwitch,
} from "@/lib/flowbite-compat";
import DatePicker from "@/components/common/DatePicker";
import { format } from "date-fns";
import { X, Edit, Trash2 } from "lucide-react";
import ConfirmModal from "@/components/common/ConfirmModal";
import ClientRegistrationModal from "@/features/clients/components/ClientRegistrationModal";

export function ClientProfileModals({ state }: { state: any }) {
  const {
    id,
    isPlacementModalOpen,
    setIsPlacementModalOpen,
    isEditMode,
    placementForm,
    setPlacementForm,
    placementTypes,
    setIsManagePlacementTypesOpen,
    handleAddPlacement,
    isSupportModalOpen,
    setIsSupportModalOpen,
    cases,
    setIsManageCasesOpen,
    supportForm,
    setSupportForm,
    handleAddSupport,
    isEducationModalOpen,
    setIsEducationModalOpen,
    educationForm,
    setEducationForm,
    setIsManageLevelsOpen,
    educationLevels,
    handleAddEducation,
    isCaseWorkerModalOpen,
    setIsCaseWorkerModalOpen,
    handleSaveWorker,
    editingWorkerId,
    setEditingWorkerId,
    workerForm,
    setWorkerForm,
    caseWorkers,
    handleDeleteWorker,
    isSocialSupportCaseModalOpen,
    setIsSocialSupportCaseModalOpen,
    editingSsCaseId,
    setEditingSsCaseId,
    ssCaseForm,
    setSsCaseForm,
    handleSaveSsCase,
    isClientModalOpen,
    setIsClientModalOpen,
    clientForm,
    setClientForm,
    fetchProfile,
    isConfirmOpen,
    setIsConfirmOpen,
    confirmDeleteItem,
    isManagePlacementTypesOpen,
    newPlacementTypeName,
    setNewPlacementTypeName,
    handleAddPlacementType,
    placementCategories,
    editingPlacementTypeIndex,
    setEditingPlacementTypeIndex,
    editingPlacementTypeValue,
    setEditingPlacementTypeValue,
    handleEditPlacementType,
    handleDeletePlacementType,
    isManageLevelsOpen,
    newLevelName,
    setNewLevelName,
    handleAddLevel,
    editingLevelIndex,
    setEditingLevelIndex,
    editingLevelValue,
    setEditingLevelValue,
    handleEditLevel,
    handleDeleteLevel,
  }: any = state;

  return (
    <>
      {/* Placement Modal */}
      <Modal
        show={isPlacementModalOpen}
        onClose={() => setIsPlacementModalOpen(false)}
        size="lg"
        className="date-picker-modal"
        theme={{
          root: {
            base: "fixed inset-0 z-50 h-modal h-screen overflow-visible flex items-start pt-16 sm:pt-24 justify-center",
            show: {
              on: "flex bg-gray-900/50 dark:bg-gray-900/80",
              off: "hidden",
            },
          },
          content: {
            base: "relative h-auto w-full p-4",
            inner:
              "relative flex max-h-[90dvh] flex-col rounded-md bg-white shadow dark:bg-gray-700 !overflow-visible",
          },
        }}
      >
        <div className="flex justify-between items-center p-5 border-b rounded-t-md bg-white dark:bg-gray-800">
          <h3 className="text-xl font-bold dark:text-white">
            {isEditMode ? "Update Placement" : "Record New Placement"}
          </h3>
          <button
            type="button"
            onClick={() => setIsPlacementModalOpen(false)}
            className="flex h-8 w-8 min-w-[2rem] min-h-[2rem] shrink-0 aspect-square items-center justify-center rounded-full p-0 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:rotate-90 hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          >
            <X size={16} />
          </button>
        </div>
        <ModalBody className="p-8 bg-white dark:bg-gray-800 !overflow-visible relative z-50">
          <form onSubmit={handleAddPlacement} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="mb-1 block">Company Name</Label>
                <TextInput
                  required
                  value={placementForm.companyName}
                  onChange={(e) =>
                    setPlacementForm({
                      ...placementForm,
                      companyName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label className="mb-1 block">Start Date</Label>
                <DatePicker
                  value={
                    placementForm.placementDate
                      ? new Date(
                          placementForm.placementDate.split(" ")[0].split("T")[0]
                        )
                      : new Date()
                  }
                  onChange={(date) =>
                    setPlacementForm({
                      ...placementForm,
                      placementDate: format(date, "yyyy-MM-dd"),
                    })
                  }
                  placeholder="Select Start Date..."
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label className="block">Placement Type</Label>
                  <button
                    type="button"
                    onClick={() => setIsManagePlacementTypesOpen(true)}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
                  >
                    Manage Types
                  </button>
                </div>
                <Select
                  value={placementForm.placementType}
                  onChange={(e) =>
                    setPlacementForm({
                      ...placementForm,
                      placementType: e.target.value,
                    })
                  }
                >
                  {placementTypes.map((type: string) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label className="mb-1 block">Monthly Salary</Label>
                <TextInput
                  value={placementForm.salary}
                  onChange={(e) =>
                    setPlacementForm({
                      ...placementForm,
                      salary: e.target.value,
                    })
                  }
                  placeholder="e.g. $250"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="mb-1 block">Status</Label>
                <Select
                  value={placementForm.status}
                  onChange={(e) =>
                    setPlacementForm({
                      ...placementForm,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Resigned">Resigned</option>
                  <option value="Terminated">Terminated</option>
                </Select>
              </div>
            </div>
          </form>
        </ModalBody>
        <ModalFooter className="bg-gray-50 dark:bg-gray-800/50 border-t relative z-40 justify-end gap-3 !p-4">
          <Button
            outline
            color="gray"
            size="sm"
            onClick={() => setIsPlacementModalOpen(false)}
            className="rounded-md font-bold uppercase text-[10px] tracking-widest px-4"
          >
            Cancel
          </Button>
          <Button
            outline
            color="blue"
            size="sm"
            onClick={handleAddPlacement}
            className="rounded-md font-black uppercase text-[10px] tracking-widest px-4"
          >
            {isEditMode ? "Update Placement" : "Save Placement"}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Social Support Modal */}
      <Modal
        show={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        size="lg"
      >
        <div className="flex justify-between items-center p-5 border-b rounded-t-md bg-white dark:bg-gray-800">
          <h3 className="text-xl font-bold dark:text-white">
            {isEditMode ? "Update Assessment" : "New Support Entry"}
          </h3>
          <button
            type="button"
            onClick={() => setIsSupportModalOpen(false)}
            className="flex h-8 w-8 min-w-[2rem] min-h-[2rem] shrink-0 aspect-square items-center justify-center rounded-full p-0 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:rotate-90 hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          >
            <X size={16} />
          </button>
        </div>
        <ModalBody className="p-8 bg-white dark:bg-gray-800">
          <form onSubmit={handleAddSupport} className="space-y-6">
            <div className="space-y-4">
              {cases?.length === 0 ? (
                <div className="space-y-2">
                  <Alert color="warning" className="rounded-md">
                    <span>
                      This client does not have any active cases. Please click{" "}
                      <strong
                        className="cursor-pointer underline text-blue-600 dark:text-blue-400 hover:text-blue-800"
                        onClick={() => setIsManageCasesOpen(true)}
                      >
                        Manage Cases
                      </strong>{" "}
                      to open a new case for this client first.
                    </span>
                  </Alert>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label>Associated Case</Label>
                    <button
                      type="button"
                      onClick={() => setIsManageCasesOpen(true)}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
                    >
                      Manage Cases
                    </button>
                  </div>
                  <Select
                    value={supportForm.caseId}
                    onChange={(e) =>
                      setSupportForm({
                        ...supportForm,
                        caseId: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select case...</option>
                    {cases?.map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.serviceType}: {c.subject} (Case #{c.id})
                      </option>
                    ))}
                  </Select>
                </div>
              )}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                <ToggleSwitch
                  checked={supportForm.healthProblem}
                  label="Health Problem Detected?"
                  onChange={(checked) =>
                    setSupportForm({ ...supportForm, healthProblem: checked })
                  }
                  color="blue"
                />
              </div>
              {supportForm.healthProblem && (
                <Textarea
                  placeholder="Provide details about health issues and support provided..."
                  value={supportForm.healthProblemDetail}
                  onChange={(e) =>
                    setSupportForm({
                      ...supportForm,
                      healthProblemDetail: e.target.value,
                    })
                  }
                  rows={3}
                />
              )}

              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                <ToggleSwitch
                  checked={supportForm.drugProblem}
                  label="Drug Issue Detected?"
                  onChange={(checked) =>
                    setSupportForm({ ...supportForm, drugProblem: checked })
                  }
                  color="failure"
                />
              </div>
              {supportForm.drugProblem && (
                <Textarea
                  placeholder="Provide details about drug issues and support provided..."
                  value={supportForm.drugProblemDetail}
                  onChange={(e) =>
                    setSupportForm({
                      ...supportForm,
                      drugProblemDetail: e.target.value,
                    })
                  }
                  rows={3}
                />
              )}
            </div>
          </form>
        </ModalBody>
        <ModalFooter className="bg-gray-50 dark:bg-gray-800/50 border-t justify-end gap-3 !p-4">
          <Button
            outline
            color="gray"
            size="sm"
            onClick={() => setIsSupportModalOpen(false)}
            className="rounded-md font-bold uppercase text-[10px] tracking-widest px-4"
          >
            Cancel
          </Button>
          <Button
            outline
            color="blue"
            size="sm"
            onClick={handleAddSupport}
            disabled={cases?.length === 0}
            className="rounded-md font-black uppercase text-[10px] tracking-widest px-4"
          >
            {isEditMode ? "Update Record" : "Record Assessment"}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Client Registration Modal */}
      {isClientModalOpen && (
        <ClientRegistrationModal
          isOpen={isClientModalOpen}
          onClose={() => setIsClientModalOpen(false)}
          isEditMode={true}
          formData={clientForm}
          setFormData={setClientForm}
          handleSubmit={async (e) => {
            e.preventDefault();
            try {
              await api.put(`/clients/${id}`, clientForm);
              toast.success("Client profile updated successfully");
              setIsClientModalOpen(false);
              fetchProfile();
            } catch (err) {
              toast.error("Failed to update client profile");
            }
          }}
          handlePhotoChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              try {
                const url = await uploadToCloudinary(file);
                setClientForm((prev: any) => ({ ...prev, photo: url }));
              } catch (err) {
                toast.error("Failed to upload photo");
              }
            }
          }}
          clientId={id}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDeleteItem}
        title="Confirm Delete"
        message="Are you sure you want to remove this record? This action cannot be undone."
      />
    </>
  );
}
