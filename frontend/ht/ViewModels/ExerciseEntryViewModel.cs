using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Windows.Input;
using ht.Models;
using ht.Services;

namespace ht.ViewModels
{
    [QueryProperty(nameof(ExerciseId), "exerciseId")]
    [QueryProperty(nameof(ExerciseName), "exerciseName")]
    public class ExerciseEntryViewModel : BaseViewModel
    {
        private int _exerciseId;
        public int ExerciseId
        {
            get => _exerciseId;
            set
            {
                _exerciseId = value;
                OnPropertyChanged();
            }
        }

        private string _exerciseName;
        public string ExerciseName
        {
            get => _exerciseName;
            set
            {
                _exerciseName = value;
                OnPropertyChanged();
            }
        }

        private DateTime _workoutDate;
        public DateTime WorkoutDate
        {
            get => _workoutDate;
            set
            {
                _workoutDate = value;
                OnPropertyChanged();
            }
        }

        private ObservableCollection<WorkoutSet> _sets;
        public ObservableCollection<WorkoutSet> Sets
        {
            get => _sets;
            set
            {
                _sets = value;
                OnPropertyChanged();
            }
        }

        private string _weight;
        public string Weight
        {
            get => _weight;
            set
            {
                _weight = value;
                OnPropertyChanged();
            }
        }

        private string _reps;
        public string Reps
        {
            get => _reps;
            set
            {
                _reps = value;
                OnPropertyChanged();
            }
        }

        public ICommand AddSetCommand { get; }
        public ICommand SaveWorkoutCommand { get; }

        public ExerciseEntryViewModel()
        {
            Sets = new ObservableCollection<WorkoutSet>();
            WorkoutDate = DateTime.Now;
            AddSetCommand = new Command(OnAddSet);
            SaveWorkoutCommand = new Command(OnSaveWorkout);
        }

        private void OnAddSet()
        {
            if (string.IsNullOrWhiteSpace(Weight) || string.IsNullOrWhiteSpace(Reps))
            {
                return;
            }

            if (double.TryParse(Weight, out double weight) && int.TryParse(Reps, out int reps))
            {
                Sets.Add(new WorkoutSet
                {
                    set_number = Sets.Count + 1,
                    weight = weight,
                    reps = reps
                });

                Weight = string.Empty;
                Reps = string.Empty;
            }
        }

        private async void OnSaveWorkout()
        {
            if (Sets.Count == 0)
            {
                return;
            }

            try
            {
                var workout = new Workout
                {
                    date = WorkoutDate.ToString("yyyy-MM-dd"),
                    exercises = new System.Collections.Generic.List<WorkoutExercise>
                    {
                        new WorkoutExercise
                        {
                            exercise_id = ExerciseId,
                            exercise_name = ExerciseName,
                            sets = Sets.ToList()
                        }
                    }
                };

                await WorkoutService.CreateWorkoutAsync(workout);
                await Shell.Current.GoToAsync("//WorkoutPage");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error saving workout: {ex.Message}");
            }
        }
    }
}
