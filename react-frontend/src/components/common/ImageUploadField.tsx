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
        <div className="relative inline-block group">
          <div 
            className={`overflow-hidden bg-gray-50 dark:bg-gray-800 flex items-center justify-center ${isAvatar ?'w-24 h-24 rounded-full shadow-sm':'w-32 h-32 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm'}`}
          >
            {isUploading ? (
              <Spinner className="text-orange-500" size="md" />
            ) : value ? (
              <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
            ) : (
              <div className="text-gray-400 dark:text-gray-500 flex flex-col items-center">
                <Camera size={24} className="mb-1 text-gray-300" />
              </div>
            )}
          </div>
          
          {value && !isUploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all shadow-md border border-gray-100 z-10"
              title="Remove image"
            >
              <X size={14} />
            </button>
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
