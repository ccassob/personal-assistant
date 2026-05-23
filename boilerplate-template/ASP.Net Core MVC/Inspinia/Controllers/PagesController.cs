using Microsoft.AspNetCore.Mvc;

namespace Inspinia.Controllers
{
    public class PagesController : Controller
    {
        public IActionResult AccountSettings()
            {
                return View("~/Views/Pages/AccountSettings.cshtml");
            }

            public IActionResult Profile()
            {
                return View("~/Views/Pages/Profile.cshtml");
            }

            public IActionResult Faq()
            {
                return View("~/Views/Pages/Faq.cshtml");
            }

            public IActionResult PrivacyPolicy()
            {
                return View("~/Views/Pages/PrivacyPolicy.cshtml");
            }

            public IActionResult PagesEmpty()
            {
                return View("~/Views/Pages/Empty.cshtml");
            }

            public IActionResult Sitemap()
            {
                return View("~/Views/Pages/Sitemap.cshtml");
            }

            public IActionResult TermsConditions()
            {
                return View("~/Views/Pages/TermsConditions.cshtml");
            }

            public IActionResult Timeline()
            {
                return View("~/Views/Pages/Timeline.cshtml");
            }

            public IActionResult ComingSoon()
            {
                return View("~/Views/Pages/ComingSoon.cshtml");
            }

            public IActionResult Pricing()
            {
                return View("~/Views/Pages/Pricing.cshtml");
            }

            public IActionResult SearchResults()
            {
                return View("~/Views/Pages/SearchResults.cshtml");
            }

            public IActionResult Gallery()
            {
                return View("~/Views/Pages/Gallery.cshtml");
            }

        }
}