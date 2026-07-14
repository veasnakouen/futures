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
    <div className="relative overflow-hidden bg-white dark:bg-[#0d1117] px-6 py-5 flex justify-between items-start rounded-t-xl border-b border-gray-100 dark:border-white/[0.05]">
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-400 opacity-90" />

      <div className="flex items-center gap-3.5">
        {icon && (
          <span className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-500/10 dark:to-violet-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
            {icon}
          </span>
        )}
        <div className="flex flex-col">
          <h3 className="text-[15px] font-bold text-gray-900 dark:text-white tracking-tight leading-snug">
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
        className="mt-0.5 flex-shrink-0 w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white bg-gray-100 hover:bg-gray-200 dark:bg-white/[0.05] dark:hover:bg-white/10 rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        title="Close modal"
      >
        <X size={15} strokeWidth={2.5} />
        <span className="sr-only">Close modal</span>
      </button>
    </div>
  );
};
export default CustomModalHeader;
