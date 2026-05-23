using Microsoft.AspNetCore.Mvc;

namespace Inspinia.Controllers
{
    public class TablesController : Controller
    {
        public IActionResult Custom()
            {
                return View("~/Views/Tables/Custom.cshtml");
            }

            public IActionResult Static()
            {
                return View("~/Views/Tables/Static.cshtml");
            }

        }
}