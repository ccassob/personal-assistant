using Microsoft.AspNetCore.Mvc;

namespace Inspinia.Controllers
{
    public class PluginsController : Controller
    {
        public IActionResult LoadingButtons()
            {
                return View("~/Views/Plugins/LoadingButtons.cshtml");
            }

            public IActionResult Tour()
            {
                return View("~/Views/Plugins/Tour.cshtml");
            }

            public IActionResult IdleTimer()
            {
                return View("~/Views/Plugins/IdleTimer.cshtml");
            }

            public IActionResult Animation()
            {
                return View("~/Views/Plugins/Animation.cshtml");
            }

            public IActionResult Clipboard()
            {
                return View("~/Views/Plugins/Clipboard.cshtml");
            }

            public IActionResult TreeView()
            {
                return View("~/Views/Plugins/TreeView.cshtml");
            }

            public IActionResult Masonry()
            {
                return View("~/Views/Plugins/Masonry.cshtml");
            }

            public IActionResult I18()
            {
                return View("~/Views/Plugins/I18.cshtml");
            }

            public IActionResult SweetAlerts()
            {
                return View("~/Views/Plugins/SweetAlerts.cshtml");
            }

            public IActionResult TextDiff()
            {
                return View("~/Views/Plugins/TextDiff.cshtml");
            }

            public IActionResult PdfViewer()
            {
                return View("~/Views/Plugins/PdfViewer.cshtml");
            }

            public IActionResult PassMeter()
            {
                return View("~/Views/Plugins/PassMeter.cshtml");
            }

            public IActionResult Sortable()
            {
                return View("~/Views/Plugins/Sortable.cshtml");
            }

            public IActionResult VideoPlayer()
            {
                return View("~/Views/Plugins/VideoPlayer.cshtml");
            }

            public IActionResult LiveFavicon()
            {
                return View("~/Views/Plugins/LiveFavicon.cshtml");
            }

        }
}