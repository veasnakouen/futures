using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MtpApp.Controllers
{
    public class CategoriesController : Controller
    {
        // GET: Categories
        [Route("categories")]
        public ActionResult Index()
        {
            return View();
        }
    }
}