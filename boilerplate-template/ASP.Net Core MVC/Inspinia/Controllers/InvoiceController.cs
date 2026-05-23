using Microsoft.AspNetCore.Mvc;

namespace Inspinia.Controllers
{
    public class InvoiceController : Controller
    {
        public IActionResult List()
            {
                return View("~/Views/Apps/Invoice/List.cshtml");
            }

            public IActionResult Details()
            {
                return View("~/Views/Apps/Invoice/Details.cshtml");
            }

            public IActionResult Create()
            {
                return View("~/Views/Apps/Invoice/Create.cshtml");
            }

        }
}