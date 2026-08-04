import React from "react";
import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Badge, Dropdown, DropdownItem, DropdownDivider } from "@/lib/flowbite-compat";
import { Calendar, MoreVertical, User, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Props {
  state: any;
}

export default function PlacementsTableView({ state }: Props) {
  const {
    placements,
    visibleColumns,
    handleViewModal,
    handleOpenModal,
    handleDeleteClick,
  } = state;

  return (
    <div className="border-none shadow-lg dark:bg-gray-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto overflow-y-auto min-h-[400px] max-h-[55vh] custom-scrollbar pb-2">
        <Table className="dark:bg-gray-800 w-full min-w-[800px] relative">
          <TableHead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-20 shadow-sm border-b">
            <TableHeadCell className="font-black text-[9px] py-3 uppercase tracking-widest">Candidate</TableHeadCell>
            <TableHeadCell className="font-black text-[9px] py-3 uppercase tracking-widest">Enterprise Entity</TableHeadCell>
            {visibleColumns.includes("commencement") && (
              <TableHeadCell className="font-black text-[9px] py-3 uppercase tracking-widest">Commencement</TableHeadCell>
            )}
            {visibleColumns.includes("compensatory") && (
              <TableHeadCell className="font-black text-[9px] py-3 uppercase tracking-widest">Compensatory</TableHeadCell>
            )}
            {visibleColumns.includes("status") && (
              <TableHeadCell className="font-black text-[9px] py-3 uppercase tracking-widest">Status</TableHeadCell>
            )}
            <TableHeadCell className="text-right py-3">Action</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
            {placements.map((p: any, i: number) => (
              <TableRow key={i} className="bg-white dark:bg-gray-800 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors">
                <TableCell className="px-6 py-4 font-extrabold text-gray-900 dark:text-white text-sm">
                  {p.clientName || `Client #${p.clientId}`}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-black text-xs text-gray-950 dark:text-gray-100 uppercase tracking-tight">
                      {p.companyName}
                    </span>
                    <span className="text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md w-fit">
                      {p.placementType || "FIXED TERM"}
                    </span>
                  </div>
                </TableCell>
                {visibleColumns.includes("commencement") && (
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300">
                      <Calendar size={12} className="text-gray-400" />
                      <span>
                        {p.placementDate ? format(new Date(p.placementDate), "MMM dd, yyyy") : "N/A"}
                      </span>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.includes("compensatory") && (
                  <TableCell className="px-6 py-4 font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                    ${p.salary || "—"}
                  </TableCell>
                )}
                {visibleColumns.includes("status") && (
                  <TableCell className="px-6 py-4">
                    <Badge
                      color={
                        p.status?.toLowerCase() === "active"
                          ? "success"
                          : p.status?.toLowerCase() === "terminated"
                          ? "failure"
                          : "gray"
                      }
                      className={`w-fit rounded-md px-3 py-1 font-black text-[9px] uppercase tracking-widest ${
                        p.status?.toLowerCase() === "resigned"
                          ? "!bg-orange-100 !text-orange-700 dark:!bg-orange-900/40 dark:!text-orange-400"
                          : ""
                      }`}
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                )}
                <TableCell className="px-6 py-3 text-right">
                  <div className="flex justify-end">
                    <Dropdown
                      label={
                        <div className="p-2 text-gray-400 hover:text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md">
                          <MoreVertical size={16} />
                        </div>
                      }
                      arrowIcon={false}
                      inline
                      className="!z-[9999] backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border-none shadow-2xl !rounded-md p-2 min-w-[180px]"
                    >
                      <DropdownItem onClick={() => handleViewModal(p)} className="rounded-md mb-1 hover:bg-emerald-50 text-emerald-600">
                        <div className="flex items-center gap-3 py-1">
                          <User size={14} />
                          <span className="font-bold text-xs">View Details</span>
                        </div>
                      </DropdownItem>
                      <DropdownItem onClick={() => handleOpenModal(p)} className="rounded-md mb-1 hover:bg-blue-50 text-blue-600">
                        <div className="flex items-center gap-3 py-1">
                          <Edit size={14} />
                          <span className="font-bold text-xs">Edit Entry</span>
                        </div>
                      </DropdownItem>
                      <DropdownDivider className="my-1" />
                      <DropdownItem onClick={() => handleDeleteClick(p.id)} className="rounded-md hover:bg-rose-50 text-rose-600">
                        <div className="flex items-center gap-3 py-1">
                          <Trash2 size={14} />
                          <span className="font-bold text-xs">Remove Node</span>
                        </div>
                      </DropdownItem>
                    </Dropdown>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
