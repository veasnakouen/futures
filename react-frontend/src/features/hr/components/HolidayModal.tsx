import React from "react";
import {Modal, ModalBody, Button, Label, TextInput, Select, Textarea} from '@/lib/flowbite-compat';
import DatePicker from '@/components/common/DatePicker';
import { format } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import { X, Calendar, Info, Plus } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  holidaySchema,
  type HolidayFormData,
} from '@/schemas/holidaySchema';

interface HolidayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HolidayFormData) => void;
}

const HolidayModal: React.FC<HolidayModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit: hookSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<HolidayFormData>({
    resolver: zodResolver(holidaySchema),
    defaultValues: {
      name: "",
      date: new Date().toISOString().split("T")[0],
      type: "Mandatory",
      description: "",
    },
  });

  const handleFormSubmit = (data: HolidayFormData) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <CustomModalHeader
        title="Register Holiday"
        subtitle="Human Resources Calendar"
        onClose={onClose}
      />
      <ModalBody className="dark:bg-gray-800 p-8">
        <form
          id="holiday-form"
          onSubmit={hookSubmit(handleFormSubmit)}
          className="space-y-6"
        >
          <div className="space-y-1.5">
            <Label className="font-black text-[10px] uppercase text-gray-400 tracking-widest ml-1">
              Holiday Name
            </Label>
            <TextInput
              placeholder="e.g. Khmer New Year"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-[10px] font-bold text-red-500 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <Label className="font-black text-[10px] uppercase text-gray-400 tracking-widest ml-1">
                Event Date
              </Label>
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <DatePicker
                    value={field.value ? new Date(field.value) : new Date()}
                    onChange={(date) =>
                      field.onChange(format(date, "yyyy-MM-dd"))
                    }
                    placeholder="Select date..."
                  />
                )}
              />
              {errors.date && (
                <p className="text-[10px] font-bold text-red-500 mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="font-black text-[10px] uppercase text-gray-400 tracking-widest ml-1">
                Category
              </Label>
              <Select {...register("type")}>
                <option value="Mandatory">Mandatory</option>
                <option value="Corporate">Corporate</option>
                <option value="Optional">Optional</option>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="font-black text-[10px] uppercase text-gray-400 tracking-widest ml-1">
              Description / Notes
            </Label>
            <Textarea
              placeholder="Briefly describe the holiday or event..."
              {...register("description")}
              rows={3}
            />
          </div>
        </form>
      </ModalBody>
      <div className="p-4 bg-gray-50 dark:bg-gray-800">
        <CustomModalFooter
          onClose={onClose}
          isEditMode={false}
          submitText="Commit to Roster"
          formId="holiday-form"
        />
      </div>
    </Modal>
  );
};

export default HolidayModal;
