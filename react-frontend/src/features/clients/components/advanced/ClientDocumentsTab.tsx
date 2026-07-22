import React from "react";
import { Button, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from "@/lib/flowbite-compat";
import { FileText, Download, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";

interface ClientDocumentsTabProps {
  documents: any[];
  onOpenUploadModal: () => void;
  onDeleteDocument: (id: number) => void;
}

export const ClientDocumentsTab: React.FC<ClientDocumentsTabProps> = ({
  documents = [],
  onOpenUploadModal,
  onDeleteDocument,
}) => {
  return (
    <div className="pt-3 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black dark:text-white uppercase tracking-tight flex items-center gap-2">
          <FileText size={20} className="text-blue-600" /> Client Documents & Identity Files
        </h3>
        <Button color="blue" onClick={onOpenUploadModal} className="font-bold text-xs">
          <Plus size={16} className="mr-1" /> Upload Document
        </Button>
      </div>

      <div className="overflow-x-auto rounded border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
        <Table hoverable>
          <TableHead className="bg-gray-50 dark:bg-gray-900 border-b">
            <TableHeadCell className="font-bold">Document Name</TableHeadCell>
            <TableHeadCell className="font-bold">Type / Format</TableHeadCell>
            <TableHeadCell className="font-bold">Upload Date</TableHeadCell>
            <TableHeadCell className="font-bold text-right">Action</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            {documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 py-8 font-bold text-xs">
                  No document attachments uploaded.
                </TableCell>
              </TableRow>
            ) : (
              documents.map((doc: any) => (
                <TableRow key={doc.id} className="bg-white dark:bg-gray-900 border-b">
                  <TableCell className="font-bold dark:text-white flex items-center gap-2">
                    <FileText size={16} className="text-blue-500" /> {doc.fileName || doc.name || "Attachment"}
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">{doc.fileType || "PDF / Image"}</TableCell>
                  <TableCell className="text-xs text-gray-500 font-mono">
                    {doc.uploadedAt ? format(new Date(doc.uploadedAt), "MMM dd, yyyy") : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-3">
                      {doc.url && (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline text-xs font-bold flex items-center gap-1"
                        >
                          <Download size={14} /> Download
                        </a>
                      )}
                      <button
                        onClick={() => onDeleteDocument(doc.id)}
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

export default ClientDocumentsTab;
