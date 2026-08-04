import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Avatar } from "@/lib/flowbite-compat";
import { Printer } from "lucide-react";
import { toast } from "react-hot-toast";

interface Props {
  vacancy: any;
  state: any;
}

export default function JobWorkspaceDocumentModal({ vacancy, state }: Props) {
  const {
    isDocModalOpen,
    setIsDocModalOpen,
    selectedApplicant,
    updateApplicationStatus,
  } = state;

  return (
    <Modal
      show={isDocModalOpen}
      onClose={() => setIsDocModalOpen(false)}
      size="4xl"
    >
      <ModalHeader>Document Generation Hub</ModalHeader>
      <ModalBody>
        {selectedApplicant && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                  Target Position
                </h4>
                <p className="font-bold text-sm dark:text-white uppercase">
                  {vacancy.jobPositionName}
                </p>
                <p className="text-xs text-gray-500">
                  {vacancy.employerName}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                  Client Profile
                </h4>
                <div className="flex items-center gap-3 mb-2">
                  <Avatar size="md" rounded />
                  <div>
                    <p className="font-bold text-sm dark:text-white uppercase">
                      {selectedApplicant.client?.firstName}{" "}
                      {selectedApplicant.client?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedApplicant.client?.clientCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Auto-Generated Cover Letter
                  </span>
                </div>
                <div className="p-6">
                  <textarea
                    className="w-full h-48 border-none focus:ring-0 resize-none bg-transparent dark:text-white text-sm font-medium leading-relaxed"
                    defaultValue={`Dear Hiring Manager at ${vacancy.employerName || "the Company"},\n\nI am writing to express my strong interest in the ${vacancy.jobPositionName || "open"} position. With my background and skills, I am confident in my ability to contribute effectively to your team.\n\nMy experience aligns well with the requirements for this role, particularly in areas matching your needs. I am highly motivated and eager to bring my expertise to ${vacancy.employerName || "your organization"}.\n\nThank you for considering my application. I look forward to discussing how I can add value to your team.\n\nSincerely,\n${selectedApplicant.client?.firstName} ${selectedApplicant.client?.lastName}`}
                  />
                </div>
              </div>

              <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Auto-Generated CV Preview
                  </span>
                </div>
                <div className="p-6">
                  <div className="border-b pb-4 mb-4 border-gray-100 dark:border-gray-800">
                    <h1 className="text-2xl font-black uppercase tracking-tight dark:text-white">
                      {selectedApplicant.client?.firstName}{" "}
                      {selectedApplicant.client?.lastName}
                    </h1>
                    <p className="text-sm text-gray-500">
                      {selectedApplicant.client?.email} |{" "}
                      {selectedApplicant.client?.contactPhone}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                        Professional Summary
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        A dedicated and skilled professional looking to excel as a {vacancy.jobPositionName}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </ModalBody>
      <ModalFooter className="justify-end gap-3">
        <Button color="gray" onClick={() => setIsDocModalOpen(false)}>
          Cancel
        </Button>
        <Button
          color="blue"
          onClick={() => {
            toast.success("Documents exported to PDF");
            setIsDocModalOpen(false);
            updateApplicationStatus(selectedApplicant.id, "APPLIED");
          }}
        >
          <Printer size={16} className="mr-2" /> Print & Apply
        </Button>
      </ModalFooter>
    </Modal>
  );
}
