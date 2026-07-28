import React from "react";
import { Badge, Button, Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell } from '@/lib/flowbite-compat';
import { DollarSign, FileText, CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface PayrollRunTabProps {
  payrollRecords: any[];
  searchQuery: string;
  onSelectPayslip: (record: any) => void;
}

const PayrollRunTab: React.FC<PayrollRunTabProps> = ({
  payrollRecords,
  searchQuery,
  onSelectPayslip,
}) => {
  const filteredRecords = payrollRecords.filter((p) =>
    (p.employeeName || p.employeeId || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="border-none shadow-sm dark:bg-gray-800 rounded-md overflow-hidden bg-white">
        <Table hoverable className="w-full">
          <TableHead className="bg-gray-50 dark:bg-gray-700">
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase">Employee</TableHeadCell>
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase">Base Salary</TableHeadCell>
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase">Allowances</TableHeadCell>
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase">Deductions</TableHeadCell>
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase">Net Pay</TableHeadCell>
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase">Status</TableHeadCell>
            <TableHeadCell className="py-3.5 px-4 text-[10px] uppercase text-right">Actions</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y dark:divide-gray-700">
            {filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-xs font-bold text-gray-400 uppercase">
                  No payroll records found
                </TableCell>
              </TableRow>
            ) : (
              filteredRecords.map((p, idx) => (
                <TableRow key={p.id || idx} className="bg-white dark:bg-gray-800 hover:bg-gray-50">
                  <TableCell className="px-4 py-3 font-bold text-xs uppercase dark:text-white">
                    {p.employeeName || `EMP-${p.employeeId}`}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs font-mono font-bold">${p.baseSalary || 0}</TableCell>
                  <TableCell className="px-4 py-3 text-xs font-mono text-emerald-600">+${p.allowances || 0}</TableCell>
                  <TableCell className="px-4 py-3 text-xs font-mono text-rose-500">-${p.deductions || 0}</TableCell>
                  <TableCell className="px-4 py-3 text-xs font-mono font-black text-blue-600">${p.netPay || p.baseSalary || 0}</TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge color={p.status === "Paid" ? "success" : "warning"} className="text-[8px] uppercase">
                      {p.status || "Approved"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <Button size="xs" color="light" onClick={() => onSelectPayslip(p)} className="text-[9px] font-black uppercase">
                      <FileText size={12} className="mr-1 text-blue-600" /> View Payslip
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PayrollRunTab;
