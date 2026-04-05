using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MtpApp.Infrastructure
{
    public static class LegacyHtmlHelpers
    {
        public static IHtmlContent ReportViewer(this IHtmlHelper htmlHelper, object reportViewer)
        {
            var reportService = htmlHelper.ViewContext.HttpContext.RequestServices.GetService<LegacyReportService>();
            if (reportService == null)
            {
                return new HtmlString("<div class=\"alert alert-warning mb-0\">Legacy report service is not available.</div>");
            }

            var routeValues = new Dictionary<string, string?>(StringComparer.OrdinalIgnoreCase);

            foreach (var routeValue in htmlHelper.ViewContext.RouteData.Values)
            {
                routeValues[routeValue.Key] = routeValue.Value?.ToString();
            }

            foreach (var queryValue in htmlHelper.ViewContext.HttpContext.Request.Query)
            {
                if (!routeValues.ContainsKey(queryValue.Key))
                {
                    routeValues[queryValue.Key] = queryValue.Value.ToString();
                }
            }

            var actionName = routeValues.TryGetValue("action", out var actionValue)
                ? actionValue ?? string.Empty
                : string.Empty;

            var html = reportService.RenderReport(actionName, routeValues);
            return new HtmlString(html);
        }

        public static IHtmlContent Action(this IHtmlHelper htmlHelper, string actionName)
        {
            return HtmlString.Empty;
        }
    }
}
