using Microsoft.AspNetCore.Mvc;

namespace Inspinia.Controllers
{
    public class AuthController : Controller
    {
        public IActionResult SignIn()
            {
                return View("~/Views/Auth/SignIn.cshtml");
            }

            public IActionResult SuccessMail()
            {
                return View("~/Views/Auth/SuccessMail.cshtml");
            }

            public IActionResult LockScreen()
            {
                return View("~/Views/Auth/LockScreen.cshtml");
            }

            public IActionResult NewPass()
            {
                return View("~/Views/Auth/NewPass.cshtml");
            }

            public IActionResult LoginPin()
            {
                return View("~/Views/Auth/LoginPin.cshtml");
            }

            public IActionResult SignUp()
            {
                return View("~/Views/Auth/SignUp.cshtml");
            }

            public IActionResult ResetPass()
            {
                return View("~/Views/Auth/ResetPass.cshtml");
            }

            public IActionResult DeleteAccount()
            {
                return View("~/Views/Auth/DeleteAccount.cshtml");
            }

            public IActionResult TwoFactor()
            {
                return View("~/Views/Auth/TwoFactor.cshtml");
            }

        }
}