using Microsoft.AspNetCore.Mvc;

namespace Starterkit.Controllers
{
    public class IconsController : Controller
    {
        public IActionResult Tabler()
            {
                return View("~/Views/Icons/Tabler.cshtml");
            }

        }
}