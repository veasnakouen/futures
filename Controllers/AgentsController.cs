using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MtpApp.Controllers
{
    public class AgentsController : Controller
    {
        // GET: Agents
        [Route("agents")]
        public ActionResult Index()
        {
            return View();
        }
    }
}