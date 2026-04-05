using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MtpApp.Controllers
{
    [Authorize]
    public class PositionsController : Controller
    {
        [Route("positions")]
        public IActionResult Index()
        {
            return View();
        }
    }
}