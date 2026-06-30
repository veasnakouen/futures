import React, { useEffect } from "react";
import {
  Modal,
  ModalBody,
  Button,
  Select,
  TextInput,
  Textarea,
  Label,
} from '@/lib/flowbite-compat';
import DatePicker from '@/components/common/DatePicker';
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import { useForm, Controller } from "react-hook-form";
import {
  X,
  Ticket,
  User,
  Building2,
  Phone,
  Calendar,
  AlertCircle,
  FileText,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
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
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormData>({
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

  const selectedRequesterId = watch("requesterId");
  const selectedUser = users?.find(
    (u) =>
      u.id.toString() === selectedRequesterId?.toString() ||
      u.userName === selectedRequesterId?.toString(),
  );

  // Auto-generate ticket number for display (can be overwritten by backend)
  const displayTicketNo = initialData?.id
    ? `0${initialData.id}`
    : "TKT-" + Math.floor(1000 + Math.random() * 9000);

  useEffect(() => {
    if (isOpen && initialData) {
      // Find requester ID from resolutionNotes hack if needed, or default
      let matchedRequesterId = "";
      if (
        initialData.resolutionNotes &&
        initialData.resolutionNotes.includes("Requester:")
      ) {
        const match = initialData.resolutionNotes.match(
          /Requester:\s+(.*?)\s+\|/,
        );
        if (match && match[1] && users) {
          const fullName = match[1].toLowerCase();
          const u = users.find(
            (u) =>
              fullName ===
                `${u.firstName?.toLowerCase()} ${u.lastName?.toLowerCase()}` ||
              fullName.includes(u.firstName?.toLowerCase() || "") ||
              fullName.includes(u.lastName?.toLowerCase() || ""),
          );
          if (u) matchedRequesterId = u.id?.toString() || u.userName;
        }
      }

      reset({
        requesterId: matchedRequesterId,
        ticketType: initialData.category || "Question",
        priority: initialData.priority || "Level 2",
        ticketDate: initialData.createdAt
          ? format(new Date(initialData.createdAt), "yyyy-MM-dd")
          : format(new Date(), "yyyy-MM-dd"),
        status: initialData.status || "New Ticket",
        subject: initialData.title || "",
        description: initialData.description || "",
      });
    } else if (isOpen) {
      reset({
        requesterId: "",
        ticketType: "Question",
        priority: "Level 2",
        ticketDate: format(new Date(), "yyyy-MM-dd"),
        status: "New Ticket",
        subject: "",
        description: "",
      });
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = async (data: TicketFormData) => {
    const payload = {
      title: data.subject,
      description: data.description,
      status: data.status,
      priority: data.priority,
      category: data.ticketType,
      // For now, we will send the reporter details in resolutionNotes to avoid complex User mapping if it fails
      resolutionNotes: `Requester: ${selectedUser?.firstName} ${selectedUser?.lastName} | Branch: ${selectedUser?.branch || "N/A"} | Email: ${selectedUser?.email || "N/A"}`,
    };

    if (initialData?.id) {
      await onSubmit(payload, initialData.id);
    } else {
      await onSubmit(payload);
    }
    onClose();
  };

  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      size="4xl"
      theme={{
        content: {
          inner:
            "relative flex max-h-[90dvh] flex-col rounded-lg bg-white shadow dark:bg-gray-700 !overflow-visible",
        },
      }}
    >
      <CustomModalHeader
        title={
          initialData
            ? "Ticket Information (Edit Mode)"
            : "Ticket Information (Insert Mode)"
        }
        subtitle="Tickets System Module"
        onClose={onClose}
      />
      <ModalBody className="p-0 dark:bg-gray-800 bg-gray-50/30">
        <form
          id="ticket-form"
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 pb-0 space-y-6"
        >
          {/* Requester Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-sm border border-gray-100 dark:border-gray-700">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
              Select Requester
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">
                  Requester name *
                </Label>
                <Controller
                  name="requesterId"
                  control={control}
                  rules={{ required: "Requester is required" }}
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      options={
                        users?.map((u) => ({
                          value: u.id || u.userName,
                          label: `${u.firstName} ${u.lastName} (@${u.userName})`,
                        })) || []
                      }
                      placeholder="Select a user..."
                      value={users
                        ?.map((u) => ({
                          value: u.id || u.userName,
                          label: `${u.firstName} ${u.lastName} (@${u.userName})`,
                        }))
                        .find((c) => c.value === field.value)}
                      onChange={(val: any) => field.onChange(val?.value)}
                      isSearchable
                      className="text-sm font-bold"
                      classNames={{
                        control: (state) =>
                          "bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-lg border",
                        menu: () =>
                          "bg-white dark:bg-gray-800 dark:border-gray-700 shadow-lg rounded-lg mt-1 border",
                        option: (state) =>
                          `hover:bg-blue-50 dark:hover:bg-gray-700 p-2 cursor-pointer ${state.isSelected ? "bg-blue-100 dark:bg-gray-600" : "text-gray-900 dark:text-gray-100"}`,
                        singleValue: () => "text-gray-900 dark:text-white",
                        input: () => "text-gray-900 dark:text-white",
                        placeholder: () => "text-gray-500 dark:text-gray-400",
                      }}
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: "42px",
                          backgroundColor: "transparent",
                          boxShadow: "none",
                        }),
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                      menuPortalTarget={document.body}
                    />
                  )}
                />
                {errors.requesterId && (
                  <span className="text-red-500 text-[10px] font-bold uppercase mt-1 block">
                    {errors.requesterId.message}
                  </span>
                )}
              </div>
              <div>
                <Label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">
                  Department / Branch
                </Label>
                <TextInput
                  icon={Building2}
                  value={selectedUser?.branch || ""}
                  readOnly
                  className="bg-gray-50 font-bold"
                />
              </div>
              <div>
                <Label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">
                  Contact Email
                </Label>
                <TextInput
                  icon={Phone}
                  value={selectedUser?.email || ""}
                  readOnly
                  className="bg-gray-50 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Ticket Details Section */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-sm shadow-sm border border-gray-100 dark:border-gray-700">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
              Ticket description
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div>
                <Label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">
                  Ticket No.
                </Label>
                <TextInput
                  icon={Ticket}
                  value={displayTicketNo}
                  readOnly
                  className="bg-gray-50 font-bold font-mono text-blue-600"
                />
              </div>
              <div>
                <Label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">
                  Ticket Type
                </Label>
                <Controller
                  name="ticketType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      icon={HelpCircle}
                      className="font-bold text-sm"
                    >
                      <option value="Question">Question</option>
                      <option value="Incident">Incident</option>
                      <option value="Problem">Problem</option>
                      <option value="Request Assessment">
                        Request Assessment
                      </option>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">
                  Priority
                </Label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      icon={AlertCircle}
                      className="font-bold text-sm"
                    >
                      <option value="Level 1">Level 1 (Low)</option>
                      <option value="Level 2">Level 2 (Medium)</option>
                      <option value="Level 3">Level 3 (High)</option>
                      <option value="Critical">Critical</option>
                    </Select>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <Label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">
                  Ticket Date
                </Label>
                <Controller
                  name="ticketDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value ? new Date(field.value) : new Date()}
                      onChange={(date) =>
                        field.onChange(format(date, "yyyy-MM-dd"))
                      }
                      placeholder="Select Date..."
                    />
                  )}
                />
              </div>
              <div>
                <Label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">
                  Status
                </Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      icon={CheckCircle}
                      className="font-bold text-sm"
                    >
                      <option value="New Ticket">New Ticket</option>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Subject and Description */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-sm border border-gray-100 dark:border-gray-700 space-y-3">
            <div>
              <Label className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase mb-2 block tracking-widest">
                Subject *
              </Label>
              <Controller
                name="subject"
                control={control}
                rules={{ required: "Subject is required" }}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    placeholder="Brief summary of the issue..."
                    className="font-bold"
                  />
                )}
              />
              {errors.subject && (
                <span className="text-red-500 text-[10px] font-bold uppercase mt-1 block">
                  {errors.subject.message}
                </span>
              )}
            </div>
            <div>
              <Label className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase mb-1 block tracking-widest">
                Issue description *
              </Label>
              <Controller
                name="description"
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="Detailed explanation of the issue, steps to reproduce, etc."
                    rows={6}
                    className="font-medium p-4 resize-none"
                  />
                )}
              />
              {errors.description && (
                <span className="text-red-500 text-[10px] font-bold uppercase mt-1 block">
                  {errors.description.message}
                </span>
              )}
            </div>
          </div>
        </form>
      </ModalBody>
      <div className="p-2 bg-gray-50 dark:bg-gray-800">
        <CustomModalFooter
          onClose={onClose}
          isEditMode={!!initialData}
          submitText={isSubmitting ? "Saving..." : "Save Ticket"}
          formId="ticket-form"
          cancelText="Close"
        />
      </div>
    </Modal>
  );
};

export default TicketCreationModal;
