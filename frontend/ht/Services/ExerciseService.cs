using System.Collections.Generic;
using System.Threading.Tasks;
using ht.Models;

namespace ht.Services
{
    public class ExerciseService
    {
        public static async Task<List<Category>> GetCategoriesAsync()
        {
            var response = await ApiService.GetAsync<ApiResponse<List<Category>>>("/api/categories");
            return response.data;
        }

        public static async Task<List<Exercise>> GetExercisesByCategoryAsync(int categoryId)
        {
            var response = await ApiService.GetAsync<ApiResponse<List<Exercise>>>($"/api/categories/{categoryId}/exercises");
            return response.data;
        }

        public static async Task<List<Exercise>> GetAllExercisesAsync()
        {
            var response = await ApiService.GetAsync<ApiResponse<List<Exercise>>>("/api/exercises");
            return response.data;
        }
    }
}
