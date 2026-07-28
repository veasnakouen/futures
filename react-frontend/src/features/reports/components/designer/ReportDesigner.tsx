import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Plus, Database } from "lucide-react";
import { toast } from "react-hot-toast";
import DataSourceManagerModal from "./DataSourceManagerModal";

export interface ReportDesignerProps {
  [key: string]: any;
}

export default function ReportDesigner(props: ReportDesignerProps) {
  const [reportTitle, setReportTitle] = useState(props.customTitle || "Custom Analytics Report");
  const [isDsModalOpen, setIsDsModalOpen] = useState(false);
  const [selectedDs, setSelectedDs] = useState<any>(null);
  const [columns, setColumns] = useState<string[]>(["ID", "Created_At", "Status", "Total"]);

  const handleAddColumn = () => {
    const colName = prompt("Enter new column field key:");
    if (colName) setColumns((prev) => [...prev, colName]);
  };

  const handleSaveReport = () => {
    toast.success("Report template saved successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border">
        <div>
          <h2 className="text-base font-black dark:text-white uppercase">{reportTitle}</h2>
          <p className="text-[10px] font-bold text-gray-400">Layout Studio & Query Designer</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setIsDsModalOpen(true)} className="text-xs font-bold">
            <Database size={14} className="mr-1" /> Data Source
          </Button>
          <Button size="sm" onClick={handleSaveReport} className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs">
            <Save size={14} className="mr-1" /> Save Template
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 bg-white dark:bg-gray-800 p-4 rounded-xl border space-y-4 text-xs">
          <h4 className="font-black uppercase text-gray-400">Available Components</h4>
          <div className="space-y-2">
            <button onClick={handleAddColumn} className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 rounded-lg font-bold text-left hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2">
              <Plus size={14} /> Add Data Column
            </button>
          </div>
        </div>

        <div className="md:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl border space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <span className="text-xs font-black uppercase text-gray-400">Canvas Preview</span>
            {selectedDs && <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Source: {selectedDs.name}</span>}
          </div>

          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 border-b">
                <tr>
                  {columns.map((c, i) => (
                    <th key={i} className="p-3 border-r">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y text-gray-400">
                <tr>
                  {columns.map((_, i) => (
                    <td key={i} className="p-3 border-r italic text-[10px]">Data Sample</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DataSourceManagerModal isOpen={isDsModalOpen} onClose={() => setIsDsModalOpen(false)} onSelectSource={setSelectedDs} />
    </div>
  );
}
