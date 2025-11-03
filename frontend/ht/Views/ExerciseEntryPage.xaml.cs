using ht.ViewModels;

namespace ht.Views;

public partial class ExerciseEntryPage : ContentPage
{
    public ExerciseEntryPage()
    {
        InitializeComponent();
        BindingContext = new ExerciseEntryViewModel();
    }
}
