using Microsoft.AspNetCore.Html;
using System;


namespace MtpApp.Infrastructure
{
    public interface ILegacyAssetRenderer
    {
        IHtmlContent Render(string virtualPath);
    }

    public class LegacyAssetRenderer : ILegacyAssetRenderer
    {
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
                return new HtmlString($"<script src=\"{path}\"></script>");
            }

            if (path.EndsWith(".css", StringComparison.OrdinalIgnoreCase))
            {
                return new HtmlString($"<link rel=\"stylesheet\" href=\"{path}\" />");
            }

            return HtmlString.Empty;
        }
    }
}
