using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MtpApp.Controllers
{
    public class LogbooksController : Controller
    {
        // GET: Logbooks
        public ActionResult Index()
        {
            return View();
        }
    }
}