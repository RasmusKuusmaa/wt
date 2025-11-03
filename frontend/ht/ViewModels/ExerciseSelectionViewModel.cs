using System.Collections.ObjectModel;
using System.Windows.Input;
using ht.Models;
using ht.Services;

namespace ht.ViewModels
{
    [QueryProperty(nameof(CategoryId), "categoryId")]
    public class ExerciseSelectionViewModel : BaseViewModel
    {
        private int _categoryId;
        public int CategoryId
        {
            get => _categoryId;
            set
            {
                _categoryId = value;
                OnPropertyChanged();
                LoadExercisesAsync();
            }
        }

        private ObservableCollection<Exercise> _exercises;
        public ObservableCollection<Exercise> Exercises
        {
            get => _exercises;
            set
            {
                _exercises = value;
                OnPropertyChanged();
            }
        }

        private Exercise _selectedExercise;
        public Exercise SelectedExercise
        {
            get => _selectedExercise;
            set
            {
                _selectedExercise = value;
                OnPropertyChanged();
                if (value != null)
                {
                    OnExerciseSelected(value);
                }
            }
        }

        public ExerciseSelectionViewModel()
        {
            Exercises = new ObservableCollection<Exercise>();
        }

        private async System.Threading.Tasks.Task LoadExercisesAsync()
        {
            try
            {
                var exercises = await ExerciseService.GetExercisesByCategoryAsync(CategoryId);
                Exercises.Clear();
                foreach (var exercise in exercises)
                {
                    Exercises.Add(exercise);
                }
            }
            catch (System.Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error loading exercises: {ex.Message}");
            }
        }

        private async void OnExerciseSelected(Exercise exercise)
        {
            await Shell.Current.GoToAsync($"ExerciseEntryPage?exerciseId={exercise.exercise_id}&exerciseName={exercise.name}");
        }
    }
}
