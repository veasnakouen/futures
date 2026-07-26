import React from "react";
import { Zap, Coffee, CheckCircle, LogOut, Flame, ArrowRight, ShieldCheck } from "lucide-react";
import { ActionType } from "./scannerTypes";

interface ScannerActionSwitcherProps {
  actionType: ActionType;
  setActionType: (action: ActionType) => void;
  dutyStatus?: "ON_DUTY" | "OFF_DUTY" | "ON_BREAK" | "ON_EMERGENCY";
  onOpenModal?: (action: ActionType) => void;
}

export default function ScannerActionSwitcher({
  actionType,
  setActionType,
  dutyStatus = "ON_DUTY",
  onOpenModal,
}: ScannerActionSwitcherProps) {
  const actions: { id: ActionType; label: string; icon: any; description: string; badge: string; color: string }[] = [
    {
      id: "CLOCK_IN",
      label: "Clock In (Duty Start)",
      icon: Zap,
      description: "Initiate daily attendance tracking and record arrival timestamp with GPS satellite verification.",
      badge: "Duty Start",
      color: "from-blue-600 to-indigo-600",
    },
    {
      id: "BREAK_START",
      label: "Lunch / Break Start",
      icon: Coffee,
      description: "Pause active shift for official meal or rest break period.",
      badge: "Meal Break",
      color: "from-amber-600 to-orange-600",
    },
    {
      id: "BREAK_END",
      label: "Resume Duty",
      icon: CheckCircle,
      description: "End meal break and resume active hospital/clinic shift duty tracking.",
      badge: "Resume Shift",
      color: "from-emerald-600 to-teal-600",
    },
    {
      id: "CLOCK_OUT",
      label: "Clock Out (End Shift)",
      icon: LogOut,
      description: "Conclude daily shift, calculate total duty hours, and review shift receipt summary.",
      badge: "Shift End",
      color: "from-rose-600 to-red-600",
    },
    {
      id: "ON_CALL",
      label: "Emergency On-Call",
      icon: Flame,
      description: "Register high-priority emergency response check-in for STAT callout duty.",
      badge: "Emergency Duty",
      color: "from-purple-600 to-indigo-600",
    },
  ];

  const currentAction = actions.find((a) => a.id === actionType) || actions[0];

  const handleActionClick = (actId: ActionType) => {
    setActionType(actId);
    if (onOpenModal) {
      onOpenModal(actId);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Action Tab Buttons */}
      <div className="bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-wrap gap-2">
        {actions.map((act) => {
          const Icon = act.icon;
          const isActive = actionType === act.id;
          const isRecommended =
            (dutyStatus === "ON_BREAK" && act.id === "BREAK_END") ||
            (dutyStatus === "ON_DUTY" && act.id === "BREAK_START");

          return (
            <button
              key={act.id}
              onClick={() => handleActionClick(act.id)}
              className={`flex-1 min-w-[140px] px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer relative ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-[1.02]"
                  : "bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Icon size={14} /> {act.label}
              {isRecommended && !isActive && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute top-2 right-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* 2. Interactive Action Execution Console */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-950 p-5 rounded-2xl border border-gray-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-start gap-3.5">
          <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${currentAction.color} flex items-center justify-center text-white shrink-0 shadow-md`}>
            <currentAction.icon size={22} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white">{currentAction.label}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-white/10 text-indigo-300 border border-white/10">
                {currentAction.badge}
              </span>
            </div>
            <p className="text-xs font-bold text-gray-400 max-w-xl">
              {currentAction.description}
            </p>
          </div>
        </div>

        {/* Action Trigger Modal Button */}
        {onOpenModal && (
          <button
            onClick={() => onOpenModal(actionType)}
            className={`w-full sm:w-auto px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-white bg-gradient-to-r ${currentAction.color} hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2 shrink-0 cursor-pointer`}
          >
            <ShieldCheck size={16} /> Authorize {currentAction.badge} <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
