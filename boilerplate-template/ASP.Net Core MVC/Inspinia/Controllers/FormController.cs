using Microsoft.AspNetCore.Mvc;

namespace Inspinia.Controllers
{
    public class FormController : Controller
    {
        public IActionResult Validation()
            {
                return View("~/Views/Form/Validation.cshtml");
            }

            public IActionResult TextEditors()
            {
                return View("~/Views/Form/TextEditors.cshtml");
            }

            public IActionResult RangeSlider()
            {
                return View("~/Views/Form/RangeSlider.cshtml");
            }

            public IActionResult Fileuploads()
            {
                return View("~/Views/Form/Fileuploads.cshtml");
            }

            public IActionResult Pickers()
            {
                return View("~/Views/Form/Pickers.cshtml");
            }

            public IActionResult Wizard()
            {
                return View("~/Views/Form/Wizard.cshtml");
            }

            public IActionResult Layout()
            {
                return View("~/Views/Form/Layout.cshtml");
            }

            public IActionResult OtherPlugin()
            {
                return View("~/Views/Form/OtherPlugin.cshtml");
            }

            public IActionResult Elements()
            {
                return View("~/Views/Form/Elements.cshtml");
            }

            public IActionResult Select()
            {
                return View("~/Views/Form/Select.cshtml");
            }

        }
}