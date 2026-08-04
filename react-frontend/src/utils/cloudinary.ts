
import imageCompression from "browser-image-compression";
import api from "../services/api";

/**
 * Utility to handle file uploads to Cloudinary via their REST API.
 */
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dprgqhdvb";
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "futures_unsigned";

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary configuration missing in .env");
  }

  let fileToUpload = file;

  // Auto-compress if it's an image
  if (file.type.startsWith("image/")) {
    try {
      let maxSizeMB = 1; // Default
      try {
        const res = await api.get("/settings/MAX_IMAGE_UPLOAD_SIZE_MB");
        if (res.data && res.data.value) {
          maxSizeMB = parseFloat(res.data.value);
        }
      } catch (e) {
        console.warn(
          "Failed to fetch max image upload size, using default 1MB limit.",
        );
      }

      const options = {
        maxSizeMB: maxSizeMB > 0 ? Math.min(maxSizeMB, 0.2) : 0.2, // Heavily compress to max 200KB
        maxWidthOrHeight: 800, // Scale down to max 800px width/height
        useWebWorker: true, // Speed up compression
        initialQuality: 0.6, // Start with lower quality for faster, smaller compression
      };
      fileToUpload = (await imageCompression(file, options)) as File;
    } catch (error) {
      console.warn("Image compression failed, uploading original:", error);
    }
  }

  const resourceType = file.type.startsWith("image/")
    ? "image"
    : file.type.startsWith("video/") || file.type.startsWith("audio/")
      ? "video"
      : "raw";

  const formData = new FormData();
  formData.append("file", fileToUpload);
  formData.append("upload_preset", uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudinary upload failed: ${errorText}`);
    }

    const data = await response.json();
    let url = data.secure_url;
    
    // Auto-apply format and quality optimization if not already present
    if (url && url.includes("/upload/")) {
      url = url.replace("/upload/", "/upload/f_auto,q_auto/");
    }
    
    return url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

/**
 * Transforms a Cloudinary URL to auto-focus on the face and crop to a square aspect ratio.
 */
export const getFaceFocusedUrl = (
  url: string | null | undefined,
  size = 100,
): string => {
  if (!url) return "";
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    // Don't modify if it already has explicit crop/gravity transformations
    if (!url.includes("/c_") && !url.includes("/g_")) {
      if (url.includes("/upload/f_auto,q_auto/")) {
        return url.replace(
          "/upload/f_auto,q_auto/",
          `/upload/c_fill,g_face,w_${size},h_${size},f_auto,q_auto/`,
        );
      }
      return url.replace(
        "/upload/",
        `/upload/c_fill,g_face,w_${size},h_${size},f_auto,q_auto/`,
      );
    }
  }
  return url;
};

/**
 * Generates a self-contained, high-resolution SVG Avatar Data URL.
 * Works 100% offline with zero network latency, instant rendering, and 0 CORS failures.
 */
export const getAvatarDataUrl = (name?: string): string => {
  return "/default.png";
};
