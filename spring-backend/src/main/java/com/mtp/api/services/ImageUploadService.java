package com.mtp.api.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class ImageUploadService {

    private final Cloudinary cloudinary;

    public ImageUploadService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadImage(MultipartFile file, String folder) throws IOException {
        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder", folder));
        return uploadResult.get("secure_url").toString();
    }

    public String uploadAudio(MultipartFile file, String folder) throws IOException {
        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), 
            ObjectUtils.asMap("folder", folder, "resource_type", "video"));
        return uploadResult.get("secure_url").toString();
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
        
        Map<?, ?> uploadResult = cloudinary.uploader().upload(bytes, ObjectUtils.asMap("folder", folder));
        return uploadResult.get("secure_url").toString();
    }
}
