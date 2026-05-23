using Microsoft.AspNetCore.Mvc;

namespace Inspinia.Controllers
{
    public class TopbarController : Controller
    {
        public IActionResult Gray()
            {
                return View("~/Views/Layouts/Topbar/Gray.cshtml");
            }

            public IActionResult Dark()
            {
                return View("~/Views/Layouts/Topbar/Dark.cshtml");
            }

            public IActionResult Gradient()
            {
                return View("~/Views/Layouts/Topbar/Gradient.cshtml");
            }

        }
}