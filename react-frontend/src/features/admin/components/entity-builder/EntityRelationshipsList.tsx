import React from "react";
import { Link as LinkIcon, Stethoscope, Users, GraduationCap, FolderKanban, Receipt, Package } from "lucide-react";
import { EntityRelationship } from "@/features/admin/hooks/entity-builder/useEntityRelationshipsState";

export const CORE_SYSTEM_TARGETS = [
  { key: "PATIENTS", label: "Clinic Patients", icon: <Stethoscope size={14} /> },
  { key: "USERS", label: "Users & Staff", icon: <Users size={14} /> },
  { key: "STUDENTS", label: "School Students", icon: <GraduationCap size={14} /> },
  { key: "CASES", label: "Cases & Workflows", icon: <FolderKanban size={14} /> },
  { key: "INVOICES", label: "Billing & Invoices", icon: <Receipt size={14} /> },
  { key: "POS_PRODUCTS", label: "POS Products", icon: <Package size={14} /> },
];

interface Props {
  activeRels: EntityRelationship[];
}

export default function EntityRelationshipsList({ activeRels }: Props) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
        <LinkIcon size={14} className="text-indigo-500" /> Dynamic Cross-Entity Relationships ({activeRels.length})
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {activeRels.map((rel) => {
          const targetObj = CORE_SYSTEM_TARGETS.find((t) => t.key === rel.targetEntityKey);
          return (
            <div
              key={rel.id}
              className="p-4 rounded-xl bg-gray-50/80 dark:bg-gray-700/40 border border-gray-100/60 dark:border-gray-800/30 flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">
                  {rel.relationshipType}
                </span>
                <h5 className="font-bold text-xs text-gray-900 dark:text-white mt-0.5">
                  {rel.relationshipName}
                </h5>
                <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                  Linked to: <span className="font-bold text-gray-700 dark:text-gray-300">{targetObj?.label || rel.targetEntityKey}</span>
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <LinkIcon size={16} />
              </div>
            </div>
          );
        })}

        {activeRels.length === 0 && (
          <div className="col-span-3 p-4 rounded-xl border border-dashed text-center text-xs font-bold text-gray-400">
            No relationships mapped yet. Click "Map Relationship" to link this entity to Patients, Users, or Invoices.
          </div>
        )}
      </div>
    </div>
  );
}
