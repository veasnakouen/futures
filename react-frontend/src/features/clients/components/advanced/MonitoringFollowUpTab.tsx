import React from "react";
import { Button, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Badge } from "@/lib/flowbite-compat";
import { Plus, Clock, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface MonitoringFollowUpTabProps {
  monitorings: any[];
  onOpenMonitoringModal: () => void;
  onOpenEditMonitoringModal: (item: any) => void;
  onDeleteMonitoring: (id: number) => void;
}

export const MonitoringFollowUpTab: React.FC<MonitoringFollowUpTabProps> = ({
  monitorings = [],
  onOpenMonitoringModal,
  onOpenEditMonitoringModal,
  onDeleteMonitoring,
}) => {
  return (
    <div className="pt-3 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black dark:text-white uppercase tracking-tight flex items-center gap-2">
          <Clock size={20} className="text-blue-600" /> Post-Placement Monitoring & Follow-Up Ledger
        </h3>
        <Button color="blue" onClick={onOpenMonitoringModal} className="font-bold text-xs">
          <Plus size={16} className="mr-1" /> Log Monitoring Visit
        </Button>
      </div>

      <div className="overflow-x-auto rounded border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
        <Table hoverable>
          <TableHead className="bg-gray-50 dark:bg-gray-900 border-b">
            <TableHeadCell className="font-bold">Monitoring Date</TableHeadCell>
            <TableHeadCell className="font-bold">Next Date</TableHeadCell>
            <TableHeadCell className="font-bold">Frequency</TableHeadCell>
            <TableHeadCell className="font-bold">Status</TableHeadCell>
            <TableHeadCell className="font-bold text-right">Action</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            {monitorings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-8 font-bold text-xs">
                  No post-placement monitoring sessions logged.
                </TableCell>
              </TableRow>
            ) : (
              monitorings.map((m: any) => (
                <TableRow key={m.id} className="bg-white dark:bg-gray-900 border-b">
                  <TableCell className="font-bold dark:text-white">
                    {m.monitoringDate ? format(new Date(m.monitoringDate), "MMM dd, yyyy") : "-"}
                  </TableCell>
                  <TableCell className="text-xs text-gray-500 font-medium">
                    {m.nextMonitoringDate ? format(new Date(m.nextMonitoringDate), "MMM dd, yyyy") : "-"}
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">{m.monitoringtype || "Monthly"}</TableCell>
                  <TableCell>
                    <Badge color={m.enroll === "Enrolled" ? "success" : "warning"} className="w-fit">
                      {m.enroll || "Enrolled"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button
                        onClick={() => onOpenEditMonitoringModal(m)}
                        className="text-blue-600 hover:underline text-xs font-bold flex items-center gap-1"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => onDeleteMonitoring(m.id)}
                        className="text-red-600 hover:underline text-xs font-bold flex items-center gap-1"
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

export default MonitoringFollowUpTab;
