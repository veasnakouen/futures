import React from "react";
import { FileText, Download } from "lucide-react";

interface Props {
  documents: any[];
  state: any;
}

export default function ClientDocumentTab({ documents, state }: Props) {
  const { setIsDocModalOpen } = state;

  return (
    <div className="grid grid-cols-1 gap-6 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="mb-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText size={18} className="text-indigo-500" /> Client Documents & Files
            </h3>
            <p className="text-xs text-gray-500 ml-6">Securely stored identification and legal files</p>
          </div>
          <button
            onClick={() => setIsDocModalOpen(true)}
            className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors shadow-md shadow-indigo-500/20 flex items-center gap-2 cursor-pointer"
          >
            <Download size={14} /> Upload File
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {documents.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">No documents uploaded.</div>
          ) : (
            documents.map((doc: any) => (
              <div
                key={doc.id}
                className="group relative p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-gray-50 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all cursor-pointer overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`w-10 h-10 rounded-lg ${
                      doc.fileType === "PDF"
                        ? "bg-red-100 text-red-600 dark:bg-red-900/30"
                        : "bg-blue-100 text-blue-600 dark:bg-blue-900/30"
                    } flex items-center justify-center shrink-0`}
                  >
                    <FileText size={20} />
                  </div>
                  <button className="text-gray-400 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                    <Download size={16} />
                  </button>
                </div>
                <div>
                  <h4
                    className="font-bold text-sm text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors"
                    title={doc.fileName}
                  >
                    {doc.fileName}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="uppercase font-bold text-[10px] bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">
                      {doc.fileType || "FILE"}
                    </span>
                    <span>{doc.fileSize || "Unknown size"}</span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
