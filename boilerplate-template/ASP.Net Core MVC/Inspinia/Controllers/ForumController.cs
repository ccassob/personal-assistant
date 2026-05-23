using Microsoft.AspNetCore.Mvc;

namespace Inspinia.Controllers
{
    public class ForumController : Controller
    {
        public IActionResult ForumView()
            {
                return View("~/Views/Apps/Forum/View.cshtml");
            }

            public IActionResult Post()
            {
                return View("~/Views/Apps/Forum/Post.cshtml");
            }

        }
}