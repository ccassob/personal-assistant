using Microsoft.AspNetCore.Mvc;

namespace Inspinia.Controllers
{
    public class DatatablesController : Controller
    {
        public IActionResult ExportData()
            {
                return View("~/Views/Tables/Datatables/ExportData.cshtml");
            }

            public IActionResult RowsAdd()
            {
                return View("~/Views/Tables/Datatables/RowsAdd.cshtml");
            }

            public IActionResult Scroll()
            {
                return View("~/Views/Tables/Datatables/Scroll.cshtml");
            }

            public IActionResult Javascript()
            {
                return View("~/Views/Tables/Datatables/Javascript.cshtml");
            }

            public IActionResult ColumnSearching()
            {
                return View("~/Views/Tables/Datatables/ColumnSearching.cshtml");
            }

            public IActionResult Columns()
            {
                return View("~/Views/Tables/Datatables/Columns.cshtml");
            }

            public IActionResult CheckboxSelect()
            {
                return View("~/Views/Tables/Datatables/CheckboxSelect.cshtml");
            }

            public IActionResult FixedColumns()
            {
                return View("~/Views/Tables/Datatables/FixedColumns.cshtml");
            }

            public IActionResult FixedHeader()
            {
                return View("~/Views/Tables/Datatables/FixedHeader.cshtml");
            }

            public IActionResult RangeSearch()
            {
                return View("~/Views/Tables/Datatables/RangeSearch.cshtml");
            }

            public IActionResult Ajax()
            {
                return View("~/Views/Tables/Datatables/Ajax.cshtml");
            }

            public IActionResult Rendering()
            {
                return View("~/Views/Tables/Datatables/Rendering.cshtml");
            }

            public IActionResult Select()
            {
                return View("~/Views/Tables/Datatables/Select.cshtml");
            }

            public IActionResult Basic()
            {
                return View("~/Views/Tables/Datatables/Basic.cshtml");
            }

            public IActionResult ChildRows()
            {
                return View("~/Views/Tables/Datatables/ChildRows.cshtml");
            }

        }
}