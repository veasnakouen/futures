import React from "react";
import { createPortal } from "react-dom";
import { UploadCloud, FileCode, Sparkles, CheckCircle2, X } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  state: any;
}

export default function JsonLocationImporterModal({ state }: Props) {
  const {
    showJsonModal,
    setShowJsonModal,
    rawJsonText,
    setRawJsonText,
    parsedData,
    setParsedData,
    sampleJsonTemplate,
    parseAndSanitizeJson,
    handleFileUpload,
    handleExecuteImport,
  } = state;

  if (!showJsonModal) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/80 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950 text-blue-600 rounded-xl">
              <UploadCloud size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                JSON Location Importer & Data Cleaning Studio
              </h3>
              <p className="text-[11px] text-gray-500 font-medium">
                Upload or paste location hierarchy JSON to bulk import provinces, districts, and villages.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowJsonModal(false)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Drag & Drop Upload Zone */}
          <div className="border-2 border-dashed border-gray-200 dark:border-gray-700/80 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors bg-gray-50/50 dark:bg-gray-800/30">
            <UploadCloud size={32} className="mx-auto text-blue-500 mb-2" />
            <p className="text-xs font-bold text-gray-700 dark:text-gray-200">
              Drag and drop your Location JSON file (.json) or click to browse
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Supports nested or flat JSON location structures.
            </p>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
              id="json-file-input"
            />
            <label
              htmlFor="json-file-input"
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 font-bold text-xs rounded-xl hover:bg-blue-100 cursor-pointer transition-all"
            >
              <FileCode size={14} /> Browse Location JSON File
            </label>
          </div>

          {/* Raw JSON Input / Paste Textarea */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Or Paste Raw Location JSON:
              </label>
              <button
                type="button"
                onClick={() => {
                  setRawJsonText(sampleJsonTemplate);
                  parseAndSanitizeJson(sampleJsonTemplate);
                  toast.success("Loaded sample location JSON template!");
                }}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Sparkles size={12} /> Load Sample Template
              </button>
            </div>
            <textarea
              rows={6}
              value={rawJsonText}
              onChange={(e) => {
                setRawJsonText(e.target.value);
                if (e.target.value.trim()) {
                  parseAndSanitizeJson(e.target.value);
                } else {
                  setParsedData(null);
                }
              }}
              placeholder='Paste JSON array e.g. [{"nameEn": "Battambang", "postcode": "2000", "districts": [...]}]'
              className="w-full p-3 bg-gray-900 text-emerald-400 rounded-xl font-mono text-xs border border-gray-800 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Data Cleaning & Parsed Health Summary */}
          {parsedData && (
            <div className="p-4 bg-blue-50/60 dark:bg-blue-950/40 rounded-2xl border border-blue-100 dark:border-blue-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-500" /> Structure Validated & Sanitized:
                </span>
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-full">
                  Ready to Import
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                  <span className="text-lg font-black text-gray-900 dark:text-white">
                    {parsedData.provinces.length}
                  </span>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Provinces</p>
                </div>
                <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                  <span className="text-lg font-black text-gray-900 dark:text-white">
                    {parsedData.districts.length}
                  </span>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Districts</p>
                </div>
                <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                  <span className="text-lg font-black text-gray-900 dark:text-white">
                    {parsedData.communes.length}
                  </span>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Communes</p>
                </div>
                <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                  <span className="text-lg font-black text-gray-900 dark:text-white">
                    {parsedData.villages.length}
                  </span>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Villages</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/80 dark:bg-gray-800/50">
          <button
            type="button"
            onClick={() => setShowJsonModal(false)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleExecuteImport}
            disabled={!parsedData || parsedData.provinces.length === 0}
            className={`px-5 py-2.5 rounded-xl text-xs font-black text-white shadow-md transition-all flex items-center gap-1.5 ${
              parsedData && parsedData.provinces.length > 0
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20"
                : "bg-gray-400 opacity-50 cursor-not-allowed"
            }`}
          >
            <CheckCircle2 size={16} /> Clean Structure & Bulk Import Locations
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
