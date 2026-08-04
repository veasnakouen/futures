import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, UploadCloud, CheckCircle2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import imageCompression from "browser-image-compression";

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: number;
}

export default function UploadDocumentModal({ isOpen, onClose, clientId }: UploadDocumentModalProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      let file = e.target.files[0];

      // If it's an image, let's compress it for the best balance of quality and size
      if (file.type.startsWith("image/")) {
        setIsCompressing(true);
        try {
          const options = {
            maxSizeMB: 1, // Max 1 MB size
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          };
          const compressedBlob = await imageCompression(file, options);
          // Convert Blob back to File
          file = new File([compressedBlob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
        } catch (error) {
          console.error("Image compression error:", error);
        } finally {
          setIsCompressing(false);
        }
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsSubmitting(true);
    try {
      // For now, since we don't have an S3 bucket or local storage,
      // we will just post the metadata to the database to mock the upload.
      await api.post(`/api/clients/${clientId}/documents`, {
        fileName: selectedFile.name,
        fileType: selectedFile.type || "application/octet-stream",
        fileSize: formatFileSize(selectedFile.size)
      });
      queryClient.invalidateQueries({ queryKey: ["clientPortfolio", clientId.toString()] });
      onClose();
    } catch (error) {
      console.error("Failed to upload document", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upload Document</h3>
                <p className="text-xs text-gray-500">Securely store client files</p>
              </div>
            </div>
            <button onClick={onClose} className="flex h-8 w-8 min-w-[2rem] min-h-[2rem] shrink-0 aspect-square items-center justify-center rounded-full p-0 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:rotate-90 hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">

            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${selectedFile
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />

              {selectedFile ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2">
                    <CheckCircle2 size={24} />
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                  <p className="text-xs text-indigo-600 font-bold mt-2 hover:underline">Click to change file</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 flex items-center justify-center mb-2">
                    <UploadCloud size={24} />
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Click to browse or drag and drop</p>
                  <p className="text-xs text-gray-500">Supports PDF, DOCX, JPG, PNG (Max 10MB)</p>
                  {isCompressing && (
                    <p className="text-xs text-blue-500 font-bold mt-2 animate-pulse">Compressing Image...</p>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isCompressing || !selectedFile}
                className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Uploading..." : <><UploadCloud size={18} /> Upload File</>}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
