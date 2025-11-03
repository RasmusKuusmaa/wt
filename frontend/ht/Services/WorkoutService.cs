using System.Collections.Generic;
using System.Threading.Tasks;
using ht.Models;

namespace ht.Services
{
    public class WorkoutService
    {
        public static async Task<Workout> CreateWorkoutAsync(Workout workout)
        {
            var response = await ApiService.PostAsync<ApiResponse<Workout>>("/api/workouts", workout);
            return response.data;
        }

        public static async Task<List<Workout>> GetWorkoutsAsync()
        {
            var response = await ApiService.GetAsync<ApiResponse<List<Workout>>>("/api/workouts");
            return response.data;
        }

        public static async Task<List<ExerciseProgression>> GetExerciseProgressionAsync()
        {
            var response = await ApiService.GetAsync<ApiResponse<List<ExerciseProgression>>>("/api/workouts/progression");
            return response.data;
        }
    }
}
