import React from "react";
import { X } from "lucide-react";

interface CustomModalHeaderProps {
  title: string;
  subtitle?: React.ReactNode | string;
  onClose: () => void;
  icon?: React.ReactNode;
}

const CustomModalHeader: React.FC<CustomModalHeaderProps> = ({
  title,
  subtitle,
  onClose,
  icon,
}) => {
  return (
    <div className="relative bg-white dark:bg-[#0d1117] px-6 py-4 flex justify-between items-center rounded-t-2xl border-b border-gray-100 dark:border-white/[0.05]">
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-400 opacity-90" />

      <div className="flex items-center gap-3.5">
        {icon && (
          <span className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-500/10 dark:to-violet-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
            {icon}
          </span>
        )}
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight leading-snug">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[10px] font-semibold text-gray-400 dark:text-white/30 uppercase tracking-[0.15em] mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="flex-shrink-0 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white bg-gray-50 hover:bg-gray-100 dark:bg-white/[0.03] dark:hover:bg-white/10 rounded-full transition-all duration-300 hover:rotate-90 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-white/10"
        style={{ width: "32px", height: "32px", minWidth: "32px", minHeight: "32px", padding: 0, boxSizing: "border-box" }}
        title="Close modal"
      >
        <X size={16} strokeWidth={2.5} />
        <span className="sr-only">Close modal</span>
      </button>
    </div>
  );
};
export default CustomModalHeader;
