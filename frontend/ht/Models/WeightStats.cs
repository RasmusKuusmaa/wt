namespace ht.Models
{
    public class WeightStats
    {
        public double current_weight { get; set; }
        public double goal_weight { get; set; }
        public double weight_to_lose { get; set; }
        public double average_weekly_loss { get; set; }
        public int weeks_to_goal { get; set; }
        public string estimated_completion_date { get; set; }
    }
}
