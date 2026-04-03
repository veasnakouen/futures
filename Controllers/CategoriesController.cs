using Microsoft.AspNetCore.Mvc;

namespace MtpApp.Controllers
{
    public class CategoriesController : Controller
    {
        [Route("categories")]
        public IActionResult Index()
        {
            return View();
        }
    }
}