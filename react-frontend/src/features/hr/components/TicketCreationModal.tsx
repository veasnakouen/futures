import React, { useEffect } from "react";
import { Modal, ModalBody, Button, Select, TextInput, Textarea, Label } from '@/lib/flowbite-compat';
import DatePicker from '@/components/common/DatePicker';
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import { useForm, Controller } from "react-hook-form";
import { Ticket, User, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import ReactSelect from "react-select";

interface TicketCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any, id?: number) => Promise<void>;
  users: any[];
  initialData?: any | null;
}

interface TicketFormData {
  requesterId: string;
  ticketType: string;
  priority: string;
  ticketDate: string;
  status: string;
  subject: string;
  description: string;
}

const TicketCreationModal: React.FC<TicketCreationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  users,
  initialData,
}) => {
  const { control, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm<TicketFormData>({
    defaultValues: {
      requesterId: "",
      ticketType: "Question",
      priority: "Level 2",
      ticketDate: format(new Date(), "yyyy-MM-dd"),
      status: "New Ticket",
      subject: "",
      description: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setValue("requesterId", initialData.requesterId || "");
        setValue("ticketType", initialData.ticketType || "Question");
        setValue("priority", initialData.priority || "Level 2");
        setValue("ticketDate", initialData.ticketDate || format(new Date(), "yyyy-MM-dd"));
        setValue("status", initialData.status || "New Ticket");
        setValue("subject", initialData.subject || "");
        setValue("description", initialData.description || "");
      } else {
        reset();
      }
    }
  }, [isOpen, initialData, setValue, reset]);

  const onFormSubmit = async (data: TicketFormData) => {
    await onSubmit(data, initialData?.id);
    onClose();
  };

  const userOptions = users.map((u) => ({
    value: u.id || u.username,
    label: `${u.firstName || ""} ${u.lastName || u.username}`.trim(),
  }));

  return (
    <Modal show={isOpen} onClose={onClose} size="4xl">
      <CustomModalHeader title={initialData ? "Edit Support Ticket" : "Create New Support Ticket"} subtitle="Support & Ticket Routing" onClose={onClose} />
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <ModalBody className="p-6 bg-gray-50 dark:bg-gray-900 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-[10px] font-bold uppercase text-gray-400 mb-1 block">Ticket Requester</Label>
              <Controller
                name="requesterId"
                control={control}
                render={({ field }) => (
                  <ReactSelect
                    options={userOptions}
                    value={userOptions.find((o) => o.value === field.value) || null}
                    onChange={(val: any) => field.onChange(val ? val.value : "")}
                    placeholder="Select requester..."
                    className="text-xs"
                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 99999 }) }}
                  />
                )}
              />
            </div>
            <div>
              <Label className="text-[10px] font-bold uppercase text-gray-400 mb-1 block">Ticket Category</Label>
              <Controller
                name="ticketType"
                control={control}
                render={({ field }) => (
                  <Select sizing="sm" {...field}>
                    <option value="Question">General Inquiry</option>
                    <option value="Incident">Technical Incident</option>
                    <option value="Problem">Hardware Fault</option>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-[10px] font-bold uppercase text-gray-400 mb-1 block">Priority Level</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select sizing="sm" {...field}>
                    <option value="Level 1">Level 1 - Low Priority</option>
                    <option value="Level 2">Level 2 - Medium Priority</option>
                    <option value="Level 3">Level 3 - Critical Priority</option>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label className="text-[10px] font-bold uppercase text-gray-400 mb-1 block">Ticket Date</Label>
              <Controller
                name="ticketDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={field.value ? new Date(field.value) : new Date()}
                    onChange={(d: Date | null) => field.onChange(d ? d.toISOString().split("T")[0] : "")}
                    className="w-full text-xs h-9"
                  />
                )}
              />
            </div>
          </div>

          <div>
            <Label className="text-[10px] font-bold uppercase text-gray-400 mb-1 block">Subject Title</Label>
            <Controller
              name="subject"
              control={control}
              render={({ field }) => <TextInput sizing="sm" placeholder="e.g. Printer connectivity issue in Level 2" {...field} />}
            />
          </div>

          <div>
            <Label className="text-[10px] font-bold uppercase text-gray-400 mb-1 block">Detailed Description</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => <Textarea rows={4} placeholder="Describe the issue in detail..." {...field} />}
            />
          </div>
        </ModalBody>
        <CustomModalFooter onClose={onClose} submitText={initialData ? "Update Ticket" : "Create Ticket"} />
      </form>
    </Modal>
  );
};

export default TicketCreationModal;
