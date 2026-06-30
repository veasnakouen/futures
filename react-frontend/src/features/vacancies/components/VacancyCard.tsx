import React from "react";
import {
  Card,
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownDivider,
} from '@/lib/flowbite-compat';
import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Edit,
  Trash2,
  MoreVertical,
  UserCheck,
  ChevronDown,
} from "lucide-react";
import { format } from "date-fns";

interface VacancyCardProps {
  vacancy: any;
  onApply: (vacancy: any) => void;
  onView: (vacancy: any) => void;
  onEdit: (vacancy: any) => void;
  onDelete: (id: number) => void;
}

const VacancyCard: React.FC<VacancyCardProps> = ({
  vacancy,
  onApply,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="h-full flex flex-col border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 rounded-md focus-within:z-30 p-4 relative group hover:shadow-md transition-shadow">
      {/* Top Dropdown Action */}
      <div className="absolute right-2 top-2">
        <Dropdown
          inline
          label={
            <div className="p-2 text-gray-400 hover:text-blue-600 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md cursor-pointer">
              <MoreVertical size={18} />
            </div>
          }
          arrowIcon={false}
          className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border-none shadow-2xl rounded-md p-2 min-w-[180px]"
        >
          <DropdownItem
            onClick={() => onView(vacancy)}
            className="rounded-md mb-1 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 group/item"
          >
            <div className="flex items-center gap-3 py-1">
              <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-md group-hover/item:scale-110 transition-transform">
                <UserCheck size={14} />
              </div>
              <span className="font-bold text-xs text-gray-700 dark:text-gray-200">
                View Details
              </span>
            </div>
          </DropdownItem>
          <DropdownItem
            onClick={() => onApply(vacancy)}
            className="rounded-md mb-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 group/item"
          >
            <div className="flex items-center gap-3 py-1">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 rounded-md group-hover/item:scale-110 transition-transform">
                <Briefcase size={14} />
              </div>
              <span className="font-bold text-xs text-gray-700 dark:text-gray-200">
                Assign Client
              </span>
            </div>
          </DropdownItem>
          <DropdownDivider className="my-1 border-gray-100 dark:border-gray-700" />
          <DropdownItem
            onClick={() => onEdit(vacancy)}
            className="rounded-md mb-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 group/item"
          >
            <div className="flex items-center gap-3 py-1">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 rounded-md group-hover/item:scale-110 transition-transform">
                <Edit size={14} />
              </div>
              <span className="font-bold text-xs text-gray-700 dark:text-gray-200">
                Update Details
              </span>
            </div>
          </DropdownItem>
          <DropdownItem
            onClick={() => onDelete(vacancy.id)}
            className="rounded-md hover:bg-rose-50 dark:hover:bg-rose-900/20 group/item"
          >
            <div className="flex items-center gap-3 py-1">
              <div className="p-1.5 bg-rose-100 dark:bg-rose-900/40 text-rose-600 rounded-md group-hover/item:scale-110 transition-transform">
                <Trash2 size={14} />
              </div>
              <span className="font-bold text-xs text-rose-600">
                Purge Record
              </span>
            </div>
          </DropdownItem>
        </Dropdown>
      </div>

      <div className="flex flex-col items-center pb-2 flex-1 w-full">
        {/* Large Circular Image */}
        <div className="w-16 h-16 mb-2 rounded-md overflow-hidden ring-4 ring-gray-50 dark:ring-gray-700/50 shadow-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 shrink-0">
          {vacancy.imageUrl ? (
            <img
              src={vacancy.imageUrl}
              alt="Vacancy"
              className="w-full h-full object-cover"
            />
          ) : (
            <Briefcase size={32} />
          )}
        </div>

        {/* Title & Subtitle */}
        <h5 className="mb-1 text-xl font-black text-gray-900 dark:text-white text-center px-4 line-clamp-1">
          {vacancy.jobPositionName || "No Designation"}
        </h5>
        <span className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-center px-4 mb-4">
          {vacancy.employerName || "Confidential Employer"}
        </span>

        {/* Stats / Badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-3 px-4 mt-auto">
          <Badge
            color="info"
            className="rounded-md px-3 py-1 font-black text-[8px] uppercase tracking-widest"
          >
            {vacancy.location || "Phnom Penh"}
          </Badge>
          <Badge
            color="success"
            className="rounded-md px-3 py-1 font-black text-[8px] uppercase tracking-widest"
          >
            ${vacancy.salary || "Negotiable"}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default VacancyCard;
