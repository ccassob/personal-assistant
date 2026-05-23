using Microsoft.AspNetCore.Mvc;

namespace Inspinia.Controllers
{
    public class ErrorController : Controller
    {
        public IActionResult Error404()
            {
                return View("~/Views/Error/404.cshtml");
            }

            public IActionResult Error408()
            {
                return View("~/Views/Error/408.cshtml");
            }

            public IActionResult Error401()
            {
                return View("~/Views/Error/401.cshtml");
            }

            public IActionResult Error403()
            {
                return View("~/Views/Error/403.cshtml");
            }

            public IActionResult Error500()
            {
                return View("~/Views/Error/500.cshtml");
            }

            public IActionResult Maintenance()
            {
                return View("~/Views/Error/Maintenance.cshtml");
            }

            public IActionResult Error400()
            {
                return View("~/Views/Error/400.cshtml");
            }

        }
}