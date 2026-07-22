import React, { useEffect, useState } from "react";
import { Modal, Select, Label, Button } from "@/lib/flowbite-compat";
import { useForm, Controller, useWatch } from "react-hook-form";
import { ShiftScheduleDto } from "../../../services/scheduleService";
import { useAllEmployees } from "../../../hooks/useHR";
import { useScheduling } from "../../../hooks/useScheduling";
import { useAnnualLeavePlan } from "../../../hooks/useLeaves";
import { Input } from "@/components/ui/input";
interface ShiftScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  initialData?: ShiftScheduleDto | null;
}

const shiftOptions = ["Mon-Sat(Morning)", "Mon-Fri(Full)", "Morning", "Afternoon", "Night", "Off"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthKeys = ["janShift", "febShift", "marShift", "aprShift", "mayShift", "junShift", "julShift", "augShift", "sepShift", "octShift", "novShift", "decShift"] as const;

import { MonthlyALCalendarModal } from "./MonthlyALCalendarModal";

const MonthPlanInput: React.FC<{ value: string; onChange: (val: string) => void; year: number; monthIndex: number; }> = ({ value, onChange, year, monthIndex }) => {
  const [pattern, setPattern] = useState("");
  const [alInfo, setAlInfo] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (value) {
      const parts = value.split(" | AL: ");
      setPattern(parts[0] || "");
      if (parts.length > 1) {
        setAlInfo(parts[1]);
      } else {
        setAlInfo("");
      }
    } else {
      setPattern("");
      setAlInfo("");
    }
  }, [value]);

  const handlePatternChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPattern = e.target.value;
    setPattern(newPattern);
    onChange(newPattern + (alInfo ? ` | AL: ${alInfo}` : ""));
  };

  const handleAlSave = (newAlInfo: string) => {
    setAlInfo(newAlInfo);
    onChange(pattern + (newAlInfo ? ` | AL: ${newAlInfo}` : ""));
  };

  const calcAlDays = (alString?: string | null) => {
    if (!alString) return 0;
    const parts = alString.split(",").map(s => s.trim());
    let total = 0;
    parts.forEach(p => {
      if (p.includes("(AM)") || p.includes("(PM)")) total += 0.5;
      else if (p) total += 1;
    });
    return total;
  };

  const totalDays = calcAlDays(alInfo);

  return (
    <div className="flex flex-col gap-1 relative">
      <Select value={pattern} onChange={handlePatternChange} className="text-xs">
        <option value="">None</option>
        {shiftOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </Select>
      <Button 
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsModalOpen(true);
        }}
        color="light" 
        size="xs"
        className="text-[10px] justify-start py-0 px-2 h-8 text-blue-600 font-bold border-blue-200 bg-blue-50 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 w-full overflow-hidden text-ellipsis whitespace-nowrap"
      >
        📅 {alInfo ? `AL: ${totalDays} Day${totalDays !== 1 ? 's' : ''}` : "Plan AL Dates"}
      </Button>
      
      <MonthlyALCalendarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAlSave}
        year={year}
        monthIndex={monthIndex}
        initialAlString={alInfo}
      />
    </div>
  );
};

export const ShiftScheduleModal: React.FC<ShiftScheduleModalProps> = ({
  isOpen,
  onClose,
  year,
  initialData,
}) => {
  const { control, handleSubmit, reset } = useForm<ShiftScheduleDto>({
    defaultValues: {
      scheduleYear: year,
    },
  });

  const { data: employees = [] } = useAllEmployees();
  const { useCreateSchedule, useUpdateSchedule } = useScheduling();
  const createMutation = useCreateSchedule();
  const updateMutation = useUpdateSchedule();

  const selectedYear = useWatch({ control, name: "scheduleYear" }) || year;
  const selectedEmployeeId = useWatch({ control, name: "employeeId" });
  
  const { data: alPlan } = useAnnualLeavePlan(selectedEmployeeId, selectedYear);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({ scheduleYear: year });
      }
    }
  }, [isOpen, initialData, year, reset]);

  const onSubmit = async (data: ShiftScheduleDto) => {
    if (initialData?.id) {
      await updateMutation.mutateAsync({ id: initialData.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="4xl">
      <Modal.Header>{initialData ? "Edit Yearly Shift Plan" : "New Yearly Shift Plan"}</Modal.Header>
      <Modal.Body>
        <form id="shift-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="employeeId" value="Staff Member" />
              </div>
              <Controller
                name="employeeId"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select {...field} disabled={!!initialData}>
                    <option value="">Select an employee...</option>
                    {employees.map((emp) => (
                      <option key={emp.idNo} value={emp.idNo}>
                        {emp.firstNameEnglish} {emp.lastNameEnglish} ({emp.idNo})
                      </option>
                    ))}
                  </Select>
                )}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="scheduleYear" value="Year" />
              </div>
              <Controller
                name="scheduleYear"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input
                    type="number"
                    value={field.value}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    min={2000}
                    max={2100}
                  />
                )}
              />
            </div>
          </div>


          
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-6 border-t pt-6">
            {monthKeys.map((key, index) => (
              <div key={key}>
                <div className="mb-2 block">
                  <Label htmlFor={key} value={`${months[index]} Shift`} />
                </div>
                <Controller
                  name={key}
                  control={control}
                  render={({ field }) => (
                    <MonthPlanInput 
                      value={field.value || ""} 
                      onChange={field.onChange}
                      year={selectedYear}
                      monthIndex={index}
                    />
                  )}
                />
              </div>
            ))}
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="submit"
          form="shift-form"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Plan"}
        </Button>
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
