using Microsoft.AspNetCore.Mvc;

namespace Inspinia.Controllers
{
    public class DashboardController : Controller
    {
        public IActionResult Ecommerce()
            {
                return View("~/Views/Dashboard/Ecommerce.cshtml");
            }

            public IActionResult Analytics()
            {
                return View("~/Views/Dashboard/Analytics.cshtml");
            }

        }
}