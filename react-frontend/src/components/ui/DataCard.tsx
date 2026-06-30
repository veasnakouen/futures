import React, { type ReactNode } from "react";
import { Dropdown } from '@/lib/flowbite-compat';
import { MoreVertical } from "lucide-react";

export interface DataCardProps {
  title: string;
  subtitle: string;
  imageUrl?: string | null;
  fallbackIcon?: ReactNode;

  // Quick info row
  idValue?: string;
  department?: string;

  // Status badge
  statusLabel?: string;
  statusColorClass?: string;

  // Extra badges
  customBadges?: ReactNode;

  // Actions
  actionButtons?: ReactNode;
  dropdownItems?: ReactNode;

  onClick?: () => void;
}

const DataCard: React.FC<DataCardProps> = ({
  title,
  subtitle,
  imageUrl,
  fallbackIcon,
  idValue,
  department,
  statusLabel,
  statusColorClass,
  customBadges,
  actionButtons,
  dropdownItems,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`group border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 rounded-md p-4 relative transition-all ${onClick ? "cursor-pointer hover:border-blue-500 dark:hover:border-gray-400 hover:shadow-md" : ""} !overflow-visible h-full flex flex-col`}
    >
      {/* Dropdown Menu - absolutely positioned but safely handled by Flowbite if overflow is visible */}
      {dropdownItems && (
        <div
          className="absolute right-2 top-2 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <Dropdown
            inline
            label={
              <div className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md shadow-sm border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
                <MoreVertical size={16} />
              </div>
            }
            arrowIcon={false}
            className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border-none shadow-2xl !rounded-md p-2 min-w-[180px] z-50"
          >
            {dropdownItems}
          </Dropdown>
        </div>
      )}

      <div className="flex flex-col items-center mb-4 pt-4 relative">
        <div className="w-24 h-24 rounded-full bg-gray-50 dark:bg-gray-800 shadow-md border-4 border-white dark:border-gray-700 flex items-center justify-center relative z-10 group-hover:scale-105 transition-transform duration-300 ring-4 ring-gray-50 dark:ring-gray-700/50">
          {imageUrl ? (
            <img
              src={imageUrl}
              className="w-full h-full object-cover rounded-full"
              alt={title}
            />
          ) : (
            <div className="text-gray-300 dark:text-gray-600">
              {fallbackIcon}
            </div>
          )}
        </div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent z-0"></div>
      </div>

      <div className="flex flex-col items-center gap-1.5 px-2 text-center pb-2 flex-1">
        <h3 className="text-lg font-black text-gray-900 dark:text-white truncate w-full leading-tight">
          {title}
        </h3>
        <p className="text-blue-600 dark:text-blue-400 font-bold text-xs truncate w-full uppercase tracking-widest">
          {subtitle}
        </p>

        {(idValue || department) && (
          <div className="flex items-center justify-center gap-2 mt-2 w-full">
            {idValue && (
              <span className="text-gray-400 dark:text-gray-500 text-[10px] font-black font-mono bg-gray-50 dark:bg-gray-900 px-1.5 py-0.5 rounded-sm">
                {idValue}
              </span>
            )}
            {idValue && department && (
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
            )}
            {department && (
              <span className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border border-gray-100 dark:border-gray-700 truncate max-w-[120px]">
                {department}
              </span>
            )}
          </div>
        )}

        {customBadges && (
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {customBadges}
          </div>
        )}

        {statusLabel && (
          <div className="mt-3">
            <span
              className={`border text-[9px] uppercase font-black tracking-widest px-3 py-1 rounded-md ${statusColorClass || "border-gray-500/30 text-gray-600 bg-gray-50 dark:bg-gray-900/10"}`}
            >
              {statusLabel}
            </span>
          </div>
        )}

        {actionButtons && (
          <div
            className="flex justify-center gap-2 mt-auto pt-4"
            onClick={(e) => e.stopPropagation()}
          >
            {actionButtons}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataCard;
