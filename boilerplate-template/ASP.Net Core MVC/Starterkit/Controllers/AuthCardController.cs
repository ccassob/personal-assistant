using Microsoft.AspNetCore.Mvc;

namespace Starterkit.Controllers
{
    public class AuthCardController : Controller
    {
        public IActionResult SignIn()
            {
                return View("~/Views/AuthCard/SignIn.cshtml");
            }

            public IActionResult SuccessMail()
            {
                return View("~/Views/AuthCard/SuccessMail.cshtml");
            }

            public IActionResult LockScreen()
            {
                return View("~/Views/AuthCard/LockScreen.cshtml");
            }

            public IActionResult NewPass()
            {
                return View("~/Views/AuthCard/NewPass.cshtml");
            }

            public IActionResult LoginPin()
            {
                return View("~/Views/AuthCard/LoginPin.cshtml");
            }

            public IActionResult SignUp()
            {
                return View("~/Views/AuthCard/SignUp.cshtml");
            }

            public IActionResult ResetPass()
            {
                return View("~/Views/AuthCard/ResetPass.cshtml");
            }

            public IActionResult DeleteAccount()
            {
                return View("~/Views/AuthCard/DeleteAccount.cshtml");
            }

            public IActionResult TwoFactor()
            {
                return View("~/Views/AuthCard/TwoFactor.cshtml");
            }

        }
}