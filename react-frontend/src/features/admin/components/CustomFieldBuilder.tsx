import React from "react";
import { useCustomFieldBuilderState } from "@/features/admin/hooks/useCustomFieldBuilderState";

import FieldBuilderHeaderBar from "./field-builder/FieldBuilderHeaderBar";
import EntitySelectorTabs from "./field-builder/EntitySelectorTabs";
import CustomFieldsList from "./field-builder/CustomFieldsList";
import LiveFormPreviewCard from "./field-builder/LiveFormPreviewCard";
import CreateFieldModal from "./field-builder/CreateFieldModal";

export const CustomFieldBuilder: React.FC = () => {
  const state = useCustomFieldBuilderState();

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header Banner & Global Action Triggers */}
      <FieldBuilderHeaderBar state={state} />

      {/* Target Entity Module Tab Selector Bar */}
      <EntitySelectorTabs state={state} />

      {/* Main Grid: Active Custom Fields List & Live UI Form Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Custom Fields Directory Cards */}
        <CustomFieldsList state={state} />

        {/* Live UI Form Preview Render Card */}
        <LiveFormPreviewCard state={state} />
      </div>

      {/* Create Custom Field Configuration Modal */}
      <CreateFieldModal state={state} />
    </div>
  );
};

export default CustomFieldBuilder;
