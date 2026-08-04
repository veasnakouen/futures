import React from "react";
import { ArrowRightLeft, Plus } from "lucide-react";
import { CustomEntity } from "@/features/admin/hooks/entity-builder/useEntityStudioState";

interface Props {
  activeEntity: CustomEntity;
  onOpenRelationshipModal: () => void;
  onOpenRecordModal: () => void;
}

export default function EntityDetailHeader({
  activeEntity,
  onOpenRelationshipModal,
  onOpenRecordModal,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-100/80 dark:border-gray-800/40">
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
            {activeEntity.entityLabel} Workbench
          </h2>
          <span className="text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            {activeEntity.entityKey}
          </span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300">
            @Table(name = "{activeEntity.tableName || "AspNetUsers"}")
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
          Manage relationship mappings to core entities & record instances.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onOpenRelationshipModal}
          className="px-4 py-2.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
        >
          <ArrowRightLeft size={14} /> Map Relationship
        </button>

        <button
          onClick={onOpenRecordModal}
          className="px-4 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 font-black text-xs uppercase tracking-widest rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
        >
          <Plus size={14} /> Add Record
        </button>
      </div>
    </div>
  );
}
