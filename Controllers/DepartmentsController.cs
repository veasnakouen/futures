using Microsoft.AspNetCore.Mvc;

namespace MtpApp.Controllers
{
    public class DepartmentsController : Controller
    {
        [Route("departments")]
        public IActionResult Index()
        {
            return View();
        }
    }
}