import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@/lib/flowbite-compat';
import { DollarSign, Printer, Download } from "lucide-react";

interface PayslipModalProps {
  show: boolean;
  onClose: () => void;
  record: any;
}

const PayslipModal: React.FC<PayslipModalProps> = ({ show, onClose, record }) => {
  if (!record) return null;

  return (
    <Modal show={show} onClose={onClose} size="lg">
      <ModalHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center gap-2">
          <DollarSign size={20} className="text-emerald-300" />
          <span className="font-black">Employee Monthly Payslip Statement</span>
        </div>
      </ModalHeader>
      <ModalBody className="p-6 bg-white dark:bg-gray-800 space-y-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border flex justify-between items-center">
          <div>
            <h4 className="font-black dark:text-white text-base uppercase">{record.employeeName || "Employee"}</h4>
            <p className="text-xs text-gray-500 font-bold uppercase">{record.department || "Engineering"} &bull; {record.period || "Current Month"}</p>
          </div>
          <span className="text-2xl font-black text-blue-600">${record.netPay || record.baseSalary || 0}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100">
            <p className="text-[9px] font-black text-emerald-600 uppercase mb-1">Base Salary</p>
            <p className="font-mono font-black text-lg">${record.baseSalary || 0}</p>
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100">
            <p className="text-[9px] font-black text-emerald-600 uppercase mb-1">Allowances</p>
            <p className="font-mono font-black text-lg text-emerald-600">+${record.allowances || 0}</p>
          </div>
        </div>

        <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-100 text-xs">
          <p className="text-[9px] font-black text-rose-600 uppercase mb-1">Deductions (Tax / NSSF)</p>
          <p className="font-mono font-black text-lg text-rose-600">-${record.deductions || 0}</p>
        </div>
      </ModalBody>
      <ModalFooter className="gap-2">
        <Button color="gray" onClick={onClose} className="font-black uppercase text-[10px] h-10">Close</Button>
        <Button color="blue" onClick={() => window.print()} className="font-black uppercase text-[10px] h-10">
          <Printer size={14} className="mr-1" /> Print Payslip
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default PayslipModal;
