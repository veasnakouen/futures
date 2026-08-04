import React from "react";
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell, Badge } from "@/lib/flowbite-compat";
import { ArrowUp, ArrowDown, ArrowUpDown, Edit3, Trash2, ExternalLink } from "lucide-react";

interface Props {
  state: any;
}

export default function WorkforceTableView({ state }: Props) {
  const {
    visibleCols,
    sortField,
    sortDir,
    handleSort,
    paginatedEmployees,
    setSelectedEmployee,
    actualOnEdit,
    actualOnDelete,
  } = state;

  return (
    <div className="bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-100 dark:border-gray-700/80 shadow-sm overflow-hidden space-y-3">
      <div className="overflow-x-auto">
        <Table hoverable className="w-full text-left text-xs">
          <TableHead className="bg-gray-50/70 dark:bg-gray-700/50 text-[10px] uppercase font-black tracking-widest text-gray-400 select-none">
            <TableRow>
              {visibleCols.photo && (
                <TableHeadCell
                  onClick={() => handleSort("name")}
                  className="py-4 px-6 cursor-pointer hover:text-blue-600 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Personnel Member</span>
                    {sortField === "name" ? (
                      sortDir === "asc" ? <ArrowUp size={12} className="text-blue-600" /> : <ArrowDown size={12} className="text-blue-600" />
                    ) : (
                      <ArrowUpDown size={12} />
                    )}
                  </div>
                </TableHeadCell>
              )}

              {visibleCols.code && (
                <TableHeadCell
                  onClick={() => handleSort("code")}
                  className="py-4 px-6 cursor-pointer hover:text-blue-600 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Employee ID</span>
                    {sortField === "code" ? (
                      sortDir === "asc" ? <ArrowUp size={12} className="text-blue-600" /> : <ArrowDown size={12} className="text-blue-600" />
                    ) : (
                      <ArrowUpDown size={12} />
                    )}
                  </div>
                </TableHeadCell>
              )}

              {visibleCols.deptPos && (
                <TableHeadCell
                  onClick={() => handleSort("department")}
                  className="py-4 px-6 cursor-pointer hover:text-blue-600 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Department & Position</span>
                    {sortField === "department" ? (
                      sortDir === "asc" ? <ArrowUp size={12} className="text-blue-600" /> : <ArrowDown size={12} className="text-blue-600" />
                    ) : (
                      <ArrowUpDown size={12} />
                    )}
                  </div>
                </TableHeadCell>
              )}

              {visibleCols.branch && <TableHeadCell className="py-4 px-6">Branch Office</TableHeadCell>}

              {visibleCols.salary && (
                <TableHeadCell
                  onClick={() => handleSort("salary")}
                  className="py-4 px-6 cursor-pointer hover:text-blue-600 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Salary Rate</span>
                    {sortField === "salary" ? (
                      sortDir === "asc" ? <ArrowUp size={12} className="text-blue-600" /> : <ArrowDown size={12} className="text-blue-600" />
                    ) : (
                      <ArrowUpDown size={12} />
                    )}
                  </div>
                </TableHeadCell>
              )}

              {visibleCols.status && (
                <TableHeadCell
                  onClick={() => handleSort("status")}
                  className="py-4 px-6 cursor-pointer hover:text-blue-600 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    {sortField === "status" ? (
                      sortDir === "asc" ? <ArrowUp size={12} className="text-blue-600" /> : <ArrowDown size={12} className="text-blue-600" />
                    ) : (
                      <ArrowUpDown size={12} />
                    )}
                  </div>
                </TableHeadCell>
              )}

              {visibleCols.actions && <TableHeadCell className="py-4 px-6 text-right">Actions</TableHeadCell>}
            </TableRow>
          </TableHead>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-700/60">
            {paginatedEmployees.map((emp: any) => {
              const fullName = `${emp.firstName || emp.firstNameEnglish || ""} ${emp.lastName || emp.lastNameEnglish || ""}`.trim();
              const code = emp.clientCode || emp.employeeId || emp.idNo || `EMP-${emp.id}`;
              const dept = emp.departmentName || emp.department?.name || emp.department || "General";
              const pos = emp.positionName || emp.position?.name || emp.title || "Staff Member";
              const branch = emp.branch || emp.address || "Main Office";
              const status = emp.status || "Active";
              const salary = emp.basicSalary || emp.salary || 0;

              return (
                <TableRow key={emp.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-colors">
                  {visibleCols.photo && (
                    <TableCell className="py-3 px-6 font-bold text-gray-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
                          alt={fullName}
                          className="w-8 h-8 rounded-full object-cover shadow-xs border border-gray-200 dark:border-gray-700"
                        />
                        <span>{fullName}</span>
                      </div>
                    </TableCell>
                  )}

                  {visibleCols.code && (
                    <TableCell className="py-3 px-6 font-mono text-gray-500 font-bold">{code}</TableCell>
                  )}

                  {visibleCols.deptPos && (
                    <TableCell className="py-3 px-6">
                      <div className="font-bold text-gray-800 dark:text-gray-200">{dept}</div>
                      <div className="text-[10px] text-gray-400 font-semibold">{pos}</div>
                    </TableCell>
                  )}

                  {visibleCols.branch && (
                    <TableCell className="py-3 px-6 font-medium text-gray-600 dark:text-gray-400">{branch}</TableCell>
                  )}

                  {visibleCols.salary && (
                    <TableCell className="py-3 px-6 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ${Number(salary).toLocaleString()}
                    </TableCell>
                  )}

                  {visibleCols.status && (
                    <TableCell className="py-3 px-6">
                      <Badge
                        color={
                          status.toLowerCase().includes("active")
                            ? "success"
                            : status.toLowerCase().includes("leave")
                            ? "warning"
                            : "info"
                        }
                        className="rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider"
                      >
                        {status}
                      </Badge>
                    </TableCell>
                  )}

                  {visibleCols.actions && (
                    <TableCell className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedEmployee(emp)}
                          className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="View Detail Profile"
                        >
                          <ExternalLink size={14} />
                        </button>
                        <button
                          onClick={() => actualOnEdit(emp)}
                          className="p-1 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="Edit Staff Member"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => actualOnDelete(emp.id)}
                          className="p-1 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="Remove Staff"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
