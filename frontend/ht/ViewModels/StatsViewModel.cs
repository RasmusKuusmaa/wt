using System.Collections.ObjectModel;
using System.Linq;
using System.Windows.Input;
using ht.Models;
using ht.Services;

namespace ht.ViewModels
{
    public class StatsViewModel : BaseViewModel
    {
        private WeightStats _weightStats;
        public WeightStats WeightStats
        {
            get => _weightStats;
            set
            {
                _weightStats = value;
                OnPropertyChanged();
            }
        }

        private string _currentWeight;
        public string CurrentWeight
        {
            get => _currentWeight;
            set
            {
                _currentWeight = value;
                OnPropertyChanged();
            }
        }

        private string _goalWeight;
        public string GoalWeight
        {
            get => _goalWeight;
            set
            {
                _goalWeight = value;
                OnPropertyChanged();
            }
        }

        private ObservableCollection<ExerciseProgression> _exercises;
        public ObservableCollection<ExerciseProgression> Exercises
        {
            get => _exercises;
            set
            {
                _exercises = value;
                OnPropertyChanged();
            }
        }

        private ObservableCollection<ExerciseProgression> _filteredExercises;
        public ObservableCollection<ExerciseProgression> FilteredExercises
        {
            get => _filteredExercises;
            set
            {
                _filteredExercises = value;
                OnPropertyChanged();
            }
        }

        private string _selectedCategory;
        public string SelectedCategory
        {
            get => _selectedCategory;
            set
            {
                _selectedCategory = value;
                OnPropertyChanged();
                FilterExercises();
            }
        }

        private ObservableCollection<string> _categories;
        public ObservableCollection<string> Categories
        {
            get => _categories;
            set
            {
                _categories = value;
                OnPropertyChanged();
            }
        }

        public ICommand UpdateWeightCommand { get; }
        public ICommand UpdateGoalCommand { get; }
        public ICommand RefreshCommand { get; }

        public StatsViewModel()
        {
            Exercises = new ObservableCollection<ExerciseProgression>();
            FilteredExercises = new ObservableCollection<ExerciseProgression>();
            Categories = new ObservableCollection<string> { "All" };

            UpdateWeightCommand = new Command(OnUpdateWeight);
            UpdateGoalCommand = new Command(OnUpdateGoal);
            RefreshCommand = new Command(async () => await LoadDataAsync());

            SelectedCategory = "All";
            LoadDataAsync();
        }

        private async System.Threading.Tasks.Task LoadDataAsync()
        {
            try
            {
                var stats = await WeightService.GetWeightStatsAsync();
                WeightStats = stats;

                if (stats != null)
                {
                    CurrentWeight = stats.current_weight.ToString();
                    GoalWeight = stats.goal_weight.ToString();
                }

                var progressions = await WorkoutService.GetExerciseProgressionAsync();
                Exercises.Clear();
                FilteredExercises.Clear();

                var uniqueCategories = progressions.Select(p => p.category_name).Distinct().OrderBy(c => c).ToList();
                Categories.Clear();
                Categories.Add("All");
                foreach (var cat in uniqueCategories)
                {
                    Categories.Add(cat);
                }

                foreach (var progression in progressions)
                {
                    Exercises.Add(progression);
                    FilteredExercises.Add(progression);
                }
            }
            catch (System.Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error loading stats: {ex.Message}");
            }
        }

        private void FilterExercises()
        {
            FilteredExercises.Clear();

            var filtered = SelectedCategory == "All"
                ? Exercises
                : Exercises.Where(e => e.category_name == SelectedCategory);

            foreach (var exercise in filtered)
            {
                FilteredExercises.Add(exercise);
            }
        }

        private async void OnUpdateWeight()
        {
            if (string.IsNullOrWhiteSpace(CurrentWeight))
            {
                return;
            }

            if (double.TryParse(CurrentWeight, out double weight))
            {
                try
                {
                    await WeightService.AddWeightAsync(weight);
                    await LoadDataAsync();
                }
                catch (System.Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine($"Error updating weight: {ex.Message}");
                }
            }
        }

        private async void OnUpdateGoal()
        {
            if (string.IsNullOrWhiteSpace(GoalWeight))
            {
                return;
            }

            if (double.TryParse(GoalWeight, out double goalWeight))
            {
                try
                {
                    await WeightService.SetGoalAsync(goalWeight);
                    await LoadDataAsync();
                }
                catch (System.Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine($"Error updating goal: {ex.Message}");
                }
            }
        }
    }
}
