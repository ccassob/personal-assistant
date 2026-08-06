using PersonalAssistant.Api.Models;

namespace PersonalAssistant.Api.Services;

public interface ICategoryService
{
    Task<Result<List<CategoryDto>>> GetAllAsync(string userId);
    Task<Result<CategoryDto>> GetByIdAsync(int id, string userId);
    Task<Result<CategoryDto>> CreateAsync(CreateCategoryRequest request, string userId);
    Task<Result> UpdateAsync(int id, UpdateCategoryRequest request, string userId);
    Task<Result> DeleteAsync(int id, string userId);
}
