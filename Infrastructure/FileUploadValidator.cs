using System;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Http;

namespace MtpApp.Infrastructure
{
    public static class FileUploadValidator
    {
        // Maximum file size: 5MB
        private const long MaxFileSize = 5 * 1024 * 1024;

        private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp" };
        private static readonly string[] AllowedContentTypes = {
            "image/jpeg", "image/png", "image/gif", "image/bmp", "image/webp"
        };

        public static bool IsValidFile(IFormFile file, out string errorMessage)
        {
            errorMessage = null;

            if (file == null || file.Length == 0)
            {
                errorMessage = "No file was uploaded.";
                return false;
            }

            if (file.Length > MaxFileSize)
            {
                errorMessage = $"File size exceeds the maximum allowed size of {MaxFileSize / 1024 / 1024}MB.";
                return false;
            }

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (string.IsNullOrEmpty(extension) || !AllowedExtensions.Contains(extension))
            {
                errorMessage = $"Invalid file type. Allowed types: {string.Join(", ", AllowedExtensions)}";
                return false;
            }

            var contentType = file.ContentType.ToLowerInvariant();
            if (string.IsNullOrEmpty(contentType) || !AllowedContentTypes.Contains(contentType))
            {
                errorMessage = $"Invalid content type. Allowed types: {string.Join(", ", AllowedContentTypes)}";
                return false;
            }

            return true;
        }

        public static string GenerateSafeFileName(string originalFileName)
        {
            var extension = Path.GetExtension(originalFileName).ToLowerInvariant();
            var safeName = $"{Guid.NewGuid():N}{extension}";
            return safeName;
        }
    }
}
