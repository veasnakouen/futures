using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MtpApp.Controllers
{
    [Authorize]
    public class AgentsController : Controller
    {
        [Route("agents")]
        public IActionResult Index()
        {
            return View();
        }
    }
}