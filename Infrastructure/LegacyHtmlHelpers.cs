using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace MtpApp.Infrastructure
{
    public static class LegacyHtmlHelpers
    {
        public static IHtmlContent ReportViewer(this IHtmlHelper htmlHelper, object reportViewer)
        {
            return HtmlString.Empty;
        }

        public static IHtmlContent Action(this IHtmlHelper htmlHelper, string actionName)
        {
            return HtmlString.Empty;
        }
    }
}
