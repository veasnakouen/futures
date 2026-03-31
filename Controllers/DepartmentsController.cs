using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MtpApp.Controllers
{
    public class DepartmentsController : Controller
    {
        // GET: Departments
        [Route("departments")]
        public ActionResult Index()
        {
            return View();
        }
    }
}