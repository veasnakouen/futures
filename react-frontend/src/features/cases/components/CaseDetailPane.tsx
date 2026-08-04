import React from "react";
import {
  Calendar,
  CheckCircle2,
  Edit3,
  Trash2,
  FileText,
  User,
  Briefcase,
} from "lucide-react";
import { Button, Badge } from "@/lib/flowbite-compat";
import { format } from "date-fns";

interface CaseDetailPaneProps {
  selectedCase: any | null;
  onResolve: (id: number) => void;
  onEdit: (kase: any) => void;
  onDelete: (id: number) => void;
}

export const CaseDetailPane: React.FC<CaseDetailPaneProps> = ({
  selectedCase,
  onResolve,
  onEdit,
  onDelete,
}) => {
  if (!selectedCase) {
    return (
      <div className="w-full lg:w-2/3 h-full bg-white dark:bg-gray-800 rounded-md shadow-sm flex flex-col items-center justify-center text-gray-400 p-8 border border-gray-100 dark:border-gray-700/60">
        <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-5 shadow-inner">
          <Briefcase size={40} className="text-gray-300 dark:text-gray-600" />
        </div>
        <h3 className="text-xl font-black dark:text-gray-300">No Case Selected</h3>
        <p className="text-sm mt-2 max-w-sm text-center font-medium">
          Select a case from the list on the left to view its full details, client information, and intervention history.
        </p>
      </div>
    );
  }

  const clientFullName = selectedCase.client?.firstName
    ? `${selectedCase.client.firstName} ${selectedCase.client.lastName || ""}`
    : selectedCase.clientName || "General Client";

  return (
    <div className="w-full lg:w-2/3 h-full bg-white dark:bg-gray-800 rounded-md shadow-sm flex flex-col overflow-hidden relative border border-gray-100 dark:border-gray-700/60">
      <div className="flex flex-col h-full animate-fade-in">
        {/* Header Bar */}
        <div className="p-6 md:p-8 border-b dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50 dark:bg-gray-900/50">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge
                color={selectedCase.status === "Closed" ? "gray" : "success"}
                size="sm"
                className="font-black uppercase tracking-widest"
              >
                {selectedCase.status}
              </Badge>
              <Badge
                color={selectedCase.priority === "High" ? "failure" : "info"}
                size="sm"
                className="font-black uppercase tracking-widest"
              >
                {selectedCase.priority} Priority
              </Badge>
            </div>
            <h2 className="text-2xl font-black dark:text-white">
              {selectedCase.subject}
            </h2>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <Calendar size={14} /> Created{" "}
              {selectedCase.createdAt
                ? format(new Date(selectedCase.createdAt), "MMM dd, yyyy")
                : "Recently"}
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            {selectedCase.status !== "Closed" && (
              <Button
                size="sm"
                color="success"
                onClick={() => onResolve(selectedCase.id)}
                className="rounded-md flex-1 md:flex-none shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 size={16} className="mr-2" /> Resolve
              </Button>
            )}
            <Button
              size="sm"
              color="light"
              onClick={() => onEdit(selectedCase)}
              className="rounded-md flex-1 md:flex-none"
            >
              <Edit3 size={16} className="mr-2" /> Edit
            </Button>
            <Button
              size="sm"
              color="failure"
              outline
              onClick={() => onDelete(selectedCase.id)}
              className="rounded-md border-none hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-500 transition-colors shrink-0"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Description */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                  Case Description
                </h4>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-md text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-sm shadow-sm ring-1 ring-black/5 dark:ring-white/5">
                  {selectedCase.description ||
                    "No detailed description provided for this case."}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                  Intervention Protocol
                </h4>
                <div className="flex items-center gap-4 p-5 rounded-md bg-white dark:bg-gray-800 shadow-sm ring-1 ring-black/5 dark:ring-white/5">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0 shadow-inner">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="font-black dark:text-white text-base">
                      {selectedCase.serviceType}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      Assigned service track for this intervention.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Profile Card */}
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                  Client Profile
                </h4>
                <div className="p-6 rounded-md bg-white dark:bg-gray-800 text-center shadow-sm ring-1 ring-black/5 dark:ring-white/5">
                  <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 mx-auto flex items-center justify-center text-gray-400 mb-4 shadow-inner">
                    <User size={32} />
                  </div>
                  <p className="font-black dark:text-white text-base truncate">
                    {clientFullName}
                  </p>
                  <p className="text-xs text-gray-500 font-mono mt-1 font-bold">
                    ID: {selectedCase.client?.clientCode || `CLI-${selectedCase.clientId || selectedCase.id}`}
                  </p>
                  <Button
                    size="sm"
                    color="light"
                    className="w-full mt-6 rounded-md text-xs font-bold uppercase tracking-widest text-gray-500"
                  >
                    Full Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetailPane;
