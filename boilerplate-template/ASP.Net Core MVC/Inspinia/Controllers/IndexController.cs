using Microsoft.AspNetCore.Mvc;

namespace Inspinia.Controllers
{
    public class IndexController : Controller
    {
        public IActionResult Index()
        {
            return View("~/Views/Index.cshtml");
        }
    }
}