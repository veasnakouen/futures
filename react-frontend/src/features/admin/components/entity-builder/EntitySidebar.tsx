import React from "react";
import { Boxes, Link as LinkIcon, Layers } from "lucide-react";
import { CustomEntity } from "@/features/admin/hooks/entity-builder/useEntityStudioState";
import { EntityRelationship } from "@/features/admin/hooks/entity-builder/useEntityRelationshipsState";
import { DynamicRecord } from "@/features/admin/hooks/entity-builder/useEntityRecordsState";

interface Props {
  entities: CustomEntity[];
  relationships: EntityRelationship[];
  records: DynamicRecord[];
  selectedEntityKey: string;
  onSelectEntity: (key: string) => void;
}

export default function EntitySidebar({
  entities,
  relationships,
  records,
  selectedEntityKey,
  onSelectEntity,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {entities.map((entity) => {
        const isSelected = selectedEntityKey === entity.entityKey;
        const entityRelCount = relationships.filter((r) => r.sourceEntityKey === entity.entityKey).length;
        const entityRecordCount = records.filter((r) => r.entityKey === entity.entityKey).length;

        return (
          <div
            key={entity.id}
            onClick={() => onSelectEntity(entity.entityKey)}
            className={`cursor-pointer rounded-2xl p-5 transition-all shadow-md relative overflow-hidden ${
              isSelected
                ? "bg-white dark:bg-gray-800 ring-2 ring-blue-500 shadow-xl"
                : "bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black shadow-inner">
                <Boxes size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                {entity.category}
              </span>
            </div>

            <h3 className="font-black text-gray-900 dark:text-white text-base tracking-tight mb-1">
              {entity.entityLabel}
            </h3>

            <div className="flex items-center gap-1.5 flex-wrap my-2">
              <span className="px-1.5 py-0.5 bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 rounded font-mono text-[9px] font-bold">
                @Table({entity.tableName || "tb_" + entity.entityKey.toLowerCase()})
              </span>
              <span className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 rounded font-mono text-[9px] font-bold">
                {entity.idStrategy || "@Id"}
              </span>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 font-medium">
              {entity.description || "Custom dynamic entity model."}
            </p>

            <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 pt-3 border-t border-gray-100/80 dark:border-gray-800/40">
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <LinkIcon size={12} /> {entityRelCount} Relationships
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <Layers size={12} /> {entityRecordCount} Records
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
