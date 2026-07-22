import React from "react";
import { Button, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Badge } from "@/lib/flowbite-compat";
import { Plus, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface FuturesTrainingTabProps {
  futuresTrainings: any[];
  onOpenEnrollModal: () => void;
  onOpenEditModal: (training: any) => void;
  onDeleteTraining: (id: number) => void;
}

export const FuturesTrainingTab: React.FC<FuturesTrainingTabProps> = ({
  futuresTrainings,
  onOpenEnrollModal,
  onOpenEditModal,
  onDeleteTraining,
}) => {
  return (
    <div className="pt-3 space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">
          Futures Courses & Trainings
        </h3>
        <Button
          color="blue"
          onClick={onOpenEnrollModal}
          className="rounded-lg shadow-lg shadow-blue-500/20 font-black uppercase text-xs"
        >
          <Plus size={18} className="mr-2" /> Enroll in Course
        </Button>
      </div>

      <div className="overflow-x-auto rounded border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
        <Table hoverable>
          <TableHead className="bg-gray-50 dark:bg-gray-900 border-b">
            <TableHeadCell className="font-bold text-gray-600 dark:text-gray-300">
              ID
            </TableHeadCell>
            <TableHeadCell className="font-bold text-gray-600 dark:text-gray-300">
              Course / Subject
            </TableHeadCell>
            <TableHeadCell className="font-bold text-gray-600 dark:text-gray-300">
              Start Date
            </TableHeadCell>
            <TableHeadCell className="font-bold text-gray-600 dark:text-gray-300">
              End Date
            </TableHeadCell>
            <TableHeadCell className="font-bold text-gray-600 dark:text-gray-300">
              Status
            </TableHeadCell>
            <TableHeadCell className="font-bold text-gray-600 dark:text-gray-300 text-right">
              Action
            </TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            {futuresTrainings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-gray-500 py-12 font-bold text-xs"
                >
                  No training records found for this client.
                </TableCell>
              </TableRow>
            ) : (
              futuresTrainings.map((t: any) => (
                <TableRow
                  key={t.id}
                  className="bg-white dark:bg-gray-900 border-b hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <TableCell className="font-mono text-xs font-bold">{t.id}</TableCell>
                  <TableCell className="font-bold text-gray-900 dark:text-white">
                    {t.subjectName || "N/A"}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-gray-500">
                    {t.startDate ? format(new Date(t.startDate), "MMM dd, yyyy") : "-"}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-gray-500">
                    {t.endDate ? format(new Date(t.endDate), "MMM dd, yyyy") : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      color={
                        t.status === "Completed"
                          ? "success"
                          : t.status === "Dropped"
                          ? "failure"
                          : "info"
                      }
                      className="w-fit font-bold"
                    >
                      {t.status || "Enrolled"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2 text-sm">
                      <button
                        onClick={() => onOpenEditModal(t)}
                        className="flex items-center gap-1 text-blue-600 hover:underline font-semibold text-xs"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() => onDeleteTraining(t.id)}
                        className="flex items-center gap-1 text-red-600 hover:underline font-semibold text-xs"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
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

export default FuturesTrainingTab;
