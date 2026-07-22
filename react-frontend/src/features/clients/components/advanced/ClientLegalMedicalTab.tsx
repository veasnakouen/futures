import React from "react";
import { Button, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Badge } from "@/lib/flowbite-compat";
import { ShieldAlert, Heart, Plus, Trash2 } from "lucide-react";

interface ClientLegalMedicalTabProps {
  medicalRecords: any[];
  legalCases: any[];
  onOpenMedicalModal: () => void;
  onOpenLegalModal: () => void;
  onDeleteMedical: (id: number) => void;
  onDeleteLegal: (id: number) => void;
}

export const ClientLegalMedicalTab: React.FC<ClientLegalMedicalTabProps> = ({
  medicalRecords = [],
  legalCases = [],
  onOpenMedicalModal,
  onOpenLegalModal,
  onDeleteMedical,
  onDeleteLegal,
}) => {
  return (
    <div className="pt-3 space-y-8 animate-fade-in">
      {/* Medical Records */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-black dark:text-white uppercase tracking-tight flex items-center gap-2">
            <Heart size={20} className="text-rose-600" /> Medical & Health Audit Records
          </h3>
          <Button color="blue" onClick={onOpenMedicalModal} className="font-bold text-xs">
            <Plus size={16} className="mr-1" /> Add Medical Entry
          </Button>
        </div>

        <div className="overflow-x-auto rounded border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
          <Table hoverable>
            <TableHead className="bg-gray-50 dark:bg-gray-900 border-b">
              <TableHeadCell className="font-bold">Condition / Diagnosis</TableHeadCell>
              <TableHeadCell className="font-bold">Severity</TableHeadCell>
              <TableHeadCell className="font-bold">Notes</TableHeadCell>
              <TableHeadCell className="font-bold text-right">Action</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {medicalRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 py-6 text-xs font-bold">
                    No medical records on file.
                  </TableCell>
                </TableRow>
              ) : (
                medicalRecords.map((m) => (
                  <TableRow key={m.id} className="bg-white dark:bg-gray-900 border-b">
                    <TableCell className="font-bold dark:text-white">{m.condition || "N/A"}</TableCell>
                    <TableCell>
                      <Badge color={m.severity === "High" ? "failure" : "warning"}>
                        {m.severity || "Standard"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">{m.notes || "-"}</TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() => onDeleteMedical(m.id)}
                        className="text-red-600 hover:underline text-xs font-bold"
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Legal Cases */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-black dark:text-white uppercase tracking-tight flex items-center gap-2">
            <ShieldAlert size={20} className="text-amber-600" /> Legal Case History & Compliance
          </h3>
          <Button color="blue" onClick={onOpenLegalModal} className="font-bold text-xs">
            <Plus size={16} className="mr-1" /> Add Legal Case
          </Button>
        </div>

        <div className="overflow-x-auto rounded border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
          <Table hoverable>
            <TableHead className="bg-gray-50 dark:bg-gray-900 border-b">
              <TableHeadCell className="font-bold">Case Title</TableHeadCell>
              <TableHeadCell className="font-bold">Court / Agency</TableHeadCell>
              <TableHeadCell className="font-bold">Status</TableHeadCell>
              <TableHeadCell className="font-bold text-right">Action</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {legalCases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 py-6 text-xs font-bold">
                    No legal compliance records.
                  </TableCell>
                </TableRow>
              ) : (
                legalCases.map((c) => (
                  <TableRow key={c.id} className="bg-white dark:bg-gray-900 border-b">
                    <TableCell className="font-bold dark:text-white">{c.title || "Case Record"}</TableCell>
                    <TableCell className="text-xs text-gray-500">{c.agency || "General Court"}</TableCell>
                    <TableCell>
                      <Badge color={c.status === "Closed" ? "success" : "info"}>
                        {c.status || "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() => onDeleteLegal(c.id)}
                        className="text-red-600 hover:underline text-xs font-bold"
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ClientLegalMedicalTab;
