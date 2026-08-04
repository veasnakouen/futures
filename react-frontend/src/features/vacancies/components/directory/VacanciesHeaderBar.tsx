import React from "react";
import { Button } from "@/lib/flowbite-compat";
import { Briefcase, Plus } from "lucide-react";
import VacancyFilters from "../VacancyFilters";

interface Props {
  state: any;
}

export default function VacanciesHeaderBar({ state }: Props) {
  const {
    searchTerm,
    setSearchTerm,
    viewMode,
    setViewMode,
    visibleColumns,
    setVisibleColumns,
    itemsPerRow,
    setItemsPerRow,
    resetForm,
    setIsModalOpen,
  } = state;

  return (
    <div className="space-y-4">
      <header className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 text-white rounded-md shadow-xl shadow-blue-500/20">
            <Briefcase size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black dark:text-white tracking-tight">
              Active Opportunities
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-md bg-emerald-500 animate-pulse"></span>
              Connecting Clients to Labour Market Nodes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            color="blue"
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="rounded-md px-6 h-12 bg-blue-600 hover:bg-blue-700 border-none shadow-xl shadow-blue-500/30 transition-all active:scale-95 font-black uppercase tracking-widest text-[9px]"
          >
            <Plus size={16} className="mr-2" /> Post New Vacancy
          </Button>
        </div>
      </header>

      {/* Filter and View Switcher Toolbar */}
      <VacancyFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        viewMode={viewMode}
        setViewMode={setViewMode}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        itemsPerRow={itemsPerRow}
        setItemsPerRow={setItemsPerRow}
      />
    </div>
  );
}
