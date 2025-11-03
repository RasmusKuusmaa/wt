using ht.ViewModels;

namespace ht.Views;

public partial class ExerciseSelectionPage : ContentPage
{
    public ExerciseSelectionPage()
    {
        InitializeComponent();
        BindingContext = new ExerciseSelectionViewModel();
    }
}
