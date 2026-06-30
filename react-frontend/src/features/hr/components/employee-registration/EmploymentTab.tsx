import React, { useState } from "react";
import {
  Label,
  TextInput,
  Select,
  Textarea,
  Button,
  Spinner,
} from '@/lib/flowbite-compat';
import { type UseFormReturn } from "react-hook-form";
import { type EmployeeFormData } from '../../../../schemas/employeeSchema';
import DatePickerField from "./DatePickerField";
import { useHRStore } from '../../../../store/hrStore';
import { Check, X, Wand2 } from "lucide-react";
import toast from "react-hot-toast";
import api from '../../../../services/api';

interface EmploymentTabProps {
  formMethods: UseFormReturn<EmployeeFormData>;
}

const EmploymentTab: React.FC<EmploymentTabProps> = ({ formMethods }) => {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = formMethods;
  const {
    globalPositions,
    globalDepartments,
    createDepartment,
    createPosition,
  } = useHRStore();

  const [generatingId, setGeneratingId] = useState(false);

  const [isCreatingDept, setIsCreatingDept] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const [savingDept, setSavingDept] = useState(false);

  const [isCreatingPos, setIsCreatingPos] = useState(false);
  const [newPosName, setNewPosName] = useState("");
  const [savingPos, setSavingPos] = useState(false);

  const selectedDepartment = watch("department");

  const filteredPositions = globalPositions?.filter((pos: any) => {
    if (!selectedDepartment) return true;
    const posName = typeof pos === "string" ? pos : pos.name || "";
    if (posName.includes("::")) {
      const deptPart = posName.split("::")[1].trim();
      return (
        deptPart.toLowerCase() === selectedDepartment.toLowerCase() ||
        deptPart.toLowerCase().includes(selectedDepartment.toLowerCase())
      );
    }
    return posName.toLowerCase().includes(selectedDepartment.toLowerCase());
  });

  const handleGenerateId = async () => {
    setGeneratingId(true);
    try {
      const res = await api.get("/employees/generate-id");
      setValue("idNo", res.data.idNo, { shouldValidate: true });
      toast.success("Staff ID generated");
    } catch (err) {
      toast.error("Failed to generate Staff ID");
    } finally {
      setGeneratingId(false);
    }
  };

  const handleCreateDepartment = async () => {
    if (!newDeptName.trim()) return;
    setSavingDept(true);
    try {
      await createDepartment(newDeptName.trim());
      setValue("department", newDeptName.trim());
      setIsCreatingDept(false);
      setNewDeptName("");
      toast.success("Department created");
    } catch (e) {
      toast.error("Failed to create department");
    } finally {
      setSavingDept(false);
    }
  };

  const handleCreatePosition = async () => {
    if (!newPosName.trim()) return;
    setSavingPos(true);
    try {
      // If a department is selected, automatically append it to match the backend convention
      const finalPosName = selectedDepartment
        ? `${newPosName.trim()} :: ${selectedDepartment}`
        : newPosName.trim();

      await createPosition(finalPosName);
      setValue("position", finalPosName);
      setIsCreatingPos(false);
      setNewPosName("");
      toast.success("Position created");
    } catch (e) {
      toast.error("Failed to create position");
    } finally {
      setSavingPos(false);
    }
  };

  // Extract register callbacks to wrap onChange
  const deptRegister = register("department");
  const posRegister = register("position");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">
            Official Staff ID
          </Label>
          <div className="flex gap-2">
            <TextInput {...register("idNo")} className="flex-1" />
            <Button
              color="light"
              onClick={handleGenerateId}
              disabled={generatingId}
              className="whitespace-nowrap px-2"
              title="Generate ID based on settings"
            >
              {generatingId ? (
                <Spinner size="sm" />
              ) : (
                <Wand2 size={16} className="text-blue-500 mr-1" />
              )}
              <span className="hidden sm:inline text-xs font-bold text-gray-600">
                Auto
              </span>
            </Button>
          </div>
          {errors.idNo && (
            <p className="text-[10px] font-bold text-red-500 mt-1">
              {errors.idNo.message}
            </p>
          )}
        </div>
        <DatePickerField label="Join Date" field="joinDate" control={control} />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">
            Department
          </Label>
          {isCreatingDept ? (
            <div className="flex items-center gap-2">
              <TextInput
                autoFocus
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
                placeholder="New department name..."
                className="flex-1"
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(), handleCreateDepartment())
                }
              />
              <Button
                color="success"
                size="sm"
                onClick={handleCreateDepartment}
                disabled={savingDept}
                className="px-2"
              >
                {savingDept ? <Spinner size="sm" /> : <Check size={16} />}
              </Button>
              <Button
                color="light"
                size="sm"
                onClick={() => {
                  setIsCreatingDept(false);
                  setValue("department", "");
                }}
                disabled={savingDept}
                className="px-2"
              >
                <X size={16} />
              </Button>
            </div>
          ) : (
            <Select
              {...deptRegister}
              onChange={(e) => {
                if (e.target.value === "__ADD_NEW__") {
                  setIsCreatingDept(true);
                  setValue("department", "");
                } else {
                  deptRegister.onChange(e);
                }
              }}
            >
              <option value="">Select Department...</option>
              {globalDepartments?.length > 0 ? (
                globalDepartments.map((dept: any) => (
                  <option key={dept.id} value={dept.name || dept}>
                    {dept.name || dept}
                  </option>
                ))
              ) : (
                <>
                  <option>General</option>
                  <option>IT</option>
                  <option>Social</option>
                  <option>Admin</option>
                  <option>Finance</option>
                </>
              )}
              <option value="__ADD_NEW__" className="font-bold text-blue-600">
                + Add New Department...
              </option>
            </Select>
          )}
        </div>
        <div>
          <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">
            Position / Title
          </Label>
          {isCreatingPos ? (
            <div className="flex items-center gap-2">
              <TextInput
                autoFocus
                value={newPosName}
                onChange={(e) => setNewPosName(e.target.value)}
                placeholder="New position name..."
                className="flex-1"
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(), handleCreatePosition())
                }
              />
              <Button
                color="success"
                size="sm"
                onClick={handleCreatePosition}
                disabled={savingPos}
                className="px-2"
              >
                {savingPos ? <Spinner size="sm" /> : <Check size={16} />}
              </Button>
              <Button
                color="light"
                size="sm"
                onClick={() => {
                  setIsCreatingPos(false);
                  setValue("position", "");
                }}
                disabled={savingPos}
                className="px-2"
              >
                <X size={16} />
              </Button>
            </div>
          ) : (
            <>
              <Select
                {...posRegister}
                onChange={(e) => {
                  if (e.target.value === "__ADD_NEW__") {
                    setIsCreatingPos(true);
                    setValue("position", "");
                  } else {
                    posRegister.onChange(e);
                  }
                }}
              >
                <option value="">Select Position...</option>
                {filteredPositions?.map((pos: any) => {
                  const originalName = pos.name || pos;
                  const displayName = originalName.includes("::")
                    ? originalName.split("::")[0].trim()
                    : originalName;
                  return (
                    <option key={pos.id || originalName} value={originalName}>
                      {displayName}
                    </option>
                  );
                })}
                <option value="__ADD_NEW__" className="font-bold text-blue-600">
                  + Add New Position...
                </option>
              </Select>
              {errors.position && (
                <p className="text-[10px] font-bold text-red-500 mt-1">
                  {errors.position.message}
                </p>
              )}
            </>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">
            Contract Type
          </Label>
          <Select {...register("contractType")}>
            <option>Full-Time</option>
            <option>Part-Time</option>
            <option>Contractor</option>
            <option>Intern</option>
          </Select>
        </div>
        <div>
          <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">
            Employment Status
          </Label>
          <Select {...register("status")}>
            <option>Active</option>
            <option>On Leave</option>
            <option>Probation</option>
            <option>Terminated</option>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <DatePickerField
          label="Contract Start Date"
          field="contractStartDate"
          control={control}
        />
        <DatePickerField
          label="Contract End Date"
          field="contractEndDate"
          control={control}
        />
        <DatePickerField
          label="Probation End Date"
          field="probationEndDate"
          control={control}
        />
      </div>
      <div>
        <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">
          Manager / Supervisor
        </Label>
        <TextInput
          {...register("manager")}
          placeholder="Enter manager name..."
        />
      </div>
      <div>
        <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">
          Internal Notes
        </Label>
        <Textarea {...register("note")} placeholder="Confidential notes..." />
      </div>
    </div>
  );
};

export default EmploymentTab;
