using System.Collections.Generic;
using System.Threading.Tasks;
using ht.Models;

namespace ht.Services
{
    public class WeightService
    {
        public static async Task<UserWeight> AddWeightAsync(double weight, string date = null)
        {
            var data = new { weight, date };
            var response = await ApiService.PostAsync<ApiResponse<UserWeight>>("/api/weight", data);
            return response.data;
        }

        public static async Task<List<UserWeight>> GetWeightHistoryAsync()
        {
            var response = await ApiService.GetAsync<ApiResponse<List<UserWeight>>>("/api/weight/history");
            return response.data;
        }

        public static async Task SetGoalAsync(double goalWeight)
        {
            var data = new { goal_weight = goalWeight };
            await ApiService.PostAsync<ApiResponse<object>>("/api/weight/goal", data);
        }

        public static async Task<WeightStats> GetWeightStatsAsync()
        {
            var response = await ApiService.GetAsync<ApiResponse<WeightStats>>("/api/weight/stats");
            return response.data;
        }
    }
}
