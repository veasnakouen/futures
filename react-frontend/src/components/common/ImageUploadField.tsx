import React, { useState } from "react";
import { Camera, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { uploadToCloudinary, getFaceFocusedUrl } from "../../utils/cloudinary";
import { toast } from "react-hot-toast";

interface ImageUploadFieldProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
  isAvatar?: boolean; // If true, makes the image circular
}

export default function ImageUploadField({
  value,
  onChange,
  label = "Upload Image",
  className = "",
  isAvatar = false,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    try {
      setIsUploading(true);
      const url = await uploadToCloudinary(file);
      
      // Auto-crop to face for avatars
      const finalUrl = isAvatar ? getFaceFocusedUrl(url, 200) : url;
      onChange(finalUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again if needed
      e.target.value = "";
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
      <div className="flex items-center gap-4">
        <div 
          className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800 border-2  flex items-center justify-center ${isAvatar ?'w-24 h-24 rounded-full':'w-32 h-32 rounded-xl'}`}
        >
          {isUploading ? (
            <Spinner className="text-blue-500" size="md" />
          ) : value ? (
            <>
              <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-1 right-1 bg-white dark:bg-gray-900 rounded-full p-1 shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                title="Remove image"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <div className="text-gray-400 dark:text-gray-500 flex flex-col items-center">
              <Camera size={24} className="mb-1" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm text-gray-700 dark:text-gray-300">
            <Camera size={16} />
            <span>Choose Image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Max size: 1MB. Recommended square image.
          </p>
        </div>
      </div>
    </div>
  );
}
