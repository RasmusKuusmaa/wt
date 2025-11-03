using ht.ViewModels;

namespace ht.Views;

public partial class CategorySelectionPage : ContentPage
{
    public CategorySelectionPage()
    {
        InitializeComponent();
        BindingContext = new CategorySelectionViewModel();
    }
}
