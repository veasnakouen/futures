import React from "react";
import { Modal, ModalBody, Button, Label, TextInput, Select, Checkbox, Textarea } from "@/lib/flowbite-compat";
import { X } from "lucide-react";

interface Props {
  state: any;
}

export default function LogbookEntryModal({ state }: Props) {
  const {
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    isViewMode,
    formData,
    setFormData,
    handleSubmit,
  } = state;

  return (
    <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <div className="flex justify-between items-center p-5 border-b rounded-t-md bg-white dark:bg-gray-800">
        <h3 className="text-xl font-bold dark:text-white">
          {isViewMode
            ? "Log Entry Details"
            : isEditMode
              ? "Edit Log Entry"
              : "Quick Log Entry"}
        </h3>
        <button
          type="button"
          onClick={() => setIsModalOpen(false)}
          className="flex h-8 w-8 min-w-[2rem] min-h-[2rem] shrink-0 aspect-square items-center justify-center rounded-full p-0 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:rotate-90 hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>
      <ModalBody className="p-0 dark:bg-gray-800">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1 block">Gender</Label>
                <Select
                  value={formData.gender}
                  onChange={(e: any) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  disabled={isViewMode}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </Select>
              </div>
              <div>
                <Label className="mb-1 block">Phone (Optional)</Label>
                <TextInput
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  disabled={isViewMode}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="block font-bold text-gray-400 uppercase text-[10px]">
                Services Accessed
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="c1"
                    checked={formData.usingComputer}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        usingComputer: e.target.checked,
                      })
                    }
                    disabled={isViewMode}
                  />{" "}
                  <Label htmlFor="c1" className="text-sm">
                    Using Computer
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="c2"
                    checked={formData.library}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        library: e.target.checked,
                      })
                    }
                    disabled={isViewMode}
                  />{" "}
                  <Label htmlFor="c2" className="text-sm">
                    Library Use
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="c3"
                    checked={formData.jobinformation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        jobinformation: e.target.checked,
                      })
                    }
                    disabled={isViewMode}
                  />{" "}
                  <Label htmlFor="c3" className="text-sm">
                    Job Information
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="c4"
                    checked={formData.futureService}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        futureService: e.target.checked,
                      })
                    }
                    disabled={isViewMode}
                  />{" "}
                  <Label htmlFor="c4" className="text-sm">
                    Future Service
                  </Label>
                </div>
              </div>
            </div>

            <div>
              <Label className="mb-1 block">Note</Label>
              <Textarea
                rows={3}
                placeholder="Additional details..."
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                disabled={isViewMode}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t mt-6 border-gray-100 dark:border-gray-700">
              <Button
                outline
                color={isViewMode ? "blue" : "gray"}
                size="sm"
                className={`rounded-md font-bold uppercase text-[10px] tracking-widest px-4 cursor-pointer ${
                  isViewMode ? "w-full" : ""
                }`}
                onClick={() => setIsModalOpen(false)}
              >
                {isViewMode ? "Close" : "Cancel"}
              </Button>
              {!isViewMode && (
                <Button
                  outline
                  color="blue"
                  type="submit"
                  size="sm"
                  className="rounded-md font-black uppercase text-[10px] tracking-widest px-4 cursor-pointer"
                >
                  {isEditMode ? "Update Log" : "Save Log Entry"}
                </Button>
              )}
            </div>
          </form>
        </div>
      </ModalBody>
    </Modal>
  );
}
