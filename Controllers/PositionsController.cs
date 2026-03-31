using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MtpApp.Controllers
{
    public class PositionsController : Controller
    {
        // GET: Positions
        [Route("positions")]
        public ActionResult Index()
        {
            return View();
        }
    }
}