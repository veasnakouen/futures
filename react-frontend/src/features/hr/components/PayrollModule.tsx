import React, { useState } from "react";
import {Button, Badge, TextInput, Label, Avatar, Tooltip, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Modal, ModalHeader, ModalBody, ModalFooter, AvatarGroup, AvatarGroupCounter, Spinner, Dropdown, DropdownItem, DropdownDivider} from '@/lib/flowbite-compat';
import ModernPagination from '@/components/common/ModernPagination';
import {
  X,
  DollarSign,
  CreditCard,
  Calendar,
  TrendingUp,
  CheckCircle,
  Zap,
  Users,
  Search,
  List,
  Filter,
  Download,
  Edit2,
  Wallet,
  Printer,
  MoreVertical,
  LayoutGrid,
} from "lucide-react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";

const salarySchema = z.object({
  basicSalary: z.number().min(0, "Salary cannot be negative"),
});

type SalaryFormData = z.infer<typeof salarySchema>;

interface PayrollModuleProps {
  globalPayroll: any[];
  employees: any[];
  onProcess: () => void;
  onUpdateSalary: (id: number, newSalary: number) => Promise<void>;
}

const PayrollModule: React.FC<PayrollModuleProps> = ({
  globalPayroll,
  employees,
  onProcess,
  onUpdateSalary,
}) => {
  const [subView, setSubView] = useState<"DISBURSEMENTS" | "SALARIES">(
    "DISBURSEMENTS",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");

  // Edit Salary Hook
  const {
    register,
    handleSubmit: hookSubmit,
    setValue,
    formState: { errors },
  } = useForm<SalaryFormData>({
    resolver: zodResolver(salarySchema),
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [itemsPerRow, setItemsPerRow] = useState("4");

  const safePayroll = Array.isArray(globalPayroll) ? globalPayroll : [];
  const safeEmployees = Array.isArray(employees) ? employees : [];

  // Unique Departments for filter
  const departments = [
    "ALL",
    ...new Set(safeEmployees.map((e) => e.department?.name || "Unassigned")),
  ];

  // Financial Analytics
  const totalPaidLastMonth =
    safePayroll.length > 0
      ? safePayroll.reduce((sum, p) => sum + (p.totalAmount || 0), 0)
      : 0;

  const latestRun =
    safePayroll.length > 0
      ? [...safePayroll].sort(
          (a, b) =>
            new Date(b.processedDate).getTime() -
            new Date(a.processedDate).getTime(),
        )[0]
      : null;

  const filteredEmployees = safeEmployees.filter((e) => {
    const name = `${e.firstNameEnglish} ${e.lastNameEnglish}`.toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase());
    const matchesDept =
      deptFilter === "ALL" ||
      (e.department?.name || "Unassigned") === deptFilter;
    return matchesSearch && matchesDept && e.status === "Active";
  });

  const sortedPayroll = [...safePayroll].sort(
    (a, b) =>
      new Date(b.processedDate).getTime() - new Date(a.processedDate).getTime(),
  );

  const currentData =
    subView === "DISBURSEMENTS" ? sortedPayroll : filteredEmployees;
  const totalItems = currentData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedData = currentData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [subView, searchQuery, deptFilter]);

  const handleOpenEdit = (emp: any) => {
    setSelectedEmployee(emp);
    setValue("basicSalary", emp.basicSalary || 0);
    setIsEditModalOpen(true);
  };

  const onSalarySubmit = async (data: SalaryFormData) => {
    if (!selectedEmployee) return;
    try {
      setIsUpdating(true);
      await onUpdateSalary(selectedEmployee.id, data.basicSalary);
      setIsEditModalOpen(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const exportPayrollAudit = () => {
    const data = safePayroll.map((p) => ({
      "Reference ID": `PAY-${(p.id || 0).toString().padStart(5, "0")}`,
      Date: format(new Date(p.processedDate), "yyyy-MM-dd HH:mm"),
      Employees: p.totalEmployeesProcessed,
      "Total Amount ($)": p.totalAmount,
      Status: p.status,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payroll Audit");
    XLSX.writeFile(
      wb,
      `Payroll_Audit_${format(new Date(), "yyyy-MM-dd")}.xlsx`,
    );
    toast.success("Audit report exported to Excel");
  };

  const generatePayslip = (row: any) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(30, 64, 175);
    doc.text("MTP ENTERPRISE PAYSLIP", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      `Reference: PAY-${(row.id || 0).toString().padStart(5, "0")}`,
      105,
      30,
      { align: "center" },
    );
    doc.text(
      `Issue Date: ${format(new Date(row.processedDate || Date.now()), "MMMM dd, yyyy")}`,
      105,
      35,
      { align: "center" },
    );

    autoTable(doc, {
      startY: 50,
      head: [["Description", "Details"]],
      body: [
        [
          "Payroll Cycle",
          format(new Date(row.processedDate || Date.now()), "MMMM yyyy"),
        ],
        ["Staff Processed", row.totalEmployeesProcessed.toString()],
        ["Total Disbursement", `$${row.totalAmount?.toLocaleString()}`],
        ["Status", row.status || "Verified"],
      ],
      theme: "striped",
      headStyles: { fillColor: [30, 64, 175] },
    });
    doc.setFontSize(8);
    doc.text(
      "Note: This is a system-generated bulk disbursement summary slip.",
      14,
      doc.internal.pageSize.height - 10,
    );
    doc.save(`Payslip_${row.id}.pdf`);
    toast.success("Payslip generated successfully");
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex bg-gray-100/80 dark:bg-gray-900/60 p-1.5 rounded-md /50 shadow-inner w-full sm:w-max overflow-x-auto whitespace-nowrap no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex-nowrap shrink-0 gap-1.5">
          <button
            onClick={() => setSubView("DISBURSEMENTS")}
            className={`shrink-0 px-8 py-2.5 rounded-md text-[10px] font-black uppercase transition-all duration-300 flex items-center justify-center gap-2 ${subView ==="DISBURSEMENTS"?"bg-white dark:bg-gray-800 shadow-md text-blue-600 dark:text-blue-400 scale-100":"text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
          >
            <CreditCard size={14} /> Disbursements
          </button>
          <button
            onClick={() => setSubView("SALARIES")}
            className={`shrink-0 px-8 py-2.5 rounded-md text-[10px] font-black uppercase transition-all duration-300 flex items-center justify-center gap-2 ${subView ==="SALARIES"?"bg-white dark:bg-gray-800 shadow-md text-blue-600 dark:text-blue-400 scale-100":"text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
          >
            <List size={14} /> Salary Matrix
          </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {subView === "SALARIES" && (
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-white dark:bg-gray-800 border-none rounded-md text-[10px] font-black uppercase tracking-widest text-gray-500 shadow-sm h-12 focus:ring-0 px-6 min-w-[160px]"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          )}
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              color="light"
              onClick={exportPayrollAudit}
              className="rounded-md h-12 px-6 font-black uppercase text-[10px] border-none shadow-sm dark:bg-gray-800 dark:text-white"
            >
              <Download size={18} className="mr-2" /> Audit
            </Button>
            {subView === "DISBURSEMENTS" ? (
              <Button
                onClick={onProcess}
                color="blue"
                className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 font-black uppercase text-[10px] rounded-md h-12 shadow-lg shadow-blue-500/20 border-none px-8"
              >
                <Zap size={16} className="mr-2 text-yellow-400" /> Run Payroll
              </Button>
            ) : (
              <div className="relative w-full md:w-64">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <TextInput
                  placeholder="Search name..."
                  className="pl-10 rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {subView === "DISBURSEMENTS" ? (
        <>
          {/* Financial Command Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-md dark:bg-gray-800 border-none shadow-sm flex flex-col justify-between border-l-4 border-l-emerald-500 bg-white/50 backdrop-blur-xl">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                  Total Monthly Payroll
                </p>
                <h3 className="text-4xl font-black dark:text-white text-emerald-600">
                  ${totalPaidLastMonth.toLocaleString()}
                </h3>
              </div>
              <div className="mt-4 flex items-center gap-2 text-emerald-500 font-black uppercase text-[9px] tracking-widest">
                <TrendingUp size={14} /> Efficiency: +4.2%
              </div>
            </div>
            <div className="p-8 rounded-md dark:bg-gray-800 border-none shadow-sm border-l-4 border-l-blue-500">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                Active Payees
              </p>
              <h3 className="text-4xl font-black dark:text-white">
                {safeEmployees.length} Staff
              </h3>
              <div className="mt-4 flex items-center gap-1">
                <AvatarGroup>
                  {safeEmployees.slice(0, 4).map((e, i) => (
                    <Avatar key={i} img={e.photo} rounded stacked size="xs" />
                  ))}
                  {safeEmployees.length > 4 && (
                    <AvatarGroupCounter total={safeEmployees.length - 4} />
                  )}
                </AvatarGroup>
              </div>
            </div>
            <div className="p-8 rounded-md dark:bg-gray-800 border-none shadow-sm bg-gradient-to-br from-gray-800 to-gray-900 text-white">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">
                Next Run Cycle
              </p>
              <h3 className="text-3xl font-black uppercase">May 31, 2024</h3>
              <div className="mt-4 flex items-center gap-2 opacity-60">
                <Calendar size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  Settlement Node: Active
                </span>
              </div>
            </div>
          </div>

          {/* Payroll Ledger */}
          <div className="border-none shadow-sm dark:bg-gray-800 rounded-md overflow-hidden">
            <div className="p-8 border-b bg-gray-50/50 dark:bg-gray-700/20 flex justify-between items-center">
              <div>
                <h4 className="text-xl font-black dark:text-white uppercase tracking-tight">
                  Disbursement Ledger
                </h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                  Audit-ready historical payroll data
                </p>
              </div>
              <div className="flex items-center gap-3">
                {viewMode === "grid" && (
                  <div className="flex-shrink-0">
                    <select
                      className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-0 focus:border-transparent transition-all duration-200 text-xs h-9 border-none outline-none px-3 min-w-[100px] font-bold cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                      value={itemsPerRow}
                      onChange={(e) => setItemsPerRow(e.target.value)}
                    >
                      <option value="3">3 per row</option>
                      <option value="4">4 per row</option>
                      <option value="5">5 per row</option>
                    </select>
                  </div>
                )}
                <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-md">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-md transition-all ${viewMode ==="grid"?"bg-white dark:bg-gray-600 shadow-sm text-blue-600":"text-gray-400 hover:text-gray-600"}`}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-md transition-all ${viewMode ==="list"?"bg-white dark:bg-gray-600 shadow-sm text-blue-600":"text-gray-400 hover:text-gray-600"}`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {viewMode === "list" ? (
              <Table hoverable className="border-none">
                <TableHead className="bg-gray-50/50 dark:bg-gray-800/50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <TableHeadCell className="px-8 py-3">
                    Reference ID
                  </TableHeadCell>
                  <TableHeadCell className="px-8 py-3">
                    Processed Date
                  </TableHeadCell>
                  <TableHeadCell className="px-8 py-3">
                    Staff Count
                  </TableHeadCell>
                  <TableHeadCell className="px-8 py-3">
                    Total Amount
                  </TableHeadCell>
                  <TableHeadCell className="px-8 py-3">Status</TableHeadCell>
                  <TableHeadCell className="px-8 py-3 text-right">
                    Actions
                  </TableHeadCell>
                </TableHead>
                <TableBody className="divide-y dark:divide-gray-700">
                  {safePayroll.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-24 text-center">
                        <CreditCard
                          size={48}
                          className="mx-auto text-gray-300 mb-4"
                        />
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
                          No Payroll History Detected
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((row, i) => (
                      <TableRow
                        key={row.id || i}
                        className="bg-white dark:bg-gray-800 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/30"
                      >
                        <TableCell className="px-8 py-3 font-mono text-xs font-black text-blue-600">
                          #PAY-{(row.id || 0).toString().padStart(5, "0")}
                        </TableCell>
                        <TableCell className="px-8 py-3 font-bold dark:text-white">
                          {row.processedDate
                            ? format(
                                new Date(row.processedDate),
                                "MMM dd, yyyy • HH:mm",
                              )
                            : "Unscheduled"}
                        </TableCell>
                        <TableCell className="px-8 py-3 font-black dark:text-white">
                          {row.totalEmployeesProcessed} Personnel
                        </TableCell>
                        <TableCell className="px-8 py-3 text-lg font-black dark:text-white">
                          ${row.totalAmount?.toLocaleString()}
                        </TableCell>
                        <TableCell className="px-8 py-3">
                          <Badge
                            color="success"
                            className="rounded-md flex w-fit items-center gap-2 px-3 py-1 text-[9px] font-black uppercase tracking-widest"
                          >
                            <CheckCircle size={10} /> {row.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-8 py-3 text-right">
                          <div className="flex justify-end">
                            <Dropdown
                              label={
                                <div className="p-2 text-gray-400 hover:text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md">
                                  <MoreVertical size={16} />
                                </div>
                              }
                              arrowIcon={false}
                              inline
                              className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border-none shadow-md rounded-md"
                            >
                              <DropdownItem
                                onClick={() => generatePayslip(row)}
                                className="font-bold text-xs text-blue-600"
                              >
                                <div className="flex items-center gap-2">
                                  <Printer size={14} />
                                  <span>Print Slip</span>
                                </div>
                              </DropdownItem>
                            </Dropdown>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            ) : (
              <div className={`grid gap-4 p-6 bg-gray-50/30 dark:bg-gray-900/10 ${ itemsPerRow ==="3"?"grid-cols-1 md:grid-cols-2 lg:grid-cols-3": itemsPerRow ==="5"?"grid-cols-1 md:grid-cols-3 lg:grid-cols-5":"grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}`}>
                {paginatedData.map((row, i) => (
                  <div
                    key={row.id || i}
                    className="border-none shadow-sm hover:shadow-lg transition-all dark:bg-gray-800 p-0 overflow-hidden rounded-md"
                  >
                    <div className="p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                            <Wallet size={20} />
                          </div>
                          <div>
                            <h4 className="font-black dark:text-white uppercase tracking-tight text-sm">
                              #PAY-{(row.id || 0).toString().padStart(5, "0")}
                            </h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              {row.totalEmployeesProcessed} Personnel
                            </p>
                          </div>
                        </div>
                        <Dropdown
                          label={
                            <div className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-md">
                              <MoreVertical size={16} />
                            </div>
                          }
                          arrowIcon={false}
                          inline
                        >
                          <DropdownItem onClick={() => generatePayslip(row)}>
                            <Printer size={14} className="mr-2" /> Print Slip
                          </DropdownItem>
                        </Dropdown>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                          <Calendar size={14} className="text-gray-400" />{" "}
                          {row.processedDate
                            ? format(
                                new Date(row.processedDate),
                                "MMM dd, yyyy",
                              )
                            : "N/A"}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            color="success"
                            size="xs"
                            className="rounded-md px-2 font-black uppercase text-[8px]"
                          >
                            {row.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <span className="text-xl font-black dark:text-white">
                          ${row.totalAmount?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="p-4 border-t">
                <ModernPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={totalItems}
                  pageSize={pageSize}
                  onPageSizeChange={setPageSize}
                />
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="border-none shadow-sm dark:bg-gray-800 rounded-md overflow-hidden">
          <div className="p-4 border-b bg-gray-50/50 dark:bg-gray-700/20 flex justify-between items-center">
            <div>
              <h4 className="text-xl font-black dark:text-white uppercase tracking-tight">
                Salary Matrix
              </h4>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                Active staff salary configuration
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-md">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${viewMode ==="grid"?"bg-white dark:bg-gray-600 shadow-sm text-blue-600":"text-gray-400 hover:text-gray-600"}`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all ${viewMode ==="list"?"bg-white dark:bg-gray-600 shadow-sm text-blue-600":"text-gray-400 hover:text-gray-600"}`}
                >
                  <List size={18} />
                </button>
              </div>
              <Badge
                color="info"
                className="rounded-md px-4 py-1 text-[9px] font-black uppercase tracking-widest"
              >
                {filteredEmployees.length} Active Records
              </Badge>
            </div>
          </div>

          {viewMode === "list" ? (
            <Table hoverable className="border-none">
              <TableHead className="bg-gray-50/50 dark:bg-gray-800/50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <TableHeadCell className="px-8 py-3">Employee</TableHeadCell>
                <TableHeadCell className="px-8 py-3">Department</TableHeadCell>
                <TableHeadCell className="px-8 py-3">Position</TableHeadCell>
                <TableHeadCell className="px-8 py-3">
                  Basic Salary
                </TableHeadCell>
                <TableHeadCell className="px-8 py-3 text-right">
                  Actions
                </TableHeadCell>
              </TableHead>
              <TableBody className="divide-y dark:divide-gray-700">
                {paginatedData.map((e, i) => (
                  <TableRow
                    key={e.id || i}
                    className="bg-white dark:bg-gray-800 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/30"
                  >
                    <TableCell className="px-8 py-3">
                      <div className="flex items-center gap-4">
                        <Avatar img={e.photo} rounded size="sm" />
                        <span className="font-black dark:text-white uppercase tracking-tight">
                          {e.firstNameEnglish} {e.lastNameEnglish}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-3">
                      <Badge
                        color="gray"
                        className="rounded-md font-black text-[9px] uppercase"
                      >
                        {e.department?.name || "Unassigned"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-8 py-3 text-xs font-bold dark:text-gray-400">
                      {e.position?.name || "N/A"}
                    </TableCell>
                    <TableCell className="px-8 py-3 text-lg font-black text-blue-600">
                      ${e.basicSalary?.toLocaleString() || "0"}
                    </TableCell>
                    <TableCell className="px-8 py-3 text-right">
                      <div className="flex justify-end">
                        <Dropdown
                          label={
                            <div className="p-2 text-gray-400 hover:text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md">
                              <MoreVertical size={16} />
                            </div>
                          }
                          arrowIcon={false}
                          inline
                          className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border-none shadow-md rounded-md"
                        >
                          <DropdownItem
                            onClick={() => handleOpenEdit(e)}
                            className="font-bold text-xs text-blue-600"
                          >
                            <div className="flex items-center gap-2">
                              <Edit2 size={14} />
                              <span>Modify Scale</span>
                            </div>
                          </DropdownItem>
                        </Dropdown>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className={`grid gap-4 p-4 bg-gray-50/30 dark:bg-gray-900/10 ${ itemsPerRow ==="3"?"grid-cols-1 md:grid-cols-2 lg:grid-cols-3": itemsPerRow ==="5"?"grid-cols-1 md:grid-cols-3 lg:grid-cols-5":"grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}`}>
              {paginatedData.map((e, i) => (
                <div
                  key={e.id || i}
                  className="border-none shadow-sm hover:shadow-lg transition-all dark:bg-gray-800 p-0 overflow-hidden rounded-md"
                >
                  <div className="p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar img={e.photo} rounded size="md" />
                        <div>
                          <h4 className="font-black dark:text-white uppercase tracking-tight text-sm">
                            {e.firstNameEnglish} {e.lastNameEnglish}
                          </h4>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {e.position?.name || "Standard"}
                          </p>
                        </div>
                      </div>
                      <Dropdown
                        label={
                          <div className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-md">
                            <MoreVertical size={16} />
                          </div>
                        }
                        arrowIcon={false}
                        inline
                      >
                        <DropdownItem onClick={() => handleOpenEdit(e)}>
                          <Edit2 size={14} className="mr-2" /> Modify Scale
                        </DropdownItem>
                      </Dropdown>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        color="gray"
                        size="xs"
                        className="rounded-md px-2 font-black uppercase text-[8px]"
                      >
                        {e.department?.name || "Unassigned"}
                      </Badge>
                    </div>
                    <div className="pt-2 border-t flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                          Basic Salary
                        </span>
                        <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                          ${e.basicSalary?.toLocaleString() || "0"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="p-4 border-t">
              <ModernPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
              />
            </div>
          )}
        </div>
      )}

      {/* Modify Salary Modal */}
      <Modal
        show={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        size="md"
      >
        <div className="absolute top-4 right-4 z-50">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(false)}
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 p-2 rounded-md shadow-sm"
          >
            <X size={20} />
          </button>
        </div>
        <ModalHeader>Adjust Salary Scale</ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-md text-white">
                <Wallet size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                  Employee
                </p>
                <h4 className="text-sm font-black dark:text-white uppercase">
                  {selectedEmployee?.firstNameEnglish}{" "}
                  {selectedEmployee?.lastNameEnglish}
                </h4>
              </div>
            </div>

            <div>
              <Label
                htmlFor="salary"
                className="text-[10px] font-black uppercase text-gray-400 mb-2 block"
              >
                New Basic Salary (USD)
              </Label>
              <TextInput
                id="salary"
                type="number"
                {...register("basicSalary", { valueAsNumber: true })}
                icon={DollarSign}
                placeholder="e.g. 1200"
                color={errors.basicSalary ? "failure" : undefined}
              />
              {errors.basicSalary && (
                <p className="text-[10px] font-bold text-red-500 mt-1">
                  {errors.basicSalary.message}
                </p>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="blue"
            onClick={hookSubmit(onSalarySubmit)}
            disabled={isUpdating}
            className="bg-blue-600 hover:bg-blue-700 font-black uppercase text-[10px] tracking-widest px-4 h-12"
          >
            {isUpdating ? <Spinner size="sm" className="mr-2" /> : null}
            {isUpdating ? "Syncing..." : "Sync Update"}
          </Button>
          <Button
            color="gray"
            onClick={() => setIsEditModalOpen(false)}
            className="font-black uppercase text-[10px] tracking-widest px-4"
          >
            Discard
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default PayrollModule;
