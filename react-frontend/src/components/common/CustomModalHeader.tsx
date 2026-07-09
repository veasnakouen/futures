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
    <div className="relative bg-gradient-to-r from-gray-50 to-white dark:from-gray-900/90 dark:to-gray-800/90 px-6 py-5 flex justify-between items-center rounded-t-xl border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex flex-col">
        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          {icon && <span className="p-2 bg-blue-100/50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 rounded-lg">{icon}</span>}
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1.5 ml-1">
            {subtitle}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-300 rounded-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        title="Close modal"
      >
        <X size={20} />
        <span className="sr-only">Close modal</span>
      </button>
    </div>
  );
};
export default CustomModalHeader;
