using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MtpApp.Controllers
{
    public class TicketTypesController : Controller
    {
        // GET: TicketTypes
        [Route("tickettypes")]
        public ActionResult Index()
        {
            return View();
        }
    }
}