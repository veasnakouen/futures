import React from "react";
import { Table, TableHead, TableHeadCell, TableRow, TableCell, Badge, Dropdown, DropdownItem } from "@/lib/flowbite-compat";
import { Building2, Globe, Search, Edit, Trash2 } from "lucide-react";

interface Props {
  state: any;
}

export default function EmployersTableView({ state }: Props) {
  const {
    t,
    employers,
    visibleColumns,
    handleView,
    handleEdit,
    setItemToDelete,
    setIsConfirmOpen,
    toggleB2BConnection,
    connectedEmployers,
  } = state;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm bg-white dark:bg-gray-800">
      <Table hoverable className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <TableHead className="bg-gray-50/80 dark:bg-gray-800/80 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          <TableHeadCell>Company Name</TableHeadCell>
          {visibleColumns.includes("category") && <TableHeadCell>Category</TableHeadCell>}
          {visibleColumns.includes("contact") && <TableHeadCell>Contact Person</TableHeadCell>}
          {visibleColumns.includes("phone") && <TableHeadCell>Phone Number</TableHeadCell>}
          {visibleColumns.includes("status") && <TableHeadCell>Status</TableHeadCell>}
          <TableHeadCell className="text-right">Actions</TableHeadCell>
        </TableHead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
          {employers.map((emp: any) => (
            <TableRow key={emp.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-all">
              <TableCell className="font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-black">
                  {emp.logoUrl ? (
                    <img src={emp.logoUrl} alt={emp.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <Building2 size={16} />
                  )}
                </div>
                <div>
                  <p className="font-bold text-xs">{emp.name}</p>
                  {connectedEmployers.includes(emp.id) && (
                    <span className="text-[9px] text-purple-600 font-bold">B2B Partner</span>
                  )}
                </div>
              </TableCell>

              {visibleColumns.includes("category") && (
                <TableCell className="text-xs font-semibold text-gray-600">
                  {emp.jobCategoryName || emp.category || "General Industry"}
                </TableCell>
              )}

              {visibleColumns.includes("contact") && (
                <TableCell className="text-xs font-medium text-gray-600">
                  {emp.contactPerson || emp.contactPersonName || "N/A"}
                </TableCell>
              )}

              {visibleColumns.includes("phone") && (
                <TableCell className="text-xs font-mono text-gray-500">
                  {emp.contactPhone || emp.contactPersonPhone || "N/A"}
                </TableCell>
              )}

              {visibleColumns.includes("status") && (
                <TableCell>
                  <Badge color={emp.status === "Active" ? "success" : "warning"} className="text-[10px] font-black uppercase">
                    {emp.status || "Active"}
                  </Badge>
                </TableCell>
              )}

              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <button onClick={() => handleView(emp)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                    <Search size={14} />
                  </button>
                  <button onClick={() => handleEdit(emp)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => {
                      setItemToDelete(emp.id);
                      setIsConfirmOpen(true);
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
