using System.Web;
using System.Web.Optimization;

namespace MtpApp
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/lib").Include(
                        "~/Scripts/jquery-{version}.js",
                        "~/Scripts/bootstrap.js",
                        "~/Scripts/bootbox.js",
                        "~/scripts/datatables/jquery.datatables.js",
                        "~/scripts/datatables/datatables.bootstrap.js",
                        "~/Scripts/toastr.js",
                        "~/Scripts/jquery-ui.js",
                        "~/Scripts/moment-with-locales.js",
                        "~/Scripts/moment.js",            
                        "~/Scripts/bootstrap-select.min.js",
                        "~/Scripts/bootstrap-select.js",
                        "~/Scripts/dataTables.responsive.min-2.2.5.js",
                        "~/Scripts/dataTables.rowReorder.min-1.2.7.js",
                        "~/Scripts/loader.js",
                        "~/Scripts/respond.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap-flaty.css", 
                      "~/content/datatables/css/datatables.bootstrap.css",
                      "~/content/toastr.css",
                      "~/Content/bootstrap-select.min.css",
                      "~/Content/responsive.dataTables.min-2.2.5.css",
                      "~/Content/rowReorder.dataTables.min-1.2.7.css",
                      "~/Content/site.css",
                      "~/Content/DropDownNotification.css"));
        }
    }
}
