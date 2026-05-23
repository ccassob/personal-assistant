using Microsoft.AspNetCore.Mvc;

namespace Inspinia.Controllers
{
    public class ProjectsController : Controller
    {
        public IActionResult Kanban()
            {
                return View("~/Views/Apps/Projects/Kanban.cshtml");
            }

            public IActionResult List()
            {
                return View("~/Views/Apps/Projects/List.cshtml");
            }

            public IActionResult TeamBoard()
            {
                return View("~/Views/Apps/Projects/TeamBoard.cshtml");
            }

            public IActionResult Details()
            {
                return View("~/Views/Apps/Projects/Details.cshtml");
            }

            public IActionResult Activity()
            {
                return View("~/Views/Apps/Projects/Activity.cshtml");
            }

            public IActionResult Grid()
            {
                return View("~/Views/Apps/Projects/Grid.cshtml");
            }

        }
}