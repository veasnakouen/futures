using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MtpApp.Controllers
{
    [Authorize]
    public class DepartmentsController : Controller
    {
        [Route("departments")]
        public IActionResult Index()
        {
            return View();
        }
    }
}