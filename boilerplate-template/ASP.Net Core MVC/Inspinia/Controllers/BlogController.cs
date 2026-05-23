using Microsoft.AspNetCore.Mvc;

namespace Inspinia.Controllers
{
    public class BlogController : Controller
    {
        public IActionResult List()
            {
                return View("~/Views/Apps/Blog/List.cshtml");
            }

            public IActionResult Add()
            {
                return View("~/Views/Apps/Blog/Add.cshtml");
            }

            public IActionResult Article()
            {
                return View("~/Views/Apps/Blog/Article.cshtml");
            }

            public IActionResult Grid()
            {
                return View("~/Views/Apps/Blog/Grid.cshtml");
            }

        }
}