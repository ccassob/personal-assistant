using Microsoft.AspNetCore.Mvc;

namespace Inspinia.Controllers
{
    public class UsersController : Controller
    {
        public IActionResult Roles()
            {
                return View("~/Views/Apps/Users/Roles.cshtml");
            }

            public IActionResult Permissions()
            {
                return View("~/Views/Apps/Users/Permissions.cshtml");
            }

            public IActionResult RoleDetails()
            {
                return View("~/Views/Apps/Users/RoleDetails.cshtml");
            }

            public IActionResult Contacts()
            {
                return View("~/Views/Apps/Users/Contacts.cshtml");
            }

        }
}