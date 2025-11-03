using ht.ViewModels;

namespace ht.Views;

public partial class WorkoutPage : ContentPage
{
	public WorkoutPage()
	{
		InitializeComponent();
		BindingContext = new WorkoutViewModel();
	}
}