import React from "react";
import { Button } from "@/lib/flowbite-compat";
import ClientFilters from "../ClientFilters";
import { Plus } from "lucide-react";

interface Props {
  state: any;
  hideLayout?: boolean;
}

export default function ClientsHeaderBar({ state, hideLayout = false }: Props) {
  const {
    t,
    filters,
    setFilters,
    viewMode,
    setViewMode,
    visibleColumns,
    setVisibleColumns,
    itemsPerRow,
    setItemsPerRow,
    resetForm,
    setIsEditMode,
    setIsModalOpen,
  } = state;

  return (
    <div className="space-y-6">
      {!hideLayout && (
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {t("clientDirectory")}
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Manage client profiles, intake records, and placement tracking
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              color="blue"
              onClick={() => {
                resetForm();
                setIsEditMode(false);
                setIsModalOpen(true);
              }}
              className="rounded-xl font-bold uppercase text-xs tracking-wider shadow-lg shadow-blue-500/20"
            >
              <Plus size={18} className="mr-2" /> {t("newClientRegistration")}
            </Button>
          </div>
        </header>
      )}

      {/* Filter and View Toggle Toolbar */}
      <ClientFilters
        filters={filters}
        setFilters={setFilters}
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
