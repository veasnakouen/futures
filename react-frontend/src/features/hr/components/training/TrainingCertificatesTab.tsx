import React from "react";
import { Badge, Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell } from '@/lib/flowbite-compat';
import { Award, CheckCircle, Calendar } from "lucide-react";
import { format } from "date-fns";

interface TrainingCertificatesTabProps {
  certificates: any[];
}

const TrainingCertificatesTab: React.FC<TrainingCertificatesTabProps> = ({ certificates }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border">
        <h4 className="font-black text-sm uppercase dark:text-white">Certified Personnel Ledger</h4>
        <p className="text-[10px] text-gray-400 font-bold uppercase">Verified employee certifications and skill accreditations</p>
      </div>

      <div className="border-none shadow-sm dark:bg-gray-800 rounded-md overflow-hidden bg-white">
        <Table hoverable className="w-full">
          <TableHead className="bg-gray-50 dark:bg-gray-700">
            <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Employee</TableHeadCell>
            <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Course Title</TableHeadCell>
            <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Issue Date</TableHeadCell>
            <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Certificate Code</TableHeadCell>
            <TableHeadCell className="py-3 px-4 text-[10px] uppercase">Status</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y dark:divide-gray-700">
            {certificates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-xs font-bold text-gray-400 uppercase">
                  No certification records found
                </TableCell>
              </TableRow>
            ) : (
              certificates.map((cert, idx) => (
                <TableRow key={cert.id || idx} className="bg-white dark:bg-gray-800 hover:bg-gray-50">
                  <TableCell className="px-4 py-3 font-bold text-xs uppercase">{cert.employeeName || "Employee"}</TableCell>
                  <TableCell className="px-4 py-3 text-xs text-blue-600 font-bold">{cert.courseTitle || "Course"}</TableCell>
                  <TableCell className="px-4 py-3 text-xs text-gray-400">{cert.issueDate ? format(new Date(cert.issueDate), "MMM dd, yyyy") : "N/A"}</TableCell>
                  <TableCell className="px-4 py-3 text-xs font-mono font-bold">{cert.code || `CERT-${idx + 101}`}</TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge color="success" className="text-[8px] uppercase">
                      <CheckCircle size={10} className="inline mr-1" /> Verified
                    </Badge>
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

export default TrainingCertificatesTab;
