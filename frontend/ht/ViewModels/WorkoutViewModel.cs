using System.Collections.ObjectModel;
using System.Windows.Input;
using ht.Models;
using ht.Services;

namespace ht.ViewModels
{
    public class WorkoutViewModel : BaseViewModel
    {
        private ObservableCollection<Workout> _workouts;
        public ObservableCollection<Workout> Workouts
        {
            get => _workouts;
            set
            {
                _workouts = value;
                OnPropertyChanged();
            }
        }

        private string _errorMessage;
        public string ErrorMessage
        {
            get => _errorMessage;
            set
            {
                _errorMessage = value;
                OnPropertyChanged();
            }
        }

        public ICommand AddWorkoutCommand { get; }
        public ICommand RefreshCommand { get; }

        public WorkoutViewModel()
        {
            Workouts = new ObservableCollection<Workout>();
            AddWorkoutCommand = new Command(OnAddWorkout);
            RefreshCommand = new Command(async () => await LoadWorkoutsAsync());

            _ = LoadWorkoutsAsync();
        }

        private async System.Threading.Tasks.Task LoadWorkoutsAsync()
        {
            try
            {
                System.Diagnostics.Debug.WriteLine("Loading workouts...");
                var workouts = await WorkoutService.GetWorkoutsAsync();
                System.Diagnostics.Debug.WriteLine($"Loaded {workouts.Count} workouts");

                Workouts.Clear();
                foreach (var workout in workouts)
                {
                    Workouts.Add(workout);
                }
            }
            catch (System.Exception ex)
            {
                ErrorMessage = $"Failed to load workouts: {ex.Message}";
                System.Diagnostics.Debug.WriteLine($"Error loading workouts: {ex.Message}");
                System.Diagnostics.Debug.WriteLine($"Stack trace: {ex.StackTrace}");
            }
        }

        private async void OnAddWorkout()
        {
            await Shell.Current.GoToAsync("CategorySelectionPage");
        }
    }
}
