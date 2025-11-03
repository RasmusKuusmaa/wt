using System;
using System.Collections.Generic;

namespace ht.Models
{
    public class Workout
    {
        public int? workout_id { get; set; }
        public int user_id { get; set; }
        public string date { get; set; }
        public List<WorkoutExercise> exercises { get; set; } = new List<WorkoutExercise>();
    }
}
