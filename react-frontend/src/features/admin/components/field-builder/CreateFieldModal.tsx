import React from "react";
import { Modal, ModalBody, Label, TextInput, Select, Checkbox } from "@/lib/flowbite-compat";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import { FIELD_TYPES } from "@/features/admin/hooks/useCustomFieldBuilderState";

interface Props {
  state: any;
}

export default function CreateFieldModal({ state }: Props) {
  const {
    showCreateModal,
    setShowCreateModal,
    selectedEntityType,
    newField,
    setNewField,
    handleCreateField,
  } = state;

  return (
    <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)} size="md">
      <CustomModalHeader
        title={`Add Custom Field: ${selectedEntityType}`}
        onClose={() => setShowCreateModal(false)}
      />
      <ModalBody className="space-y-4">
        <div>
          <Label htmlFor="fieldLabel" value="Field Display Label *" />
          <TextInput
            id="fieldLabel"
            value={newField.fieldLabel}
            onChange={(e) => {
              const label = e.target.value;
              const autoKey = label
                .toLowerCase()
                .replace(/[^a-zA-Z0-9\s]/g, "")
                .replace(/\s+/g, "_");
              setNewField({ ...newField, fieldLabel: label, fieldKey: autoKey });
            }}
            placeholder="e.g. Emergency Contact Phone"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="fieldKey" value="Field Key Identifier (Auto-generated)" />
          <TextInput
            id="fieldKey"
            value={newField.fieldKey}
            onChange={(e) => setNewField({ ...newField, fieldKey: e.target.value })}
            placeholder="e.g. emergency_contact_phone"
            className="mt-1 font-mono text-xs"
          />
        </div>

        <div>
          <Label htmlFor="fieldType" value="Data Type *" />
          <Select
            id="fieldType"
            value={newField.fieldType}
            onChange={(e) => setNewField({ ...newField, fieldType: e.target.value })}
            className="mt-1"
          >
            {FIELD_TYPES.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label} ({t.key})
              </option>
            ))}
          </Select>
        </div>

        {newField.fieldType === "SELECT" && (
          <div>
            <Label htmlFor="options" value="Dropdown Options (Comma separated)" />
            <TextInput
              id="options"
              value={newField.options}
              onChange={(e) => setNewField({ ...newField, options: e.target.value })}
              placeholder="Option A, Option B, Option C"
              className="mt-1"
            />
          </div>
        )}

        <div>
          <Label htmlFor="description" value="Field Description" />
          <TextInput
            id="description"
            value={newField.description}
            onChange={(e) => setNewField({ ...newField, description: e.target.value })}
            placeholder="e.g. Enter sponsor or guardian phone number"
            className="mt-1"
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Checkbox
            id="isRequired"
            checked={newField.isRequired}
            onChange={(e) => setNewField({ ...newField, isRequired: e.target.checked })}
          />
          <label htmlFor="isRequired" className="text-xs font-bold text-gray-700 dark:text-gray-300">
            Mark as Required Field
          </label>
        </div>
      </ModalBody>
      <CustomModalFooter
        onSubmit={handleCreateField}
        onClose={() => setShowCreateModal(false)}
        submitText="Save Field Definition"
      />
    </Modal>
  );
}
