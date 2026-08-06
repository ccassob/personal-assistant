using Mapster;
using Microsoft.EntityFrameworkCore;
using PersonalAssistant.Api.Data;
using PersonalAssistant.Api.Models;

namespace PersonalAssistant.Api.Services;

public class CategoryService(PersonalAssistantDbContext dbContext) : ICategoryService
{
    public async Task<Result<List<CategoryDto>>> GetAllAsync(string userId)
    {
        var categories = await dbContext.Categories
            .Where(c => c.UserId == userId)
            .ProjectToType<CategoryDto>()
            .ToListAsync();

        return Result<List<CategoryDto>>.Ok(categories);
    }

    public async Task<Result<CategoryDto>> GetByIdAsync(int id, string userId)
    {
        var category = await dbContext.Categories.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

        if (category is null)
        {
            return Result<CategoryDto>.NotFound();
        }

        return Result<CategoryDto>.Ok(category.Adapt<CategoryDto>());
    }

    public async Task<Result<CategoryDto>> CreateAsync(CreateCategoryRequest request, string userId)
    {
        var category = request.Adapt<Category>();
        category.UserId = userId;

        dbContext.Categories.Add(category);
        await dbContext.SaveChangesAsync();

        return Result<CategoryDto>.Ok(category.Adapt<CategoryDto>());
    }

    public async Task<Result> UpdateAsync(int id, UpdateCategoryRequest request, string userId)
    {
        if (id != request.Id)
        {
            return Result.BadRequest();
        }

        var existing = await dbContext.Categories.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

        if (existing is null)
        {
            return Result.NotFound();
        }

        request.Adapt(existing);
        await dbContext.SaveChangesAsync();

        return Result.Ok();
    }

    public async Task<Result> DeleteAsync(int id, string userId)
    {
        var category = await dbContext.Categories.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

        if (category is null)
        {
            return Result.NotFound();
        }

        dbContext.Categories.Remove(category);
        await dbContext.SaveChangesAsync();

        return Result.Ok();
    }
}
