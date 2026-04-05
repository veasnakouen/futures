using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MtpApp.Controllers
{
    [Authorize]
    public class CategoriesController : Controller
    {
        [Route("categories")]
        public IActionResult Index()
        {
            return View();
        }
    }
}