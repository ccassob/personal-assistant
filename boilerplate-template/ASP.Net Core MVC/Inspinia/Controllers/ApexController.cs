using Microsoft.AspNetCore.Mvc;

namespace Inspinia.Controllers
{
    public class ApexController : Controller
    {
        public IActionResult Line()
            {
                return View("~/Views/Charts/Apex/Line.cshtml");
            }

            public IActionResult Mixed()
            {
                return View("~/Views/Charts/Apex/Mixed.cshtml");
            }

            public IActionResult Heatmap()
            {
                return View("~/Views/Charts/Apex/Heatmap.cshtml");
            }

            public IActionResult Boxplot()
            {
                return View("~/Views/Charts/Apex/Boxplot.cshtml");
            }

            public IActionResult Slope()
            {
                return View("~/Views/Charts/Apex/Slope.cshtml");
            }

            public IActionResult Area()
            {
                return View("~/Views/Charts/Apex/Area.cshtml");
            }

            public IActionResult Range()
            {
                return View("~/Views/Charts/Apex/Range.cshtml");
            }

            public IActionResult Scatter()
            {
                return View("~/Views/Charts/Apex/Scatter.cshtml");
            }

            public IActionResult Radialbar()
            {
                return View("~/Views/Charts/Apex/Radialbar.cshtml");
            }

            public IActionResult Bar()
            {
                return View("~/Views/Charts/Apex/Bar.cshtml");
            }

            public IActionResult Pie()
            {
                return View("~/Views/Charts/Apex/Pie.cshtml");
            }

            public IActionResult Candlestick()
            {
                return View("~/Views/Charts/Apex/Candlestick.cshtml");
            }

            public IActionResult Bubble()
            {
                return View("~/Views/Charts/Apex/Bubble.cshtml");
            }

            public IActionResult Column()
            {
                return View("~/Views/Charts/Apex/Column.cshtml");
            }

            public IActionResult Timeline()
            {
                return View("~/Views/Charts/Apex/Timeline.cshtml");
            }

            public IActionResult Funnel()
            {
                return View("~/Views/Charts/Apex/Funnel.cshtml");
            }

            public IActionResult Sparklines()
            {
                return View("~/Views/Charts/Apex/Sparklines.cshtml");
            }

            public IActionResult PolarArea()
            {
                return View("~/Views/Charts/Apex/PolarArea.cshtml");
            }

            public IActionResult Treemap()
            {
                return View("~/Views/Charts/Apex/Treemap.cshtml");
            }

            public IActionResult Radar()
            {
                return View("~/Views/Charts/Apex/Radar.cshtml");
            }

        }
}