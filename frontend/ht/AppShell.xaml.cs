using ht.Views;

namespace ht
{
    public partial class AppShell : Shell
    {
        public AppShell()
        {
            InitializeComponent();

            Routing.RegisterRoute("CategorySelectionPage", typeof(CategorySelectionPage));
            Routing.RegisterRoute("ExerciseSelectionPage", typeof(ExerciseSelectionPage));
            Routing.RegisterRoute("ExerciseEntryPage", typeof(ExerciseEntryPage));
        }
    }
}
