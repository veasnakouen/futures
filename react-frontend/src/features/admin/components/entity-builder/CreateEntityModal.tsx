import React from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Boxes, X, Sparkles } from "lucide-react";
import EntityStudioTabs from "./EntityStudioTabs";

interface Props {
  state: any;
}

export default function CreateEntityModal({ state }: Props) {
  const {
    showEntityModal,
    setShowEntityModal,
    entityStudioTab,
    setEntityStudioTab,
    applyPresetTemplate,
    entityFields,
    entityMethods,
    handleCreateEntity,
  } = state;

  if (!showEntityModal || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-3xl w-full max-w-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border border-gray-100/80 dark:border-gray-800/50 flex flex-col max-h-[85vh] overflow-hidden"
      >
        {/* FIXED MODAL HEADER */}
        <div className="flex-none p-6 pb-4 border-b border-gray-100/80 dark:border-gray-800/40 space-y-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black shadow-inner">
                <Boxes size={20} />
              </div>
              <div>
                <h3 className="font-black text-lg text-gray-900 dark:text-white tracking-tight">
                  Spring Boot JPA Entity Studio
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  Design Java Spring Boot @Entity classes with JPA annotations, field rules, and live code generator.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowEntityModal(false)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Template Presets Bar */}
          <div className="flex items-center justify-between bg-blue-50/60 dark:bg-blue-950/40 p-2.5 px-3 rounded-2xl border border-blue-100 dark:border-blue-900/40">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
              <Sparkles size={14} /> 1-Click Spring Boot Presets:
            </span>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => applyPresetTemplate("USER")}
                className="px-3 py-1 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-300 hover:bg-blue-100 font-bold text-[11px] rounded-lg shadow-sm transition-all"
              >
                AspNetUsers (@Table)
              </button>
              <button
                type="button"
                onClick={() => applyPresetTemplate("EQUIPMENT")}
                className="px-3 py-1 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-300 hover:bg-blue-100 font-bold text-[11px] rounded-lg shadow-sm transition-all"
              >
                Medical Equipment
              </button>
              <button
                type="button"
                onClick={() => applyPresetTemplate("VEHICLE")}
                className="px-3 py-1 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-300 hover:bg-blue-100 font-bold text-[11px] rounded-lg shadow-sm transition-all"
              >
                Vehicle Fleet Log
              </button>
            </div>
          </div>

          {/* Sub-Tab Navigation */}
          <div className="flex border-b border-gray-100/80 dark:border-gray-800/40 gap-4 pt-1 flex-wrap">
            <button
              type="button"
              onClick={() => setEntityStudioTab("DIRECTIVES")}
              className={`pb-2 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${entityStudioTab === "DIRECTIVES"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
            >
              1. JPA Directives
            </button>
            <button
              type="button"
              onClick={() => setEntityStudioTab("FIELDS")}
              className={`pb-2 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${entityStudioTab === "FIELDS"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
            >
              2. Fields ({entityFields.length})
            </button>
            <button
              type="button"
              onClick={() => setEntityStudioTab("METHODS")}
              className={`pb-2 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${entityStudioTab === "METHODS"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
            >
              3. Custom Methods ({entityMethods.length})
            </button>
            <button
              type="button"
              onClick={() => setEntityStudioTab("CODE_PREVIEW")}
              className={`pb-2 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${entityStudioTab === "CODE_PREVIEW"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
            >
              4. Generated Source (.java)
            </button>
          </div>
        </div>

        {/* SCROLLABLE MODAL BODY */}
        <form id="createEntityForm" onSubmit={handleCreateEntity} className="flex-1 overflow-y-auto p-6 space-y-4">
          <EntityStudioTabs state={state} />
        </form>

        {/* FIXED FOOTER */}
        <div className="flex-none p-4 px-6 border-t border-gray-100/80 dark:border-gray-800/40 bg-gray-50/80 dark:bg-gray-900/80 flex justify-between items-center">
          <span className="text-xs text-gray-500 font-medium">
            Generating JPA Annotations for PostgreSQL/MySQL schema.
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowEntityModal(false)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="createEntityForm"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all"
            >
              Save Dynamic Entity Class
            </button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
