using Microsoft.AspNetCore.Mvc;

namespace MtpApp.Controllers
{
    public class PositionsController : Controller
    {
        [Route("positions")]
        public IActionResult Index()
        {
            return View();
        }
    }
}