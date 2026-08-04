import React from "react";
import { Label, TextInput, Checkbox, Button } from "@/lib/flowbite-compat";
import { ClipboardList, Plus, X } from "lucide-react";
import api from "@/services/api";

interface Props {
  formData: any;
  setFormData: (data: any) => void;
  state: any;
}

export default function Step3AssessmentInfo({ formData, setFormData, state }: Props) {
  const {
    expectedSupports,
    isAddingSupport,
    setIsAddingSupport,
    newSupportInput,
    setNewSupportInput,
    handleAddSupport,
    handleExpectedSupportChange,
  } = state;

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <ClipboardList className="text-purple-500" size={20} /> Assessment & Needs
        </h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="currentSituation" className="text-xs font-bold text-gray-500 mb-1 block">Current Situation</Label>
              <TextInput
                id="currentSituation"
                placeholder="e.g. Unemployed, Student..."
                value={formData.currentSituation || ""}
                onChange={(e) => setFormData({ ...formData, currentSituation: e.target.value })}
                className="rounded-md"
              />
            </div>
            <div>
              <Label htmlFor="hearBy" className="text-xs font-bold text-gray-500 mb-1 block">How did they hear about us?</Label>
              <TextInput
                id="hearBy"
                placeholder="e.g. Facebook, Friend, Poster..."
                value={formData.hearBy || ""}
                onChange={(e) => setFormData({ ...formData, hearBy: e.target.value })}
                className="rounded-md"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-md shadow-sm border border-gray-100 dark:border-gray-700/50">
            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">
              Expected Support
            </h4>

            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto custom-scrollbar pr-2 pl-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="furtherEducation"
                  checked={!!formData.furtherEducation}
                  onChange={(e) => setFormData({ ...formData, furtherEducation: e.target.checked })}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 rounded"
                />
                <Label htmlFor="furtherEducation" className="text-[15px] cursor-pointer text-gray-700 dark:text-gray-300">
                  Further Education (Meeting with social worker)
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="placement"
                  checked={!!formData.placement}
                  onChange={(e) => setFormData({ ...formData, placement: e.target.checked })}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 rounded"
                />
                <Label htmlFor="placement" className="text-[15px] cursor-pointer text-gray-700 dark:text-gray-300">
                  Placement (Skills assessment)
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="trainingFromFutures"
                  checked={!!formData.trainingFromFutures}
                  onChange={(e) => setFormData({ ...formData, trainingFromFutures: e.target.checked })}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 rounded"
                />
                <Label htmlFor="trainingFromFutures" className="text-[15px] cursor-pointer text-gray-700 dark:text-gray-300">
                  Futures Training
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="socialSupportRequired"
                  checked={!!formData.socialSupportRequired}
                  onChange={(e) => setFormData({ ...formData, socialSupportRequired: e.target.checked })}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 rounded"
                />
                <Label htmlFor="socialSupportRequired" className="text-[15px] cursor-pointer text-gray-700 dark:text-gray-300">
                  Social Support
                </Label>
              </div>

              {expectedSupports
                .filter(
                  (support: any) =>
                    !["Further Education", "Placement", "Futures Training", "Social Support"].some((core) =>
                      support.name.includes(core)
                    )
                )
                .map((support: any) => {
                  const isChecked = formData.expectedSupport?.includes(support.name);
                  return (
                    <div key={support.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={`support-${support.id}`}
                          checked={!!isChecked}
                          onChange={(e) => handleExpectedSupportChange(support.name, e.target.checked)}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500 rounded"
                        />
                        <Label htmlFor={`support-${support.id}`} className="text-[15px] cursor-pointer text-gray-700 dark:text-gray-300">
                          {support.name}
                        </Label>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          if (window.confirm(`Delete the custom option "${support.name}" permanently?`)) {
                            try {
                              await api.delete(`/lookups/expected-supports/${support.id}`);
                              handleExpectedSupportChange(support.name, false);
                            } catch (err) {
                              console.error("Failed to delete support option", err);
                            }
                          }
                        }}
                        className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
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
                <Button size="sm" color="blue" onClick={handleAddSupport} disabled={!newSupportInput.trim()}>
                  Add
                </Button>
                <Button size="sm" color="gray" onClick={() => setIsAddingSupport(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingSupport(true)}
                className="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Plus size={14} /> Add expected support option
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
