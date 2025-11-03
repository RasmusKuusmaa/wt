namespace ht.Models
{
    public class ExerciseProgression
    {
        public int exercise_id { get; set; }
        public string exercise_name { get; set; }
        public string category_name { get; set; }
        public double weekly_progression { get; set; }
        public double total_volume_change { get; set; }
    }
}
