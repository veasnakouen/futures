using Microsoft.AspNetCore.Html;
using Microsoft.Extensions.FileProviders;
using System;
using System.IO;
using System.Security.Cryptography;


namespace MtpApp.Infrastructure
{
    public interface ILegacyAssetRenderer
    {
        IHtmlContent Render(string virtualPath);
    }

    public class LegacyAssetRenderer : ILegacyAssetRenderer
    {
        private readonly IFileProvider _fileProvider;

        public LegacyAssetRenderer(Microsoft.AspNetCore.Hosting.IWebHostEnvironment env)
        {
            _fileProvider = env.WebRootFileProvider;
        }

        private string AppendVersion(string path)
        {
            try
            {
                var fileInfo = _fileProvider.GetFileInfo(path);
                if (fileInfo.Exists && !fileInfo.IsDirectory)
                {
                    using var stream = fileInfo.CreateReadStream();
                    var hash = SHA256.HashData(stream);
                    var version = Convert.ToHexString(hash, 0, 4).ToLowerInvariant();
                    return path + "?v=" + version;
                }
            }
            catch { /* fall through and serve without version */ }
            return path;
        }

        public IHtmlContent Render(string virtualPath)
        {
            if (string.IsNullOrWhiteSpace(virtualPath))
            {
                return HtmlString.Empty;
            }

            if (virtualPath.Equals("~/bundles/jqueryval", StringComparison.OrdinalIgnoreCase))
            {
                return new HtmlString(
                    "<script src=\"/Scripts/jquery.validate.js\"></script>" +
                    "<script src=\"/Scripts/jquery.validate.unobtrusive.js\"></script>");
            }

            var path = virtualPath.StartsWith("~/", StringComparison.Ordinal)
                ? "/" + virtualPath.Substring(2)
                : virtualPath;

            if (path.EndsWith(".js", StringComparison.OrdinalIgnoreCase))
            {
                return new HtmlString($"<script src=\"{AppendVersion(path)}\"></script>");
            }

            if (path.EndsWith(".css", StringComparison.OrdinalIgnoreCase))
            {
                return new HtmlString($"<link rel=\"stylesheet\" href=\"{AppendVersion(path)}\" />");
            }

            return HtmlString.Empty;
        }
    }
}
