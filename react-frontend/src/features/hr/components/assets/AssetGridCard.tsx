import React from "react";
import { Badge, Dropdown, DropdownItem, DropdownHeader, DropdownDivider } from "@/lib/flowbite-compat";
import {
  Cpu,
  Smartphone,
  Monitor,
  MousePointer2,
  HardDrive,
  Box,
  MoreVertical,
  RotateCcw,
  UserPlus,
  Printer,
  Zap,
  LayoutGrid,
  Trash2,
} from "lucide-react";

interface AssetGridCardProps {
  asset: any;
  onProcessReturn: (asset: any) => void;
  onOpenAssign: (asset: any) => void;
  onGenerateLabel: (asset: any) => void;
  onOpenDetails: (asset: any) => void;
  onOpenEdit: (asset: any) => void;
  onDelete: (id: number) => void;
}

export const getAssetIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case "laptop":
      return <Cpu size={20} />;
    case "mobile":
    case "smartphone":
      return <Smartphone size={20} />;
    case "monitor":
      return <Monitor size={20} />;
    case "peripherals":
      return <MousePointer2 size={20} />;
    case "server":
      return <HardDrive size={20} />;
    default:
      return <Box size={20} />;
  }
};

export const AssetGridCard: React.FC<AssetGridCardProps> = ({
  asset: a,
  onProcessReturn,
  onOpenAssign,
  onGenerateLabel,
  onOpenDetails,
  onOpenEdit,
  onDelete,
}) => {
  return (
    <div className="shadow-xs dark:bg-gray-800 p-0 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group relative bg-white flex flex-col rounded-2xl border border-gray-100 dark:border-gray-700/80 hover:border-blue-200 dark:hover:border-blue-800/80 overflow-hidden">
      {/* Image Area - Top Half */}
      <div className="w-full h-36 sm:h-40 bg-gray-50 dark:bg-gray-900/60 flex items-center justify-center text-gray-400 shrink-0 relative overflow-hidden group-hover:bg-gray-100 dark:group-hover:bg-gray-900 transition-colors">
        {a.imageUrl ? (
          <img
            src={a.imageUrl}
            alt={a.name}
            className="w-full h-full object-cover rounded-t-2xl transform group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="scale-150 text-gray-300 dark:text-gray-600 transform group-hover:scale-175 transition-transform duration-500">
            {getAssetIcon(a.assetType)}
          </div>
        )}
        {/* Status Badge */}
        <div className="absolute top-3.5 left-3.5">
          <Badge
            color={a.status === "Assigned" ? "blue" : "success"}
            className="rounded-xl px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest shadow-xs backdrop-blur-md"
          >
            {a.status || "Available"}
          </Badge>
        </div>
        {/* Actions Dropdown */}
        <div className="absolute top-4 right-4">
          <Dropdown
            placement="bottom-end"
            label={
              <div className="p-2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 transition-all text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer rounded-xl shadow-xs">
                <MoreVertical size={16} />
              </div>
            }
            arrowIcon={false}
            inline
            theme={{
              floating: {
                base: "z-50 w-fit focus:outline-none shadow-2xl rounded-2xl overflow-hidden",
                style: {
                  auto: "border-none rounded-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl text-gray-900 dark:text-white p-1",
                },
              },
            }}
          >
            <DropdownHeader className="border-none">
              <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-2 py-1">
                Asset Operations
              </span>
            </DropdownHeader>
            {a?.status === "Assigned" ? (
              <DropdownItem
                onClick={() => setTimeout(() => onProcessReturn(a), 0)}
                className="rounded-xl mb-1 hover:bg-orange-50 dark:hover:bg-orange-900/20 group/item"
              >
                <div className="flex items-center gap-3 py-1">
                  <div className="p-1.5 bg-orange-100 dark:bg-orange-900/40 text-orange-600 rounded-lg group-hover/item:scale-110 transition-transform">
                    <RotateCcw size={14} />
                  </div>
                  <span className="font-bold text-xs text-gray-750 dark:text-gray-200">
                    Return to Stock
                  </span>
                </div>
              </DropdownItem>
            ) : (
              <DropdownItem
                onClick={() => setTimeout(() => onOpenAssign(a), 0)}
                className="rounded-xl mb-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 group/item"
              >
                <div className="flex items-center gap-3 py-1">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 rounded-lg group-hover/item:scale-110 transition-transform">
                    <UserPlus size={14} />
                  </div>
                  <span className="font-bold text-xs text-gray-750 dark:text-gray-200">
                    Assign to Staff
                  </span>
                </div>
              </DropdownItem>
            )}
            <DropdownItem
              onClick={() => setTimeout(() => onGenerateLabel(a), 0)}
              className="rounded-xl mb-1 hover:bg-gray-50 dark:hover:bg-gray-700/50 group/item"
            >
              <div className="flex items-center gap-3 py-1">
                <div className="p-1.5 bg-gray-100 dark:bg-gray-700/40 text-gray-600 rounded-lg group-hover/item:scale-110 transition-transform">
                  <Printer size={14} />
                </div>
                <span className="font-bold text-xs text-gray-750 dark:text-gray-200">
                  Print Tag
                </span>
              </div>
            </DropdownItem>
            <DropdownItem
              onClick={() => setTimeout(() => onOpenDetails(a), 0)}
              className="rounded-xl mb-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group/item"
            >
              <div className="flex items-center gap-3 py-1">
                <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 rounded-lg group-hover/item:scale-110 transition-transform">
                  <Zap size={14} />
                </div>
                <span className="font-bold text-xs text-gray-750 dark:text-gray-200">
                  View Details
                </span>
              </div>
            </DropdownItem>
            <DropdownItem
              onClick={() => setTimeout(() => onOpenEdit(a), 0)}
              className="rounded-xl mb-1 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 group/item"
            >
              <div className="flex items-center gap-3 py-1">
                <div className="p-1.5 bg-emerald-100 dark:emerald-900/40 text-emerald-600 rounded-lg group-hover/item:scale-110 transition-transform">
                  <LayoutGrid size={14} />
                </div>
                <span className="font-bold text-xs text-gray-750 dark:text-gray-200">
                  Edit Record
                </span>
              </div>
            </DropdownItem>
            <DropdownDivider className="my-1 border-none" />
            <DropdownItem
              onClick={() => setTimeout(() => onDelete(a.id), 0)}
              className="rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 group/item"
            >
              <div className="flex items-center gap-3 py-1">
                <div className="p-1.5 bg-rose-100 dark:bg-rose-900/40 text-rose-600 rounded-lg group-hover/item:scale-110 transition-transform">
                  <Trash2 size={14} />
                </div>
                <span className="font-bold text-xs text-rose-650">
                  Purge Node
                </span>
              </div>
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      {/* Details Area - Bottom Half */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm sm:text-base font-black dark:text-white uppercase mb-1.5 line-clamp-1">
          {a.name}
        </h3>
        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className="text-[8px] font-black text-gray-500 uppercase px-2 py-0.5 bg-gray-100 dark:bg-gray-700/60 rounded-md">
            {a.assetType || "Other"}
          </span>
          <span className="text-[8px] font-black text-gray-500 uppercase px-2 py-0.5 bg-gray-100 dark:bg-gray-700/60 rounded-md">
            {a.serialNumber}
          </span>
        </div>

        <p className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 mb-4 flex-1 line-clamp-2 leading-relaxed">
          {a.employee
            ? `Currently deployed to ${a.employee.firstNameEnglish} ${a.employee.lastNameEnglish}.`
            : "Located in main stock node. Ready for deployment."}
        </p>

        {/* Custodian Footer */}
        <div className="flex flex-wrap items-end justify-between pt-3 mt-auto gap-y-2 gap-x-2 border-none">
          <div className="min-w-0 flex-1">
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest truncate">
              Custodian
            </p>
            <p className="text-xs sm:text-sm font-black dark:text-white truncate">
              {a.employee
                ? `${a.employee.firstNameEnglish} ${a.employee.lastNameEnglish}`
                : "Unassigned"}
            </p>
          </div>
          <button
            onClick={() =>
              a.status === "Assigned" ? onProcessReturn(a) : onOpenAssign(a)
            }
            className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all rounded-xl shadow-xs ${
              a.status === "Assigned"
                ? "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20"
            }`}
          >
            {a.status === "Assigned" ? "Return" : "Deploy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetGridCard;
