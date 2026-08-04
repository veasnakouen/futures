import React from "react";
import { Badge, Dropdown, DropdownItem, DropdownDivider } from "@/lib/flowbite-compat";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import SearchInput from "@/components/common/SearchInput";
import { Search, Edit3, Trash2, MoreVertical } from "lucide-react";
import { format } from "date-fns";

interface Props {
  state: any;
}

export default function LogbookTableView({ state }: Props) {
  const {
    logs,
    loading,
    search,
    setSearch,
    handleView,
    handleEdit,
    handleDelete,
  } = state;

  const columns: DataTableColumn<any>[] = [
    {
      key: "timestamp",
      label: "Timestamp",
      className: "font-medium dark:text-white",
      render: (log) =>
        log.enrollDate
          ? format(new Date(log.enrollDate), "MMM dd, HH:mm")
          : "N/A",
    },
    {
      key: "gender",
      label: "Gender",
      render: (log) => <Badge color="gray">{log.gender}</Badge>,
    },
    {
      key: "services",
      label: "Services Used",
      render: (log) => (
        <div className="flex flex-wrap gap-1">
          {log.usingComputer && <Badge color="indigo">IT Lab</Badge>}
          {log.library && <Badge color="orange">Library</Badge>}
          {log.jobinformation && <Badge color="success">Job Info</Badge>}
          {log.futureService && <Badge color="warning">Future</Badge>}
        </div>
      ),
    },
    {
      key: "note",
      label: "Note",
      className: "text-gray-500 dark:text-gray-400 max-w-xs truncate",
      render: (log) => log.note,
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (log) => (
        <div
          className="flex justify-end"
          onClick={(e) => e.stopPropagation()}
        >
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <div className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 outline-none cursor-pointer">
                <MoreVertical size={18} />
              </div>
            }
          >
            <DropdownItem
              onClick={() => setTimeout(() => handleView(log), 0)}
              className="text-gray-700 dark:text-gray-300 flex items-center cursor-pointer"
            >
              <Search size={14} className="mr-2" /> View Details
            </DropdownItem>
            <DropdownItem
              onClick={() => setTimeout(() => handleEdit(log), 0)}
              className="text-gray-700 dark:text-gray-300 flex items-center cursor-pointer"
            >
              <Edit3 size={14} className="mr-2" /> Edit Entry
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem
              onClick={() => setTimeout(() => handleDelete(log.id), 0)}
              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center cursor-pointer"
            >
              <Trash2 size={14} className="mr-2" /> Delete Entry
            </DropdownItem>
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 mb-2">
        <SearchInput
          placeholder="Search by note or phone..."
          value={search}
          onChange={setSearch}
          containerClassName="flex-1"
        />
      </div>

      <DataTable
        columns={columns}
        data={logs}
        loading={loading}
        keyExtractor={(log) => log.id}
        emptyMessage="No Logs Found"
        emptySubMessage="There are currently no logbook entries."
      />
    </div>
  );
}
