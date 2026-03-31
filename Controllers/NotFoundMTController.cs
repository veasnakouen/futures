using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MtpApp.Controllers
{
    public class NotFoundMTController : Controller
    {
        // GET: NotFoundMT
        public ActionResult Index()
        {
            return View();
        }

        [Route("Not-FoundPage")]
        public ActionResult NotFoundPage()
        {
            return View();
        }

         [Route("No-Permission")]
        public ActionResult NotPermission()
        {
            return View();
        }
    }
}