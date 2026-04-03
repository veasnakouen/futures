using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MtpApp.Controllers
{
    public class TicketTypesController : Controller
    {
        [Route("tickettypes")]
        public IActionResult Index()
        {
            return View();
        }
    }
}