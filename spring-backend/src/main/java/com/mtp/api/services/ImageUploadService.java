package com.mtp.api.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@Slf4j
public class ImageUploadService {

    private final Cloudinary cloudinary;
    private static final int MAX_RETRIES = 3;

    public ImageUploadService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadImage(MultipartFile file, String folder) throws IOException {
        int attempt = 0;
        while (attempt < MAX_RETRIES) {
            try {
                Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder", folder));
                return uploadResult.get("secure_url").toString();
            } catch (IOException e) {
                attempt++;
                log.warn("Image upload attempt {} failed for folder {}. Retrying...", attempt, folder);
                if (attempt >= MAX_RETRIES) throw e;
                try { Thread.sleep(1000L * attempt); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }
            }
        }
        return null;
    }

    public String uploadAudio(MultipartFile file, String folder) throws IOException {
        int attempt = 0;
        while (attempt < MAX_RETRIES) {
            try {
                Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), 
                    ObjectUtils.asMap("folder", folder, "resource_type", "video", "public_id", "voice_" + System.currentTimeMillis()));
                return uploadResult.get("secure_url").toString();
            } catch (IOException e) {
                attempt++;
                log.warn("Audio upload attempt {} failed. Retrying...", attempt);
                if (attempt >= MAX_RETRIES) throw e;
                try { Thread.sleep(1000L * attempt); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }
            }
        }
        return null;
    }

    /**
     * Uploads an image from a Base64 string.
     * Useful for backward compatibility with existing frontend logic.
     */
    public String uploadBase64Image(String base64Data, String folder) throws IOException {
        if (base64Data == null || !base64Data.contains(",")) return null;
        
        // Remove the data:image/xxx;base64, prefix
        String rawBase64 = base64Data.split(",")[1];
        byte[] bytes = java.util.Base64.getDecoder().decode(rawBase64);
        
        int attempt = 0;
        while (attempt < MAX_RETRIES) {
            try {
                Map<?, ?> uploadResult = cloudinary.uploader().upload(bytes, ObjectUtils.asMap("folder", folder));
                return uploadResult.get("secure_url").toString();
            } catch (IOException e) {
                attempt++;
                log.warn("Base64 upload attempt {} failed for folder {}. Retrying...", attempt, folder);
                if (attempt >= MAX_RETRIES) throw e;
                try { Thread.sleep(1000L * attempt); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }
            }
        }
        return null;
    }
    public String uploadBase64File(String base64Data, String folder) throws IOException {
        if (base64Data == null || !base64Data.contains(",")) return null;
        
        String rawBase64 = base64Data.split(",")[1];
        byte[] bytes = java.util.Base64.getDecoder().decode(rawBase64);
        
        int attempt = 0;
        while (attempt < MAX_RETRIES) {
            try {
                // Use resource_type = auto to handle both images and PDFs/Docs
                Map<?, ?> uploadResult = cloudinary.uploader().upload(bytes, ObjectUtils.asMap("folder", folder, "resource_type", "auto"));
                return uploadResult.get("secure_url").toString();
            } catch (IOException e) {
                attempt++;
                log.warn("Base64 file upload attempt {} failed for folder {}. Retrying...", attempt, folder);
                if (attempt >= MAX_RETRIES) throw e;
                try { Thread.sleep(1000L * attempt); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }
            }
        }
        return null;
    }
}
