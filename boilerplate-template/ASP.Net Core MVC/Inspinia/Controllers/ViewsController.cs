using Microsoft.AspNetCore.Mvc;

namespace Inspinia.Controllers
{
    public class ViewsController : Controller
    {
        public IActionResult Widgets()
            {
                return View("~/Views/Widgets.cshtml");
            }

            public IActionResult Metrics()
            {
                return View("~/Views/Metrics.cshtml");
            }

            public IActionResult Landing()
            {
                return View("~/Views/Landing.cshtml");
            }

        }
}