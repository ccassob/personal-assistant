using Microsoft.AspNetCore.Mvc;

namespace Inspinia.Controllers
{
    public class MapsController : Controller
    {
        public IActionResult Google()
            {
                return View("~/Views/Maps/Google.cshtml");
            }

            public IActionResult Vector()
            {
                return View("~/Views/Maps/Vector.cshtml");
            }

            public IActionResult Leaflet()
            {
                return View("~/Views/Maps/Leaflet.cshtml");
            }

        }
}