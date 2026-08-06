using System.Security.Claims;
using PersonalAssistant.Api.Models;
using PersonalAssistant.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PersonalAssistant.Api.Controllers;

/// <summary>
/// CRUD endpoints for the current user's transaction categories.
/// Thin HTTP translator over <see cref="ICategoryService"/> — no business logic here.
/// </summary>
[ApiController]
[Authorize]
[Route("api/[controller]")]
public class CategoriesController(ICategoryService categoryService) : ControllerBase
{
    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    /// <summary>Returns all categories owned by the current user.</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await categoryService.GetAllAsync(CurrentUserId);

        return result.ToActionResult(this);
    }

    /// <summary>Returns a single category by id, scoped to the current user.</summary>
    /// <param name="id">Category id.</param>
    /// <returns>200 with the category, or 404 if it doesn't exist or isn't owned by the current user.</returns>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await categoryService.GetByIdAsync(id, CurrentUserId);

        return result.ToActionResult(this);
    }

    /// <summary>Creates a new category for the current user.</summary>
    /// <param name="request">Fields for the new category.</param>
    /// <returns>201 with a Location header pointing at <see cref="GetById"/>.</returns>
    [HttpPost]
    public async Task<IActionResult> Create(CreateCategoryRequest request)
    {
        var result = await categoryService.CreateAsync(request, CurrentUserId);

        if (result.Succeeded)
        {
            return CreatedAtAction(nameof(GetById), new { id = result.Value!.Id }, result.Value);
        }

        return BadRequest(result.ErrorMessage);
    }

    /// <summary>Updates an existing category owned by the current user.</summary>
    /// <param name="id">Category id from the route.</param>
    /// <param name="request">Updated fields; <see cref="UpdateCategoryRequest.Id"/> must match <paramref name="id"/>.</param>
    /// <returns>204 on success, 400 if the route/body ids don't match, 404 if not found.</returns>
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateCategoryRequest request)
    {
        var result = await categoryService.UpdateAsync(id, request, CurrentUserId);

        return result.ToNoContentResult(this);
    }

    /// <summary>Deletes a category owned by the current user.</summary>
    /// <param name="id">Category id.</param>
    /// <returns>204 on success, 404 if not found.</returns>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await categoryService.DeleteAsync(id, CurrentUserId);

        return result.ToNoContentResult(this);
    }
}
