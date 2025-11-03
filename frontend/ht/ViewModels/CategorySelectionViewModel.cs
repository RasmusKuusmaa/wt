using System.Collections.ObjectModel;
using System.Windows.Input;
using ht.Models;
using ht.Services;

namespace ht.ViewModels
{
    public class CategorySelectionViewModel : BaseViewModel
    {
        private ObservableCollection<Category> _categories;
        public ObservableCollection<Category> Categories
        {
            get => _categories;
            set
            {
                _categories = value;
                OnPropertyChanged();
            }
        }

        private Category _selectedCategory;
        public Category SelectedCategory
        {
            get => _selectedCategory;
            set
            {
                _selectedCategory = value;
                OnPropertyChanged();
                if (value != null)
                {
                    OnCategorySelected(value);
                }
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

        public CategorySelectionViewModel()
        {
            Categories = new ObservableCollection<Category>();
            _ = LoadCategoriesAsync();
        }

        private async System.Threading.Tasks.Task LoadCategoriesAsync()
        {
            try
            {
                System.Diagnostics.Debug.WriteLine("Loading categories...");
                var categories = await ExerciseService.GetCategoriesAsync();
                System.Diagnostics.Debug.WriteLine($"Loaded {categories.Count} categories");

                Categories.Clear();
                foreach (var category in categories)
                {
                    Categories.Add(category);
                    System.Diagnostics.Debug.WriteLine($"Added category: {category.name}");
                }
            }
            catch (System.Exception ex)
            {
                ErrorMessage = $"Failed to load categories: {ex.Message}";
                System.Diagnostics.Debug.WriteLine($"Error loading categories: {ex.Message}");
                System.Diagnostics.Debug.WriteLine($"Stack trace: {ex.StackTrace}");
            }
        }

        private async void OnCategorySelected(Category category)
        {
            await Shell.Current.GoToAsync($"ExerciseSelectionPage?categoryId={category.category_id}");
        }
    }
}
