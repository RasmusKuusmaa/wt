using System.Collections.Generic;

namespace ht.Models
{
    public class WorkoutExercise
    {
        public int exercise_id { get; set; }
        public string exercise_name { get; set; }
        public List<WorkoutSet> sets { get; set; } = new List<WorkoutSet>();
    }
}
