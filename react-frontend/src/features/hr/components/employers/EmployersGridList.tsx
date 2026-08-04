import React from "react";
import { Spinner, DropdownItem, DropdownDivider } from "@/lib/flowbite-compat";
import DataCard from "@/components/ui/DataCard";
import { Building2, Globe, Plus, Search, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  state: any;
}

export default function EmployersGridList({ state }: Props) {
  const {
    t,
    navigate,
    loading,
    employers,
    itemsPerRow,
    connectedEmployers,
    toggleB2BConnection,
    handleView,
    handleEdit,
    setItemToDelete,
    setIsConfirmOpen,
  } = state;

  const getGridClass = () => {
    return `grid gap-6 ${
      itemsPerRow === "3"
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        : itemsPerRow === "5"
        ? "grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    }`;
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className={getGridClass()}>
      {employers.map((employer: any) => (
        <DataCard
          key={employer.id}
          title={employer.name}
          subtitle={employer.jobCategoryName || "General Industry"}
          imageUrl={employer.logoUrl}
          fallbackIcon={<Building2 className="text-gray-300 dark:text-gray-600" size={32} />}
          statusLabel={employer.status || "Active"}
          statusColorClass={
            employer.status === "Active"
              ? "border-emerald-500/30 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 dark:text-emerald-400"
              : "border-amber-500/30 text-amber-600 bg-amber-50 dark:bg-amber-900/10 dark:text-amber-400"
          }
          customBadges={
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-widest border-blue-100 dark:border-blue-800">
                {employer.address?.split(",")[0] || "Phnom Penh"}
              </span>
              {connectedEmployers.includes(employer.id) && (
                <span className="bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                  <Globe size={10} /> B2B Partner Network
                </span>
              )}
            </div>
          }
          dropdownItems={
            <>
              <DropdownItem
                onClick={() => {
                  toast.success(`Opening Job Posting for ${employer.name}`);
                  navigate(`/recruitment?tab=vacancies&employerId=${employer.id}`);
                }}
                className="font-bold text-xs text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
              >
                <div className="flex items-center gap-2">
                  <Plus size={14} />
                  <span>Post Job for Employer</span>
                </div>
              </DropdownItem>
              <DropdownItem
                onClick={() => toggleB2BConnection(employer.id)}
                className="font-bold text-xs text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                <div className="flex items-center gap-2">
                  <Globe size={14} />
                  <span>
                    {connectedEmployers.includes(employer.id)
                      ? "Disconnect B2B Network"
                      : "Connect B2B Partner Network"}
                  </span>
                </div>
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem
                onClick={() => handleView(employer)}
                className="font-bold text-xs text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              >
                <div className="flex items-center gap-2">
                  <Search size={14} />
                  <span>View Details</span>
                </div>
              </DropdownItem>
              <DropdownItem
                onClick={() => handleEdit(employer)}
                className="font-bold text-xs text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <div className="flex items-center gap-2">
                  <Edit size={14} />
                  <span>Edit Employer</span>
                </div>
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  setItemToDelete(employer.id);
                  setIsConfirmOpen(true);
                }}
                className="font-bold text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <div className="flex items-center gap-2">
                  <Trash2 size={14} />
                  <span>Delete Employer</span>
                </div>
              </DropdownItem>
            </>
          }
        />
      ))}
    </div>
  );
}
