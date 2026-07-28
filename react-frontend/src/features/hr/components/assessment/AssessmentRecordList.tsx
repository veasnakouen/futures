import React from "react";
import { Button, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from '@/lib/flowbite-compat';
import { Printer } from "lucide-react";

interface AssessmentRecordListProps {
  assessments: any[];
  selectedAssessmentId: number | null;
  onSelectAssessment: (a: any) => void;
  onPreviewForm: () => void;
}

const AssessmentRecordList: React.FC<AssessmentRecordListProps> = ({
  assessments,
  selectedAssessmentId,
  onSelectAssessment,
  onPreviewForm,
}) => {
  return (
    <div className="w-full md:w-2/5 p-6 bg-white dark:bg-gray-800 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-black text-sm uppercase tracking-tight text-gray-700 dark:text-gray-300">
          Assessment Form Record
        </h4>
        <Button size="xs" color="light" onClick={onPreviewForm} className="font-bold text-[10px] uppercase">
          <Printer size={12} className="mr-1" /> Preview Form
        </Button>
      </div>

      <div className="rounded-md overflow-hidden border">
        <Table hoverable>
          <TableHead className="bg-gray-100 dark:bg-gray-700">
            <TableHeadCell className="py-2 text-[10px] text-center">ID</TableHeadCell>
            <TableHeadCell className="py-2 text-[10px] text-center">Date</TableHeadCell>
            <TableHeadCell className="py-2 text-[10px] text-center">Ticket</TableHeadCell>
            <TableHeadCell className="py-2 text-[10px]">User</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y dark:divide-gray-700 text-xs">
            {assessments?.map((a: any, i: number) => (
              <TableRow
                key={a.id || i}
                className={`hover:bg-blue-50/50 cursor-pointer ${selectedAssessmentId === a.id ? "bg-blue-50 border-l-4 border-blue-500" : ""}`}
                onClick={() => onSelectAssessment(a)}
              >
                <TableCell className="py-2 text-center font-mono text-blue-600">#{a.id}</TableCell>
                <TableCell className="py-2 text-center">{a.assessmentDate || "—"}</TableCell>
                <TableCell className="py-2 text-center font-mono">{a.ticketId || "—"}</TableCell>
                <TableCell className="py-2 font-bold">{a.requesterName || "N/A"}</TableCell>
              </TableRow>
            ))}
            {(!assessments || assessments.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-400">No records found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AssessmentRecordList;
