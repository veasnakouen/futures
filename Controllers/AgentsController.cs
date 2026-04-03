using Microsoft.AspNetCore.Mvc;

namespace MtpApp.Controllers
{
    public class AgentsController : Controller
    {
        [Route("agents")]
        public IActionResult Index()
        {
            return View();
        }
    }
}