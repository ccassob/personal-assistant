using Microsoft.AspNetCore.Mvc;

namespace Starterkit.Controllers
{
    public class PartialsController : Controller
    {
        public IActionResult TitleMeta()
            {
                return View("~/Views/Partials/TitleMeta.cshtml");
            }

            public IActionResult HorizontalNav()
            {
                return View("~/Views/Partials/HorizontalNav.cshtml");
            }

            public IActionResult Topbar()
            {
                return View("~/Views/Partials/Topbar.cshtml");
            }

            public IActionResult HeadCss()
            {
                return View("~/Views/Partials/HeadCss.cshtml");
            }

            public IActionResult Footer()
            {
                return View("~/Views/Partials/Footer.cshtml");
            }

            public IActionResult FooterScripts()
            {
                return View("~/Views/Partials/FooterScripts.cshtml");
            }

            public IActionResult Customizer()
            {
                return View("~/Views/Partials/Customizer.cshtml");
            }

            public IActionResult Sidenav()
            {
                return View("~/Views/Partials/Sidenav.cshtml");
            }

            public IActionResult PageTitle()
            {
                return View("~/Views/Partials/PageTitle.cshtml");
            }

        }
}