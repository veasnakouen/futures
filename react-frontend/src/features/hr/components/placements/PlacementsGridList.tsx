import React from "react";
import { Spinner, Badge, Dropdown, DropdownItem, DropdownDivider } from "@/lib/flowbite-compat";
import { User, MoreVertical, Edit, Trash2 } from "lucide-react";

interface Props {
  state: any;
}

export default function PlacementsGridList({ state }: Props) {
  const {
    loading,
    placements,
    itemsPerRow,
    handleViewModal,
    handleOpenModal,
    handleDeleteClick,
  } = state;

  const getGridClass = () => {
    return `grid gap-6 ${
      itemsPerRow === "3"
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-4 items-start"
        : itemsPerRow === "5"
        ? "grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 p-4 items-start"
        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 items-start"
    }`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Spinner size="xl" />
        <p className="text-gray-500 font-bold animate-pulse">Synchronizing Placement Ledger...</p>
      </div>
    );
  }

  return (
    <div className={getGridClass()}>
      {placements.map((p: any, i: number) => (
        <div
          key={i}
          className="border-none shadow-sm hover:shadow-xl transition-all dark:bg-gray-800 rounded-md focus-within:z-30 pt-8 pb-2 relative group h-full flex flex-col bg-white"
        >
          <div className="absolute right-4 top-4">
            <Dropdown
              inline
              label={
                <div className="p-2 text-gray-400 hover:text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md">
                  <MoreVertical size={16} />
                </div>
              }
              arrowIcon={false}
              className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border-none shadow-2xl rounded-md"
            >
              <DropdownItem onClick={() => handleViewModal(p)} className="font-bold text-xs text-emerald-600">
                <div className="flex items-center gap-2">
                  <User size={14} />
                  <span>View Details</span>
                </div>
              </DropdownItem>
              <DropdownItem onClick={() => handleOpenModal(p)} className="font-bold text-xs text-blue-600">
                <div className="flex items-center gap-2">
                  <Edit size={14} />
                  <span>Edit Entry</span>
                </div>
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem onClick={() => handleDeleteClick(p.id)} className="font-bold text-xs text-rose-600">
                <div className="flex items-center gap-2">
                  <Trash2 size={14} />
                  <span>Remove Node</span>
                </div>
              </DropdownItem>
            </Dropdown>
          </div>

          <div className="flex flex-col items-center flex-1 w-full h-full">
            {/* Large Circular Avatar */}
            <div className="w-24 h-24 mb-4 rounded-full overflow-hidden ring-4 ring-gray-50 dark:ring-gray-700/50 shadow-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shrink-0">
              <User size={40} />
            </div>

            {/* Title & Subtitle */}
            <h5 className="mb-1 text-xl font-black text-gray-900 dark:text-white text-center px-4 line-clamp-1">
              {p.clientName || `Client #${p.clientId}`}
            </h5>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-center px-4 mb-4">
              {p.placementType}
            </span>

            <div className="flex flex-wrap justify-center gap-2 mb-2 px-4 mt-auto">
              <Badge color="info" className="rounded-md px-3 py-1 font-black text-[8px] uppercase tracking-widest">
                {p.companyName}
              </Badge>
              <Badge color="success" className="rounded-md px-3 py-1 font-black text-[8px] uppercase tracking-widest">
                ${p.salary || "N/A"}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
