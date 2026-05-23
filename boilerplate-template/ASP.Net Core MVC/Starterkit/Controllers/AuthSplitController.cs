using Microsoft.AspNetCore.Mvc;

namespace Starterkit.Controllers
{
    public class AuthSplitController : Controller
    {
        public IActionResult SignIn()
            {
                return View("~/Views/AuthSplit/SignIn.cshtml");
            }

            public IActionResult SuccessMail()
            {
                return View("~/Views/AuthSplit/SuccessMail.cshtml");
            }

            public IActionResult LockScreen()
            {
                return View("~/Views/AuthSplit/LockScreen.cshtml");
            }

            public IActionResult NewPass()
            {
                return View("~/Views/AuthSplit/NewPass.cshtml");
            }

            public IActionResult LoginPin()
            {
                return View("~/Views/AuthSplit/LoginPin.cshtml");
            }

            public IActionResult SignUp()
            {
                return View("~/Views/AuthSplit/SignUp.cshtml");
            }

            public IActionResult ResetPass()
            {
                return View("~/Views/AuthSplit/ResetPass.cshtml");
            }

            public IActionResult DeleteAccount()
            {
                return View("~/Views/AuthSplit/DeleteAccount.cshtml");
            }

            public IActionResult TwoFactor()
            {
                return View("~/Views/AuthSplit/TwoFactor.cshtml");
            }

        }
}