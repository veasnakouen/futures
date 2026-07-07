import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { UploadCloud, FileText, Trash2, CheckCircle, File } from "lucide-react";

interface UploadedDocument {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  status: "Processed" | "Processing" | "Failed";
}

const ChatbotSettingsTab = () => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = useState<UploadedDocument[]>([
    {
      id: "doc-1",
      name: "Employee_Handbook_2024.pdf",
      size: "2.4 MB",
      uploadDate: "Oct 12, 2024",
      status: "Processed",
    },
    {
      id: "doc-2",
      name: "Leave_Policy_Guidelines.docx",
      size: "1.1 MB",
      uploadDate: "Oct 15, 2024",
      status: "Processed",
    },
  ]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const newDocs: UploadedDocument[] = files.map((file, index) => ({
      id: `new-doc-${Date.now()}-${index}`,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      uploadDate: new Date().toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }),
      status: "Processing",
    }));

    setDocuments((prev) => [...newDocs, ...prev]);

    // Simulate processing delay
    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((doc) =>
          newDocs.find(nd => nd.id === doc.id)
            ? { ...doc, status: "Processed" }
            : doc
        )
      );
    }, 3000);
  };

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-6 animate-fade-in">
      <h2 className="text-lg font-bold dark:text-white mb-2">
        {t("chatbotDocuments")}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {t("uploadChatbotDocsDesc")}
      </p>

      {/* Upload Zone */}
      <div
        className={`border-2 rounded-lg p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${isDragging ?"border-blue-500 bg-blue-50 dark:bg-blue-900/20":" hover:bg-gray-50 dark:hover:bg-gray-700/50"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloud
          size={48}
          className={`mb-4 ${isDragging ?"text-blue-500":"text-gray-400"}`}
        />
        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
          {t("clickToUploadOrDragDrop")}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {t("fileTypeLimit")}
        </p>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept=".pdf,.docx,.txt"
          onChange={handleFileInput}
        />
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
          {t("uploadedDocuments")}
        </h3>
        {documents.length > 0 ? (
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="p-4 flex items-center justify-between hover:bg-white dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {doc.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-0.5">
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>{doc.uploadDate}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {doc.status === "Processing" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        {t("processing")}
                      </span>
                    ) : doc.status === "Failed" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        {t("failed")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <CheckCircle size={12} />
                        {t("processed")}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(doc.id);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title={t("deleteDocument")}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <File className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
              {t("noDocuments")}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t("uploadDocsToStart")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatbotSettingsTab;
