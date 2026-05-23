using Microsoft.AspNetCore.Mvc;

namespace Inspinia.Controllers
{
    public class EchartController : Controller
    {
        public IActionResult Line()
            {
                return View("~/Views/Charts/Echart/Line.cshtml");
            }

            public IActionResult Heatmap()
            {
                return View("~/Views/Charts/Echart/Heatmap.cshtml");
            }

            public IActionResult GeoMap()
            {
                return View("~/Views/Charts/Echart/GeoMap.cshtml");
            }

            public IActionResult Area()
            {
                return View("~/Views/Charts/Echart/Area.cshtml");
            }

            public IActionResult Scatter()
            {
                return View("~/Views/Charts/Echart/Scatter.cshtml");
            }

            public IActionResult Bar()
            {
                return View("~/Views/Charts/Echart/Bar.cshtml");
            }

            public IActionResult Gauge()
            {
                return View("~/Views/Charts/Echart/Gauge.cshtml");
            }

            public IActionResult Pie()
            {
                return View("~/Views/Charts/Echart/Pie.cshtml");
            }

            public IActionResult Candlestick()
            {
                return View("~/Views/Charts/Echart/Candlestick.cshtml");
            }

            public IActionResult Radar()
            {
                return View("~/Views/Charts/Echart/Radar.cshtml");
            }

            public IActionResult Other()
            {
                return View("~/Views/Charts/Echart/Other.cshtml");
            }

        }
}