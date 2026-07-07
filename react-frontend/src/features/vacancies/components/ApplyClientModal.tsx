import React from "react";
import {Modal, ModalBody, Button, Label, TextInput, Select} from '@/lib/flowbite-compat';
import DatePicker from '@/components/common/DatePicker';
import { format } from "date-fns";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import { X, UserPlus, Calendar, Briefcase, ChevronRight } from "lucide-react";

interface ApplyClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  vacancy: any;
  clients: any[];
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  placementDate: string;
  setPlacementDate: (date: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const ApplyClientModal: React.FC<ApplyClientModalProps> = ({
  isOpen,
  onClose,
  vacancy,
  clients,
  selectedClientId,
  setSelectedClientId,
  placementDate,
  setPlacementDate,
  handleSubmit,
}) => {
  return (
    <>
      <Modal
        show={isOpen}
        onClose={onClose}
        size="lg"
        theme={{
          content: {
            inner:
              "relative flex max-h-[90dvh] flex-col rounded-lg bg-white shadow dark:bg-gray-700 !overflow-visible",
          },
        }}
      >
        <CustomModalHeader
          title="Assign Candidate"
          subtitle={
            <span className="flex items-center gap-1 text-blue-600">
              <Briefcase size={10} /> {vacancy?.jobTitle} @{" "}
              {vacancy?.companyName}
            </span>
          }
          onClose={onClose}
        />

        <ModalBody className="p-8 dark:bg-gray-800">
          <form
            id="apply-client-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">
                Select Candidate Pool
              </Label>
              <Select
                required
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="rounded-md"
              >
                <option value="">Choose a client...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName} ({c.clientCode})
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">
                Planned Commencement
              </Label>
              <DatePicker
                value={placementDate ? new Date(placementDate) : null}
                onChange={(date) =>
                  setPlacementDate(format(date, "yyyy-MM-dd"))
                }
                placeholder="Select Deployment Date..."
              />
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border-blue-100 dark:border-blue-800 flex items-start gap-3">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-md shadow-sm text-blue-600">
                <UserPlus size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
                  Assignment Strategy
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  This action will create a new placement record for the
                  selected candidate within the enterprise network.
                </p>
              </div>
            </div>
          </form>
        </ModalBody>

        <div className="p-4 bg-gray-50 dark:bg-gray-800">
          <CustomModalFooter
            onClose={onClose}
            isEditMode={false}
            submitText={
              <>
                Execute Assignment{" "}
                <ChevronRight size={18} className="ml-2 inline" />
              </>
            }
            cancelText="Cancel"
            formId="apply-client-form"
          />
        </div>
      </Modal>
    </>
  );
};

export default ApplyClientModal;
