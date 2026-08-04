import React from "react";
import { Sparkles, Plus } from "lucide-react";
import { useDynamicEntityBuilderState } from "@/features/admin/hooks/useDynamicEntityBuilderState";

import EntitySidebar from "./entity-builder/EntitySidebar";
import EntityDetailHeader from "./entity-builder/EntityDetailHeader";
import EntityRelationshipsList from "./entity-builder/EntityRelationshipsList";
import EntityRecordsTable from "./entity-builder/EntityRecordsTable";
import CreateEntityModal from "./entity-builder/CreateEntityModal";

export default function DynamicEntityBuilder() {
  const state = useDynamicEntityBuilderState();
  const {
    entities,
    relationships,
    records,
    selectedEntityKey,
    setSelectedEntityKey,
    setShowEntityModal,
    setShowRelationshipModal,
    setShowRecordModal,
  } = state;

  const activeEntity = entities.find((e) => e.entityKey === selectedEntityKey) || entities[0];
  const activeRels = relationships.filter((r) => r.sourceEntityKey === selectedEntityKey);
  const activeRecords = records.filter((r) => r.entityKey === selectedEntityKey);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest mb-3">
              <Sparkles size={14} /> Enterprise Schema Engine
            </div>
            <h1 className="text-3xl font-black tracking-tight">
              Dynamic Entity & Relationship Builder
            </h1>
            <p className="text-blue-100 text-sm mt-1 max-w-2xl font-medium">
              Create brand-new business entities at runtime. Link new custom entities to existing core system entities (Users, Patients, Students, Invoices, Cases) via Lookups.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowEntityModal(true)}
              className="px-5 py-3 bg-white text-blue-700 hover:bg-blue-50 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
            >
              <Plus size={16} /> Create Dynamic Entity
            </button>
          </div>
        </div>
      </div>

      {/* Entity Catalog Sidebar Grid */}
      <EntitySidebar
        entities={entities}
        relationships={relationships}
        records={records}
        selectedEntityKey={selectedEntityKey}
        onSelectEntity={setSelectedEntityKey}
      />

      {/* Selected Entity Workbench */}
      {activeEntity && (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl p-6 shadow-xl space-y-6">
          <EntityDetailHeader
            activeEntity={activeEntity}
            onOpenRelationshipModal={() => setShowRelationshipModal(true)}
            onOpenRecordModal={() => setShowRecordModal(true)}
          />

          <EntityRelationshipsList activeRels={activeRels} />

          <EntityRecordsTable activeRecords={activeRecords} entityLabel={activeEntity.entityLabel} />
        </div>
      )}

      {/* Modal Dialog */}
      <CreateEntityModal state={state} />
    </div>
  );
}
