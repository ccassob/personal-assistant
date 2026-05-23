using Microsoft.AspNetCore.Mvc;

namespace Inspinia.Controllers
{
    public class SidebarController : Controller
    {
        public IActionResult Light()
            {
                return View("~/Views/Layouts/Sidebar/Light.cshtml");
            }

            public IActionResult Image()
            {
                return View("~/Views/Layouts/Sidebar/Image.cshtml");
            }

            public IActionResult OnHoverActive()
            {
                return View("~/Views/Layouts/Sidebar/OnHoverActive.cshtml");
            }

            public IActionResult Offcanvas()
            {
                return View("~/Views/Layouts/Sidebar/Offcanvas.cshtml");
            }

            public IActionResult WithLines()
            {
                return View("~/Views/Layouts/Sidebar/WithLines.cshtml");
            }

            public IActionResult OnHover()
            {
                return View("~/Views/Layouts/Sidebar/OnHover.cshtml");
            }

            public IActionResult Gray()
            {
                return View("~/Views/Layouts/Sidebar/Gray.cshtml");
            }

            public IActionResult Gradient()
            {
                return View("~/Views/Layouts/Sidebar/Gradient.cshtml");
            }

            public IActionResult NoIcons()
            {
                return View("~/Views/Layouts/Sidebar/NoIcons.cshtml");
            }

            public IActionResult Compact()
            {
                return View("~/Views/Layouts/Sidebar/Compact.cshtml");
            }

        }
}