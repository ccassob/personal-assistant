using Microsoft.AspNetCore.Mvc;

namespace Inspinia.Controllers
{
    public class EcommerceController : Controller
    {
        public IActionResult Marketplace()
            {
                return View("~/Views/Apps/Ecommerce/Marketplace.cshtml");
            }

            public IActionResult Settings()
            {
                return View("~/Views/Apps/Ecommerce/Settings.cshtml");
            }

            public IActionResult Checkout()
            {
                return View("~/Views/Apps/Ecommerce/Checkout.cshtml");
            }

            public IActionResult PurchasedOrders()
            {
                return View("~/Views/Apps/Ecommerce/PurchasedOrders.cshtml");
            }

            public IActionResult OrderAdd()
            {
                return View("~/Views/Apps/Ecommerce/OrderAdd.cshtml");
            }

            public IActionResult Customers()
            {
                return View("~/Views/Apps/Ecommerce/Customers.cshtml");
            }

            public IActionResult ProductAdd()
            {
                return View("~/Views/Apps/Ecommerce/ProductAdd.cshtml");
            }

            public IActionResult ProductStocks()
            {
                return View("~/Views/Apps/Ecommerce/ProductStocks.cshtml");
            }

            public IActionResult Sellers()
            {
                return View("~/Views/Apps/Ecommerce/Sellers.cshtml");
            }

            public IActionResult Sales()
            {
                return View("~/Views/Apps/Ecommerce/Sales.cshtml");
            }

            public IActionResult ProductDetails()
            {
                return View("~/Views/Apps/Ecommerce/ProductDetails.cshtml");
            }

            public IActionResult OrderDetails()
            {
                return View("~/Views/Apps/Ecommerce/OrderDetails.cshtml");
            }

            public IActionResult ProductViews()
            {
                return View("~/Views/Apps/Ecommerce/ProductViews.cshtml");
            }

            public IActionResult ProductsGrid()
            {
                return View("~/Views/Apps/Ecommerce/ProductsGrid.cshtml");
            }

            public IActionResult Cart()
            {
                return View("~/Views/Apps/Ecommerce/Cart.cshtml");
            }

            public IActionResult Orders()
            {
                return View("~/Views/Apps/Ecommerce/Orders.cshtml");
            }

            public IActionResult Attributes()
            {
                return View("~/Views/Apps/Ecommerce/Attributes.cshtml");
            }

            public IActionResult Warehouse()
            {
                return View("~/Views/Apps/Ecommerce/Warehouse.cshtml");
            }

            public IActionResult Categories()
            {
                return View("~/Views/Apps/Ecommerce/Categories.cshtml");
            }

            public IActionResult Products()
            {
                return View("~/Views/Apps/Ecommerce/Products.cshtml");
            }

            public IActionResult SellerDetails()
            {
                return View("~/Views/Apps/Ecommerce/SellerDetails.cshtml");
            }

            public IActionResult Refunds()
            {
                return View("~/Views/Apps/Ecommerce/Refunds.cshtml");
            }

            public IActionResult Reviews()
            {
                return View("~/Views/Apps/Ecommerce/Reviews.cshtml");
            }

        }
}