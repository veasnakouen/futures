import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sliders, Sparkles } from "lucide-react";
import {
  BG_PRESETS,
  FORM_PRESETS,
  type BgStyleMode,
  type FormStyleMode,
} from "@/features/auth/hooks/useLoginPageState";

interface Props {
  state: any;
}

export default function LoginPagePresetsToolbar({ state }: Props) {
  const {
    showControlPanel,
    setShowControlPanel,
    bgStyle,
    selectBgStyle,
    formStyle,
    selectFormStyle,
  } = state;

  return (
    <div className="absolute top-6 right-6 z-30">
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowControlPanel(!showControlPanel)}
          className="flex items-center gap-2.5 px-4 py-2.5 bg-white/10 dark:bg-gray-900/70 backdrop-blur-2xl border border-white/20 dark:border-gray-700/60 rounded-2xl text-xs font-black text-white hover:bg-white/20 dark:hover:bg-gray-800 transition-all shadow-xl hover:shadow-indigo-500/20 active:scale-95 cursor-pointer"
        >
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span>3D Theme Customizer</span>
        </button>

        <AnimatePresence>
          {showControlPanel && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-80 p-4 bg-gray-950/95 backdrop-blur-3xl border border-white/15 rounded-3xl shadow-2xl space-y-4 z-40"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                  <Sparkles size={12} /> Super Admin 3D Options
                </span>
                <button
                  onClick={() => setShowControlPanel(false)}
                  className="text-gray-400 hover:text-white text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Background Canvas Mode Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Canvas Background Mode
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {BG_PRESETS.map((preset) => {
                    const Icon = preset.icon;
                    const isSelected = bgStyle === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => selectBgStyle(preset.id as BgStyleMode)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? "bg-indigo-600/30 border border-indigo-500/50 text-white shadow-md"
                            : "bg-white/5 hover:bg-white/10 text-gray-300 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`w-3.5 h-3.5 ${preset.badgeColor}`} />
                          <span>{preset.name}</span>
                        </div>
                        {isSelected && <span className="text-[10px] font-black text-indigo-400">ACTIVE</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Card 3D Animation Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  3D Card Interactive Mode
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {FORM_PRESETS.map((preset) => {
                    const Icon = preset.icon;
                    const isSelected = formStyle === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => selectFormStyle(preset.id as FormStyleMode)}
                        className={`flex flex-col items-start px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                          isSelected
                            ? "bg-pink-600/30 border border-pink-500/50 text-white shadow-md"
                            : "bg-white/5 hover:bg-white/10 text-gray-300 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <Icon className="w-3.5 h-3.5 text-pink-400" />
                            <span>{preset.name}</span>
                          </div>
                          {isSelected && <span className="text-[10px] font-black text-pink-400">ACTIVE</span>}
                        </div>
                        <span className="text-[9px] text-gray-400 font-medium mt-0.5">{preset.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
