using Microsoft.AspNetCore.Mvc;

namespace Starterkit.Controllers
{
    public class PagesController : Controller
    {
        public IActionResult PagesEmpty()
            {
                return View("~/Views/Pages/Empty.cshtml");
            }

        }
}