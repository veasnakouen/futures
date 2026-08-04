import React from "react";
import { Layers, Link as LinkIcon } from "lucide-react";
import { DynamicRecord } from "@/features/admin/hooks/entity-builder/useEntityRecordsState";

interface Props {
  activeRecords: DynamicRecord[];
  entityLabel: string;
}

export default function EntityRecordsTable({ activeRecords, entityLabel }: Props) {
  return (
    <div className="space-y-3 pt-4">
      <div className="flex justify-between items-center">
        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
          <Layers size={14} className="text-emerald-500" /> Active Dynamic Records ({activeRecords.length})
        </h4>
      </div>

      <div className="overflow-x-auto rounded-2xl border-none">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50/80 dark:bg-gray-800/50 text-[10px] font-black uppercase text-gray-400">
            <tr>
              <th className="p-3.5">Record Code</th>
              <th className="p-3.5">Record Title & Notes</th>
              <th className="p-3.5">Generic Properties (Status & Tags)</th>
              <th className="p-3.5">Linked System Entity (Foreign Key)</th>
              <th className="p-3.5">Created Date</th>
            </tr>
          </thead>
          <tbody className="text-xs font-medium">
            {activeRecords.map((rec) => {
              let parsedData: any = {};
              let parsedRel: any = {};
              try {
                parsedData = JSON.parse(rec.dataJson || "{}");
              } catch (e) {}
              try {
                parsedRel = JSON.parse(rec.relationsJson || "{}");
              } catch (e) {}

              const status = parsedData.status || "ACTIVE";
              const priority = parsedData.priority || "MEDIUM";
              const tagsList = Array.isArray(parsedData.tags) ? parsedData.tags : ["auto_create"];

              return (
                <tr key={rec.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-700/40 transition-colors">
                  <td className="p-3.5 font-bold font-mono text-indigo-600 dark:text-indigo-400">
                    {rec.recordCode}
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-900 dark:text-white">{parsedData.name || "Dynamic Record"}</p>
                      <span className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 rounded text-[9px] font-mono font-black uppercase">
                        {parsedData.dataType || "STRING"}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500">{parsedData.details || parsedData.plate || "Standard property values"}</p>
                  </td>
                  <td className="p-3.5 space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : status === "PENDING"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {status}
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          priority === "HIGH" || priority === "CRITICAL"
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        }`}
                      >
                        {priority}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 flex-wrap pt-0.5">
                      {tagsList.map((tag: string, idx: number) => (
                        <span key={idx} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded font-mono text-[9px]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5">
                    {parsedRel.targetName ? (
                      <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 font-bold rounded-lg text-[11px] inline-flex items-center gap-1">
                        <LinkIcon size={10} /> {parsedRel.targetName}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic text-[11px]">Unlinked</span>
                    )}
                  </td>
                  <td className="p-3.5 text-gray-400">
                    {rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : "Today"}
                  </td>
                </tr>
              );
            })}

            {activeRecords.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-xs font-bold text-gray-400">
                  No dynamic records created yet for {entityLabel}. Click "Add Record" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
