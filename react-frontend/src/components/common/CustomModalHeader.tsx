"use client";
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
    <div className="relative border-b bg-white dark:bg-gray-800 px-6 py-4 flex justify-between items-start rounded-t-lg">
      {" "}
      <div className="flex flex-col">
        {" "}
        <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight flex items-center gap-2">
          {" "}
          {icon && <span className="text-blue-600">{icon}</span>} {title}{" "}
        </h3>{" "}
        {subtitle && (
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            {" "}
            {subtitle}{" "}
          </p>
        )}{" "}
      </div>{" "}
      <button
        type="button"
        onClick={onClose}
        className="text-red-500 bg-transparent border-red-500/50 hover:bg-red-50 hover:text-red-600 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all z-50"
      >
        {" "}
        <X size={24} /> <span className="sr-only">Close modal</span>{" "}
      </button>{" "}
    </div>
  );
};
export default CustomModalHeader;
