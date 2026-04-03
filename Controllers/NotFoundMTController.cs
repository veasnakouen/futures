using Microsoft.AspNetCore.Mvc;

namespace MtpApp.Controllers
{
    public class NotFoundMTController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [Route("Not-FoundPage")]
        public IActionResult NotFoundPage()
        {
            return View();
        }

        [Route("No-Permission")]
        public IActionResult NotPermission()
        {
            return View();
        }
    }
}