using Microsoft.AspNetCore.Mvc;

namespace MtpApp.Controllers
{
    public class LogbooksController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}