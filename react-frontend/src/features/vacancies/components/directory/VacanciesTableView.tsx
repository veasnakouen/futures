import React from "react";
import { Badge, Dropdown, DropdownItem, DropdownDivider } from "@/lib/flowbite-compat";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { Briefcase, Building2, MapPin, Clock, MoreVertical, UserPlus, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Props {
  state: any;
}

export default function VacanciesTableView({ state }: Props) {
  const {
    vacancies,
    loading,
    visibleColumns,
    handleView,
    handleEdit,
    handleDelete,
    setSelectedVacancy,
    setIsApplyModalOpen,
  } = state;

  const columns: DataTableColumn<any>[] = [
    {
      key: "position",
      label: "Position & Employer",
      render: (v) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-md bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Briefcase size={18} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight truncate">
              {v.jobPositionName || "No Designation"}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1">
                <Building2 size={10} />
                {v.employerName || "Confidential"}
              </span>
              <span className="text-gray-300 dark:text-gray-600 text-[10px]">|</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <MapPin size={10} />
                {v.location || "Remote"}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "salary",
      label: "Package",
      align: "center",
      render: (v) => (
        <div className="flex flex-col items-center">
          <span className="text-sm font-black text-gray-900 dark:text-white">${v.salary || 0}</span>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">per month</span>
        </div>
      ),
    },
    {
      key: "deadline",
      label: "Deadline",
      align: "center",
      render: (v) => (
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-tight">
            {v.closingDate ? format(new Date(v.closingDate), "MMM dd, yyyy") : "N/A"}
          </span>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 flex items-center gap-1">
            <Clock size={8} /> Closing Date
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (v) => (
        <Badge
          color={v.status === "Open" ? "success" : "gray"}
          className="rounded-md px-4 py-1.5 text-[9px] font-black uppercase tracking-widest inline-flex"
        >
          {v.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (v) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Dropdown
            label={
              <div className="p-2 text-gray-400 hover:text-blue-600 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md cursor-pointer">
                <MoreVertical size={18} />
              </div>
            }
            arrowIcon={false}
            inline
            className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border-none shadow-2xl rounded-md p-2 min-w-[180px]"
          >
            <DropdownItem
              onClick={() => handleView(v)}
              className="font-bold text-xs text-gray-700 dark:text-gray-200"
            >
              <Briefcase size={14} className="mr-2 text-blue-600" /> View Details
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setSelectedVacancy(v);
                setIsApplyModalOpen(true);
              }}
              className="font-bold text-xs text-gray-700 dark:text-gray-200"
            >
              <UserPlus size={14} className="mr-2 text-emerald-600" /> Assign Client
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem
              onClick={() => handleEdit(v)}
              className="font-bold text-xs text-gray-700 dark:text-gray-200"
            >
              <Edit size={14} className="mr-2 text-blue-600" /> Update Details
            </DropdownItem>
            <DropdownItem
              onClick={() => handleDelete(v.id)}
              className="font-bold text-xs text-red-600 dark:text-red-400"
            >
              <Trash2 size={14} className="mr-2" /> Delete
            </DropdownItem>
          </Dropdown>
        </div>
      ),
    },
  ];

  const filteredColumns = columns.filter(
    (c) => c.key === "position" || c.key === "actions" || visibleColumns.includes(c.key as string)
  );

  return (
    <DataTable
      columns={filteredColumns}
      data={vacancies}
      keyExtractor={(v: any) => v.id}
      loading={loading}
      onRowClick={handleView}
    />
  );
}
