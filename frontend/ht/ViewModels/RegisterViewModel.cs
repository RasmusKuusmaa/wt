using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace ht.ViewModels
{
    public class RegisterViewModel : BaseViewModel
    {
        private string _email;

        public string Email
        {
            get { return _email; }
            set
            {
                _email = value;
                OnPropertyChanged();
            }
        }

        private string _password;

        public string Password
        {
            get { return _password; }
            set
            {
                _password = value;
                OnPropertyChanged();
            }
        }

        private string _confirmPassword;

        public string ConfirmPassword
        {
            get { return _confirmPassword; }
            set { _confirmPassword = value;

                OnPropertyChanged();
            }
        }



        private async void OnGoToLogin()
        {
            await Shell.Current.GoToAsync("//LoginPage");
        }
        public ICommand GoToLoginCommand { get; }

        public RegisterViewModel()
        {
            GoToLoginCommand = new Command(OnGoToLogin);
        }
    }
}
