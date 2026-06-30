import React from "react";
import { Dropdown } from '@/lib/flowbite-compat';
import { MoreVertical } from "lucide-react";

export interface AppCardProps {
  statusColor?: "emerald" | "red" | "amber" | "blue" | "gray";
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const AppCard: React.FC<AppCardProps> = ({
  statusColor = "gray",
  headerLeft,
  headerRight,
  actions,
  children,
  className = "",
  onClick,
}) => {
  const borderColor = {
    emerald: "border-t-emerald-500",
    red: "border-t-red-500",
    amber: "border-t-amber-500",
    blue: "border-t-blue-500",
    gray: "border-t-gray-500",
  }[statusColor];

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 shadow-sm rounded-sm overflow-hidden transition-all group border-t-8 flex flex-col ${borderColor} ${onClick ? "cursor-pointer hover:shadow-md" : "hover:shadow-md"} ${className}`}
    >
      <div className="p-6 flex-1 flex flex-col">
        {(headerLeft || headerRight || actions) && (
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">{headerLeft}</div>
              <div
                className="flex items-center gap-2"
                onClick={(e) => (actions ? e.stopPropagation() : undefined)}
              >
                {headerRight}
                {actions && (
                  <Dropdown
                    arrowIcon={false}
                    inline
                    label={
                      <div className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 outline-none cursor-pointer">
                        <MoreVertical size={16} />
                      </div>
                    }
                  >
                    {actions}
                  </Dropdown>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col flex-1">{children}</div>
      </div>
    </div>
  );
};
