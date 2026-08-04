import React from "react";
import { Button } from "@/lib/flowbite-compat";
import { Sparkles, Eye, PlusCircle, RefreshCw } from "lucide-react";

interface Props {
  state: any;
}

export default function FieldBuilderHeaderBar({ state }: Props) {
  const {
    showLivePreview,
    setShowLivePreview,
    setShowCreateModal,
    fetchFields,
    selectedEntityType,
    loading,
  } = state;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-sm">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <Sparkles className="text-indigo-600 dark:text-indigo-400" size={28} />
          <span>No-Code Dynamic Custom Field Builder</span>
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
          Extend domain schemas at runtime. Add custom properties to Users, Cases, Inventory, Students, and Invoices without code deployment.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          color="light"
          onClick={() => setShowLivePreview(!showLivePreview)}
          className="rounded-xl font-bold border-gray-200 dark:border-gray-700 cursor-pointer"
        >
          <Eye size={18} className="mr-2 text-indigo-600 dark:text-indigo-400" />
          <span>{showLivePreview ? "Hide Form Preview" : "Show Form Preview"}</span>
        </Button>
        <Button
          color="blue"
          onClick={() => setShowCreateModal(true)}
          className="rounded-xl font-bold cursor-pointer"
        >
          <PlusCircle size={18} className="mr-2" />
          <span>Add Custom Field</span>
        </Button>
        <Button
          color="gray"
          onClick={() => fetchFields(selectedEntityType)}
          className="rounded-xl cursor-pointer"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </Button>
      </div>
    </div>
  );
}
