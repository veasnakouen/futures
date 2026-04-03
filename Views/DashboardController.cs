using Microsoft.AspNetCore.Mvc;

namespace MtpApp.Views
{
    public class DashboardController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}