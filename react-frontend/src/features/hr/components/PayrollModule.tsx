import React, { useState } from "react";
import { Button, TextInput } from '@/lib/flowbite-compat';
import { DollarSign, Search, Plus, CreditCard, TrendingUp } from "lucide-react";

import PayrollRunTab from "./payroll/PayrollRunTab";
import PayslipModal from "./payroll/PayslipModal";

interface PayrollModuleProps {
  payrollRecords?: any[];
  globalPayroll?: any[];
  employees?: any;
  onProcessPayroll?: () => void;
  onProcess?: () => Promise<void>;
  onUpdateSalary?: (employeeId: number, salaryData: any) => Promise<void>;
  [key: string]: any;
}

const PayrollModule: React.FC<PayrollModuleProps> = ({
  payrollRecords = [],
  onProcessPayroll,
}) => {
  const [search, setSearch] = useState("");
  const [selectedPayslip, setSelectedPayslip] = useState<any>(null);

  const defaultRecords = payrollRecords.length > 0 ? payrollRecords : [
    { id: 1, employeeName: "Sokha Chan", department: "Engineering", baseSalary: 1800, allowances: 200, deductions: 50, netPay: 1950, status: "Paid", period: "June 2026" },
    { id: 2, employeeName: "Vandy Meas", department: "Retail & POS", baseSalary: 1500, allowances: 150, deductions: 30, netPay: 1620, status: "Approved", period: "June 2026" },
    { id: 3, employeeName: "Bopha Khem", department: "Clinic Operations", baseSalary: 1600, allowances: 100, deductions: 40, netPay: 1660, status: "Paid", period: "June 2026" },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><DollarSign size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">Monthly Payroll Budget</p>
            <h4 className="text-2xl font-black dark:text-white">$5,230.00</h4>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><CreditCard size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">Disbursed Staff Salaries</p>
            <h4 className="text-2xl font-black text-blue-600">3 Employees</h4>
          </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white p-5 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase opacity-80">Payroll Health</p>
            <h4 className="text-xl font-black">All Salaries Synced</h4>
          </div>
          {onProcessPayroll && (
            <Button color="success" size="xs" onClick={onProcessPayroll} className="font-black uppercase text-[10px] bg-emerald-500">
              Run Payroll
            </Button>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100">
        <h4 className="font-black text-sm uppercase dark:text-white px-2">Workforce Payroll Ledger</h4>
        <div className="w-64">
          <TextInput
            sizing="sm"
            placeholder="Search employee payslips..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
            className="text-xs"
          />
        </div>
      </div>

      {/* Payroll Table */}
      <PayrollRunTab
        payrollRecords={defaultRecords}
        searchQuery={search}
        onSelectPayslip={(record) => setSelectedPayslip(record)}
      />

      {/* Modal */}
      <PayslipModal
        show={!!selectedPayslip}
        onClose={() => setSelectedPayslip(null)}
        record={selectedPayslip}
      />
    </div>
  );
};

export default PayrollModule;
