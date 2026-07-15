import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import ModernPagination from "@/components/common/ModernPagination";

import {
  X, DollarSign, CreditCard, Calendar, TrendingUp, CheckCircle, Zap,
  Search, List, LayoutGrid, Download, Edit2, Wallet, Printer, MoreVertical
} from "lucide-react";

const salarySchema = z.object({
  basicSalary: z.number().min(0, "Salary cannot be negative"),
  allowances: z.number().min(0, "Cannot be negative"),
  deductions: z.number().min(0, "Cannot be negative"),
  taxRate: z.number().min(0).max(1, "Tax rate must be between 0 and 1"),
});

type SalaryFormData = z.infer<typeof salarySchema>;

interface PayrollModuleProps {
  globalPayroll: any[];
  employees: any[];
  onProcess: () => void;
  onUpdateSalary: (id: number, data: any) => Promise<void>;
}

const PayrollModule: React.FC<PayrollModuleProps> = ({
  globalPayroll,
  employees,
  onProcess,
  onUpdateSalary,
}) => {
  const [subView, setSubView] = useState<"DISBURSEMENTS" | "SALARIES">("DISBURSEMENTS");
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");

  const { register, handleSubmit: hookSubmit, setValue, formState: { errors } } = useForm<SalaryFormData>({
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

  const departments = ["ALL", ...new Set(safeEmployees.map((e) => e.department?.name || "Unassigned"))];

  const totalPaidLastMonth = safePayroll.length > 0
    ? safePayroll.reduce((sum, p) => sum + (p.totalAmount || 0), 0)
    : 0;

  const filteredEmployees = safeEmployees.filter((e) => {
    const name = `${e.firstNameEnglish} ${e.lastNameEnglish}`.toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === "ALL" || (e.department?.name || "Unassigned") === deptFilter;
    return matchesSearch && matchesDept && e.status === "Active";
  });

  const sortedPayroll = [...safePayroll].sort(
    (a, b) => new Date(b.processedDate).getTime() - new Date(a.processedDate).getTime()
  );

  const currentData = subView === "DISBURSEMENTS" ? sortedPayroll : filteredEmployees;
  const totalItems = currentData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedData = currentData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [subView, searchQuery, deptFilter]);

  const handleOpenEdit = (emp: any) => {
    setSelectedEmployee(emp);
    setValue("basicSalary", emp.basicSalary || 0);
    setValue("allowances", emp.allowances || 0);
    setValue("deductions", emp.deductions || 0);
    setValue("taxRate", emp.taxRate || 0);
    setIsEditModalOpen(true);
  };

  const onSalarySubmit = async (data: SalaryFormData) => {
    if (!selectedEmployee) return;
    try {
      setIsUpdating(true);
      await onUpdateSalary(selectedEmployee.id, data);
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
      "Gross Amount ($)": p.totalGrossAmount || 0,
      "Tax Deducted ($)": p.totalTaxDeducted || 0,
      "Net Payable ($)": p.totalNetPayable || p.totalAmount || 0,
      Status: p.status,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payroll Audit");
    XLSX.writeFile(wb, `Payroll_Audit_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
    toast.success("Audit report exported to Excel");
  };

  const generatePayslip = (row: any) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(30, 64, 175);
    doc.text("MTP ENTERPRISE PAYSLIP", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Reference: PAY-${(row.id || 0).toString().padStart(5, "0")}`, 105, 30, { align: "center" });
    doc.text(`Issue Date: ${format(new Date(row.processedDate || Date.now()), "MMMM dd, yyyy")}`, 105, 35, { align: "center" });

    autoTable(doc, {
      startY: 50,
      head: [["Description", "Details"]],
      body: [
        ["Payroll Cycle", format(new Date(row.processedDate || Date.now()), "MMMM yyyy")],
        ["Staff Processed", row.totalEmployeesProcessed.toString()],
        ["Total Gross", `$${(row.totalGrossAmount || 0).toLocaleString()}`],
        ["Total Tax Deducted", `$${(row.totalTaxDeducted || 0).toLocaleString()}`],
        ["Net Disbursement", `$${(row.totalNetPayable || row.totalAmount || 0).toLocaleString()}`],
        ["Status", row.status || "Verified"],
      ],
      theme: "striped",
      headStyles: { fillColor: [30, 64, 175] },
    });
    doc.setFontSize(8);
    doc.text("Note: This is a system-generated bulk disbursement summary slip.", 14, doc.internal.pageSize.height - 10);
    doc.save(`Payslip_${row.id}.pdf`);
    toast.success("Payslip generated successfully");
  };

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex bg-gray-100/80 dark:bg-gray-900/60 p-1.5 rounded-md shadow-inner w-full sm:w-max overflow-x-auto whitespace-nowrap no-scrollbar flex-nowrap shrink-0 gap-1.5">
          <button
            onClick={() => setSubView("DISBURSEMENTS")}
            className={`shrink-0 px-8 py-2.5 rounded-md text-[10px] font-black uppercase transition-all duration-300 flex items-center justify-center gap-2 ${subView === "DISBURSEMENTS" ? "bg-white dark:bg-gray-800 shadow-md text-blue-600 dark:text-blue-400 scale-100" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
          >
            <CreditCard size={14} /> Disbursements
          </button>
          <button
            onClick={() => setSubView("SALARIES")}
            className={`shrink-0 px-8 py-2.5 rounded-md text-[10px] font-black uppercase transition-all duration-300 flex items-center justify-center gap-2 ${subView === "SALARIES" ? "bg-white dark:bg-gray-800 shadow-md text-blue-600 dark:text-blue-400 scale-100" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
          >
            <List size={14} /> Salary Matrix
          </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {subView === "SALARIES" && (
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-[10px] font-black uppercase tracking-widest text-gray-500 shadow-sm h-10 focus:ring-0 px-4 min-w-[160px]"
            >
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          )}
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" onClick={exportPayrollAudit} className="h-10 px-6 font-black uppercase text-[10px]">
              <Download size={14} className="mr-2" /> Audit
            </Button>
            {subView === "DISBURSEMENTS" ? (
              <Button onClick={onProcess} className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] h-10 px-8 shadow-lg shadow-blue-500/20">
                <Zap size={14} className="mr-2 text-yellow-400" /> Run Payroll
              </Button>
            ) : (
              <div className="relative w-full md:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Search name..." className="pl-9 h-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={subView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {subView === "DISBURSEMENTS" ? (
            <div className="space-y-8">
              {/* Financial Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div variants={itemVariants} initial="hidden" animate="visible" className="p-8 rounded-xl dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-800 border-l-4 border-l-emerald-500 bg-white">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Total Monthly Payroll</p>
                  <h3 className="text-4xl font-black text-emerald-600">${totalPaidLastMonth.toLocaleString()}</h3>
                  <div className="mt-4 flex items-center gap-2 text-emerald-500 font-black uppercase text-[9px] tracking-widest">
                    <TrendingUp size={14} /> Efficiency: +4.2%
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} initial="hidden" animate="visible" className="p-8 rounded-xl dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-800 border-l-4 border-l-blue-500 bg-white">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Active Payees</p>
                  <h3 className="text-4xl font-black dark:text-white">{safeEmployees.length} Staff</h3>
                  <div className="mt-4 flex items-center -space-x-2 overflow-hidden">
                    {safeEmployees.slice(0, 4).map((e, i) => (
                      <Avatar key={i} className="border-2 border-white dark:border-gray-800 w-8 h-8">
                        <AvatarImage src={e.photo} />
                        <AvatarFallback>{e.firstNameEnglish?.[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                    {safeEmployees.length > 4 && (
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 text-[10px] font-bold z-10">
                        +{safeEmployees.length - 4}
                      </div>
                    )}
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} initial="hidden" animate="visible" className="p-8 rounded-xl shadow-sm bg-gradient-to-br from-gray-800 to-gray-950 text-white">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Next Run Cycle</p>
                  <h3 className="text-3xl font-black uppercase">May 31, 2024</h3>
                  <div className="mt-4 flex items-center gap-2 opacity-60">
                    <Calendar size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Settlement Node: Active</span>
                  </div>
                </motion.div>
              </div>

              {/* Disbursement Ledger */}
              <div className="border border-gray-200 dark:border-gray-800 shadow-sm dark:bg-gray-900 rounded-xl overflow-hidden bg-white">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-black dark:text-white uppercase tracking-tight">Disbursement Ledger</h4>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Audit-ready historical payroll data</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {viewMode === "grid" && (
                      <select
                        className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md text-xs h-9 border-none outline-none px-3 min-w-[100px] font-bold cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                        value={itemsPerRow}
                        onChange={(e) => setItemsPerRow(e.target.value)}
                      >
                        <option value="3">3 per row</option>
                        <option value="4">4 per row</option>
                        <option value="5">5 per row</option>
                      </select>
                    )}
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-md">
                      <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-600"}`}>
                        <LayoutGrid size={16} />
                      </button>
                      <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-600"}`}>
                        <List size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {viewMode === "list" ? (
                  <Table>
                    <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                      <TableRow className="border-b border-gray-200 dark:border-gray-800">
                        <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Reference ID</TableHead>
                        <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Processed Date</TableHead>
                        <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Staff Count</TableHead>
                        <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Gross Amount</TableHead>
                        <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Tax</TableHead>
                        <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Net Payable</TableHead>
                        <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</TableHead>
                        <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {safePayroll.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="py-24 text-center">
                            <CreditCard size={48} className="mx-auto text-gray-200 dark:text-gray-700 mb-4" />
                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No Payroll History Detected</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedData.map((row, i) => (
                          <TableRow key={row.id || i} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <TableCell className="px-6 py-4 font-mono text-xs font-black text-blue-600">
                              #PAY-{(row.id || 0).toString().padStart(5, "0")}
                            </TableCell>
                            <TableCell className="px-6 py-4 font-bold dark:text-gray-300">
                              {row.processedDate ? format(new Date(row.processedDate), "MMM dd, yyyy • HH:mm") : "Unscheduled"}
                            </TableCell>
                            <TableCell className="px-6 py-4 font-black dark:text-white">
                              {row.totalEmployeesProcessed} Personnel
                            </TableCell>
                            <TableCell className="px-6 py-4 text-lg font-black text-gray-500">
                              ${(row.totalGrossAmount || 0).toLocaleString()}
                            </TableCell>
                            <TableCell className="px-6 py-4 text-lg font-black text-red-500">
                              ${(row.totalTaxDeducted || 0).toLocaleString()}
                            </TableCell>
                            <TableCell className="px-6 py-4 text-lg font-black text-emerald-600 dark:text-emerald-400">
                              ${(row.totalNetPayable || row.totalAmount || 0).toLocaleString()}
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 border-none rounded-md px-2 py-1 text-[9px] font-black uppercase tracking-widest flex w-fit items-center gap-1.5">
                                <CheckCircle size={10} /> {row.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-6 py-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                                    <MoreVertical size={16} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => generatePayslip(row)} className="text-xs font-bold text-blue-600 cursor-pointer">
                                    <Printer size={14} className="mr-2" /> Print Slip
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                ) : (
                  <motion.div 
                    variants={containerVariants} 
                    initial="hidden" 
                    animate="visible" 
                    className={`grid gap-4 p-6 bg-gray-50/50 dark:bg-gray-900/50 ${itemsPerRow === "3" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : itemsPerRow === "5" ? "grid-cols-1 md:grid-cols-3 lg:grid-cols-5" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}`}
                  >
                    {paginatedData.map((row, i) => (
                      <motion.div key={row.id || i} variants={itemVariants} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden p-5 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 -mr-2 -mt-2">
                                <MoreVertical size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => generatePayslip(row)} className="text-xs font-bold cursor-pointer">
                                <Printer size={14} className="mr-2" /> Print Slip
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                            <Calendar size={14} className="text-gray-400" />
                            {row.processedDate ? format(new Date(row.processedDate), "MMM dd, yyyy") : "N/A"}
                          </div>
                          <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 border-none rounded-md px-2 py-0.5 text-[8px] font-black uppercase tracking-widest">
                            {row.status}
                          </Badge>
                        </div>
                        <div className="pt-3 border-t border-gray-100 dark:border-gray-700/50 flex gap-4 mt-auto">
                          <div className="flex flex-col flex-1">
                            <span className="text-[9px] font-black uppercase text-gray-400">Gross</span>
                            <span className="font-black text-gray-600 dark:text-gray-300">${(row.totalGrossAmount || 0).toLocaleString()}</span>
                          </div>
                          <div className="flex flex-col flex-1">
                            <span className="text-[9px] font-black uppercase text-gray-400">Net</span>
                            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                              ${(row.totalNetPayable || row.totalAmount || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {totalPages > 1 && (
                  <div className="p-4 border-t border-gray-100 dark:border-gray-800">
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
            </div>
          ) : (
            <div className="border border-gray-200 dark:border-gray-800 shadow-sm dark:bg-gray-900 rounded-xl overflow-hidden bg-white">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-black dark:text-white uppercase tracking-tight">Salary Matrix</h4>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Active staff salary configuration</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-md">
                    <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-600"}`}>
                      <LayoutGrid size={16} />
                    </button>
                    <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-600"}`}>
                      <List size={16} />
                    </button>
                  </div>
                  <Badge variant="secondary" className="rounded-md px-3 py-1 text-[9px] font-black uppercase tracking-widest">
                    {filteredEmployees.length} Records
                  </Badge>
                </div>
              </div>

              {viewMode === "list" ? (
                <Table>
                  <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                    <TableRow className="border-b border-gray-200 dark:border-gray-800">
                      <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Employee</TableHead>
                      <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Department</TableHead>
                      <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Position</TableHead>
                      <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Basic Salary</TableHead>
                      <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((e, i) => (
                      <TableRow key={e.id || i} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8 rounded-md">
                              <AvatarImage src={e.photo} />
                              <AvatarFallback className="rounded-md">{e.firstNameEnglish?.[0]}</AvatarFallback>
                            </Avatar>
                            <span className="font-black dark:text-white uppercase tracking-tight text-xs">
                              {e.firstNameEnglish} {e.lastNameEnglish}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <Badge variant="secondary" className="rounded-md font-black text-[9px] uppercase">
                            {e.department?.name || "Unassigned"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-xs font-bold text-gray-500">
                          {e.position?.name || "N/A"}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-sm font-black text-blue-600">
                          ${e.basicSalary?.toLocaleString() || "0"}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                                <MoreVertical size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenEdit(e)} className="text-xs font-bold text-blue-600 cursor-pointer">
                                <Edit2 size={14} className="mr-2" /> Modify Scale
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className={`grid gap-4 p-6 bg-gray-50/50 dark:bg-gray-900/50 ${itemsPerRow === "3" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : itemsPerRow === "5" ? "grid-cols-1 md:grid-cols-3 lg:grid-cols-5" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}`}>
                  {paginatedData.map((e, i) => (
                    <motion.div key={e.id || i} variants={itemVariants} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all rounded-xl p-5 flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 rounded-md">
                            <AvatarImage src={e.photo} />
                            <AvatarFallback className="rounded-md bg-blue-50 text-blue-600">{e.firstNameEnglish?.[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-black dark:text-white uppercase tracking-tight text-xs">
                              {e.firstNameEnglish} {e.lastNameEnglish}
                            </h4>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                              {e.position?.name || "Standard"}
                            </p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 -mr-2 -mt-1">
                              <MoreVertical size={14} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenEdit(e)} className="text-xs font-bold cursor-pointer">
                              <Edit2 size={14} className="mr-2" /> Modify Scale
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div>
                        <Badge variant="secondary" className="rounded-md px-2 font-black uppercase text-[8px]">
                          {e.department?.name || "Unassigned"}
                        </Badge>
                      </div>
                      <div className="pt-3 border-t border-gray-100 dark:border-gray-700/50 flex flex-col mt-auto">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Basic Salary</span>
                        <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                          ${e.basicSalary?.toLocaleString() || "0"}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {totalPages > 1 && (
                <div className="p-4 border-t border-gray-100 dark:border-gray-800">
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
        </motion.div>
      </AnimatePresence>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight">Adjust Salary Scale</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg flex items-center gap-4 border border-blue-100 dark:border-blue-900/30">
              <div className="p-2.5 bg-blue-600 rounded-md text-white shadow-sm">
                <Wallet size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-0.5">
                  Target Employee
                </p>
                <h4 className="text-sm font-black dark:text-white uppercase tracking-tight">
                  {selectedEmployee?.firstNameEnglish} {selectedEmployee?.lastNameEnglish}
                </h4>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="basicSalary" className="text-[10px] font-black uppercase tracking-widest text-gray-500">Basic Salary (USD)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    id="basicSalary" 
                    type="number" 
                    step="0.01" 
                    className="pl-10 h-12 font-black text-lg bg-gray-50/50 dark:bg-gray-900/50" 
                    {...register("basicSalary", { valueAsNumber: true })} 
                  />
                </div>
                {errors.basicSalary && <p className="text-red-500 text-[10px] font-bold">{errors.basicSalary.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="allowances" className="text-[10px] font-black uppercase tracking-widest text-gray-500">Allowances</Label>
                  <div className="relative">
                    <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="allowances" type="number" step="0.01" className="pl-10" {...register("allowances", { valueAsNumber: true })} />
                  </div>
                  {errors.allowances && <p className="text-red-500 text-[10px] font-bold">{errors.allowances.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deductions" className="text-[10px] font-black uppercase tracking-widest text-gray-500">Deductions</Label>
                  <div className="relative">
                    <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="deductions" type="number" step="0.01" className="pl-10" {...register("deductions", { valueAsNumber: true })} />
                  </div>
                  {errors.deductions && <p className="text-red-500 text-[10px] font-bold">{errors.deductions.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxRate" className="text-[10px] font-black uppercase tracking-widest text-gray-500">Tax Rate (e.g. 0.1 for 10%)</Label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input id="taxRate" type="number" step="0.01" className="pl-10" {...register("taxRate", { valueAsNumber: true })} />
                </div>
                {errors.taxRate && <p className="text-red-500 text-[10px] font-bold">{errors.taxRate.message}</p>}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="font-black uppercase text-[10px] tracking-widest h-10 px-6">
              Cancel
            </Button>
            <Button onClick={hookSubmit(onSalarySubmit)} disabled={isUpdating} className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest h-10 px-6">
              {isUpdating ? <Spinner className="mr-2 h-4 w-4" /> : null}
              {isUpdating ? "Syncing..." : "Sync Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PayrollModule;
