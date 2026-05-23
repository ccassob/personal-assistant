using Microsoft.AspNetCore.Mvc;

namespace Inspinia.Controllers
{
    public class IconsController : Controller
    {
        public IActionResult Flags()
            {
                return View("~/Views/Icons/Flags.cshtml");
            }

            public IActionResult Lucide()
            {
                return View("~/Views/Icons/Lucide.cshtml");
            }

            public IActionResult Tabler()
            {
                return View("~/Views/Icons/Tabler.cshtml");
            }

        }
}