using Microsoft.AspNetCore.Mvc;

namespace Inspinia.Controllers
{
    public class AppsController : Controller
    {
        public IActionResult Manage()
            {
                return View("~/Views/Apps/Manage.cshtml");
            }

            public IActionResult VoteList()
            {
                return View("~/Views/Apps/VoteList.cshtml");
            }

            public IActionResult Chat()
            {
                return View("~/Views/Apps/Chat.cshtml");
            }

            public IActionResult FileManager()
            {
                return View("~/Views/Apps/FileManager.cshtml");
            }

            public IActionResult Outlook()
            {
                return View("~/Views/Apps/Outlook.cshtml");
            }

            public IActionResult ApiKeys()
            {
                return View("~/Views/Apps/ApiKeys.cshtml");
            }

            public IActionResult IssueTracker()
            {
                return View("~/Views/Apps/IssueTracker.cshtml");
            }

            public IActionResult Companies()
            {
                return View("~/Views/Apps/Companies.cshtml");
            }

            public IActionResult Clients()
            {
                return View("~/Views/Apps/Clients.cshtml");
            }

            public IActionResult PinBoard()
            {
                return View("~/Views/Apps/PinBoard.cshtml");
            }

            public IActionResult SocialFeed()
            {
                return View("~/Views/Apps/SocialFeed.cshtml");
            }

            public IActionResult Calendar()
            {
                return View("~/Views/Apps/Calendar.cshtml");
            }

        }
}