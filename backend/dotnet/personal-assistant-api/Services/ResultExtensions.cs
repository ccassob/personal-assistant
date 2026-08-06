using Microsoft.AspNetCore.Mvc;

namespace PersonalAssistant.Api.Services;

public static class ResultExtensions
{
    public static IActionResult ToActionResult<T>(this Result<T> result, ControllerBase controller) =>
        result.Error switch
        {
            ResultError.None => controller.Ok(result.Value),
            ResultError.NotFound => controller.NotFound(),
            ResultError.BadRequest => controller.BadRequest(result.ErrorMessage),
            _ => controller.BadRequest(result.ErrorMessage),
        };

    public static IActionResult ToNoContentResult(this Result result, ControllerBase controller) =>
        result.Error switch
        {
            ResultError.None => controller.NoContent(),
            ResultError.NotFound => controller.NotFound(),
            ResultError.BadRequest => controller.BadRequest(result.ErrorMessage),
            _ => controller.BadRequest(result.ErrorMessage),
        };
}
