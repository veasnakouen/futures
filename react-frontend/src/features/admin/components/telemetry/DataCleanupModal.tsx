import React from "react";
import { Modal, ModalBody, Select, Label } from "@/lib/flowbite-compat";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import { Trash2 } from "lucide-react";

interface Props {
  state: any;
}

export default function DataCleanupModal({ state }: Props) {
  const {
    showCleanupModal,
    setShowCleanupModal,
    cleanupTarget,
    cleanupRange,
    setCleanupRange,
    executeCleanup,
  } = state;

  if (!showCleanupModal) return null;

  return (
    <Modal show={showCleanupModal} onClose={() => setShowCleanupModal(false)} size="md">
      <CustomModalHeader
        title={`Execute Data Purge: ${cleanupTarget.toUpperCase()}`}
        subtitle="Permanent database maintenance & log reduction."
        icon={<Trash2 className="w-5 h-5 text-rose-500" />}
        onClose={() => setShowCleanupModal(false)}
      />
      <ModalBody className="p-6 space-y-4">
        {cleanupTarget !== "orphan" && (
          <div>
            <Label value="Log Age Purge Threshold" className="text-xs font-bold uppercase tracking-wider mb-1 block" />
            <Select value={cleanupRange} onChange={(e) => setCleanupRange(e.target.value)}>
              <option value="7days">Older than 7 days</option>
              <option value="30days">Older than 30 days</option>
              <option value="90days">Older than 90 days</option>
              <option value="all">All historical logs (Full Wipe)</option>
            </Select>
          </div>
        )}
        <p className="text-xs text-gray-500 font-bold">
          Warning: Purging data will permanently delete log records from the PostgreSQL database tables.
        </p>
      </ModalBody>
      <CustomModalFooter
        onClose={() => setShowCleanupModal(false)}
        onSubmit={executeCleanup}
        submitText="Execute Purge Operation"
      />
    </Modal>
  );
}
