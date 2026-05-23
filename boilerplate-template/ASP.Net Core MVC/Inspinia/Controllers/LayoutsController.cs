using Microsoft.AspNetCore.Mvc;

namespace Inspinia.Controllers
{
    public class LayoutsController : Controller
    {
        public IActionResult Horizontal()
            {
                return View("~/Views/Layouts/Horizontal.cshtml");
            }

            public IActionResult Boxed()
            {
                return View("~/Views/Layouts/Boxed.cshtml");
            }

            public IActionResult Scrollable()
            {
                return View("~/Views/Layouts/Scrollable.cshtml");
            }

            public IActionResult Preloader()
            {
                return View("~/Views/Layouts/Preloader.cshtml");
            }

            public IActionResult Compact()
            {
                return View("~/Views/Layouts/Compact.cshtml");
            }

        }
}