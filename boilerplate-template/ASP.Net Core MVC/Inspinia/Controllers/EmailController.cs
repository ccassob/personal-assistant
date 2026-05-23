using Microsoft.AspNetCore.Mvc;

namespace Inspinia.Controllers
{
    public class EmailController : Controller
    {
        public IActionResult Inbox()
            {
                return View("~/Views/Apps/Email/Inbox.cshtml");
            }

            public IActionResult Compose()
            {
                return View("~/Views/Apps/Email/Compose.cshtml");
            }

            public IActionResult Details()
            {
                return View("~/Views/Apps/Email/Details.cshtml");
            }

        }
}